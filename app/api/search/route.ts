import { NextRequest, NextResponse } from 'next/server';
import indexData from '@/data/resume_index.json';

// Runs on Vercel Node runtime so `import` of the pre-built index bundles the
// JSON into the function payload (no filesystem read at cold start).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Lang = 'en' | 'zh';

type LangFields = {
  title: string;
  period: string;
  tech: string;
  content: string;
  embedding: number[];
};

type Record = {
  id: string;
  category: string;
  link: string;
  en: LangFields;
  zh: LangFields;
};

type Index = {
  provider?: string;
  base_url?: string;
  model: string;
  dimensions: number;
  generated_at: string | null;
  records: Record[];
};

const INDEX = indexData as unknown as Index;

// Pre-normalize both language pools once so /search is just a dot product.
type NormRecord = { record: Record; norm: number[] };
const POOLS: Readonly<{ en: NormRecord[]; zh: NormRecord[] }> = {
  en: INDEX.records.map((r) => ({ record: r, norm: normalize(r.en.embedding) })),
  zh: INDEX.records.map((r) => ({ record: r, norm: normalize(r.zh.embedding) })),
};

function normalize(vec: number[]): number[] {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) sumSq += vec[i] * vec[i];
  const len = Math.sqrt(sumSq) || 1;
  const out = new Array<number>(vec.length);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i] / len;
  return out;
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

function parseLang(raw: string | null): Lang {
  return raw === 'zh' ? 'zh' : 'en';
}

// ---- in-memory query-embedding cache (LRU by insertion order) ----
// The cache key is just the raw query text; EN and 中 searches share entries.
// Lives per warm function instance — a best-effort hit layer, not a source of
// truth. On a cold start it's simply empty.
const EMBED_CACHE_MAX = 256;
const embedCache = new Map<string, number[]>(); // stores the *normalized* vector

function cacheGet(key: string): number[] | undefined {
  const v = embedCache.get(key);
  if (v) {
    embedCache.delete(key);
    embedCache.set(key, v); // bump to most-recently-used
  }
  return v;
}

function cacheSet(key: string, val: number[]): void {
  if (embedCache.has(key)) embedCache.delete(key);
  embedCache.set(key, val);
  while (embedCache.size > EMBED_CACHE_MAX) {
    const oldest = embedCache.keys().next().value;
    if (oldest === undefined) break;
    embedCache.delete(oldest);
  }
}

// ---- in-memory per-IP rate limiter (fixed window) ----
// NOTE: serverless instances do NOT share memory, so a determined attacker
// spread across instances can exceed this. It only reliably stops a single
// client hammering one warm instance. For hard guarantees use Vercel Firewall
// or a shared store (Upstash).
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 10_000; // per 10s per IP
const rateHits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateHits.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    // opportunistic cleanup so the map can't grow unbounded
    if (rateHits.size > 10_000) {
      for (const [k, v] of rateHits) if (now >= v.resetAt) rateHits.delete(k);
    }
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

async function embedQuery(query: string, apiKey: string): Promise<number[]> {
  const baseUrl = INDEX.base_url || 'https://ark.cn-beijing.volces.com/api/coding/v3';
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: INDEX.model || 'doubao-embedding-vision',
      input: [query],
      encoding_format: 'float',
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ark embeddings API ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const rawVec = json?.data?.[0]?.embedding;
  const vec = Array.isArray(rawVec?.[0]) ? rawVec[0] : rawVec;
  if (!Array.isArray(vec)) throw new Error('unexpected Ark embeddings response shape');
  return vec;
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get('q') || '').trim();
  const lang = parseLang(request.nextUrl.searchParams.get('lang'));
  const topK = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get('k') || '5') | 0, 1),
    10,
  );

  if (!query) {
    return NextResponse.json({ error: 'missing ?q= parameter' }, { status: 400 });
  }
  if (query.length > 400) {
    return NextResponse.json({ error: 'query too long (max 400 chars)' }, { status: 400 });
  }

  // Guard the expensive Ark call behind a per-IP rate limit.
  const rl = rateLimit(clientIp(request));
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }
  const pool = POOLS[lang];
  if (pool.length === 0) {
    return NextResponse.json(
      { error: 'index is empty — run `npm run build:index` first' },
      { status: 503 },
    );
  }

  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'server missing ARK_API_KEY env var' },
      { status: 500 },
    );
  }

  // Reuse the normalized query vector if a warm instance has seen this exact
  // query before — skips the remote embedding round-trip entirely.
  let q = cacheGet(query);
  let cached = true;
  if (!q) {
    cached = false;
    let queryVec: number[];
    try {
      queryVec = await embedQuery(query, apiKey);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'embed failed' },
        { status: 502 },
      );
    }
    q = normalize(queryVec);
    cacheSet(query, q);
  }

  const scored = pool.map(({ record, norm }) => {
    const fields = record[lang];
    return {
      id: record.id,
      category: record.category,
      title: fields.title,
      period: fields.period,
      tech: fields.tech,
      link: record.link,
      content: fields.content,
      score: dot(q, norm),
    };
  });
  scored.sort((a, b) => b.score - a.score);

  return NextResponse.json(
    {
      query,
      lang,
      cached,
      model: INDEX.model,
      results: scored.slice(0, topK),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
