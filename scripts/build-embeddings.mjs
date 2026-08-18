#!/usr/bin/env node
/**
 * Build `data/resume_index.json` from `data/resume_knowledge.csv`.
 *
 * Uses the Volcengine Ark OpenAI-compatible embeddings endpoint to embed each
 * row's English and Chinese passage, then writes a compact JSON index that
 * `app/api/search/route.ts` loads at cold start.
 *
 * Requires:
 *   - ARK_API_KEY in env (or in .env.local)
 *   - optional ARK_EMBEDDING_BASE_URL / ARK_EMBEDDING_MODEL overrides
 *
 * Run:
 *   npm run build:index
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(new URL('..', import.meta.url).pathname);
const CSV_PATH = resolve(REPO_ROOT, 'data/resume_knowledge.csv');
const OUT_PATH = resolve(REPO_ROOT, 'data/resume_index.json');
// Stripped-down copy for the client-side lexical fallback (static export).
// The full index carries 2048-d float vectors per record; the browser fallback
// only uses title/tech/content text, so we emit a separate ~15KB file to keep
// the dynamic-import chunk out of the megabyte range.
const CLIENT_OUT_PATH = resolve(REPO_ROOT, 'data/resume_client.json');

function loadEnvLocal() {
  const envFile = resolve(REPO_ROOT, '.env.local');
  if (!existsSync(envFile)) return;
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key]) continue;
    const value = rawValue.replace(/^['"]|['"]$/g, '');
    process.env[key] = value;
  }
}

loadEnvLocal();

const BASE_URL = process.env.ARK_EMBEDDING_BASE_URL || 'https://ark.cn-beijing.volces.com/api/coding/v3';
const MODEL = process.env.ARK_EMBEDDING_MODEL || 'doubao-embedding-vision';

/** Minimal RFC 4180 CSV parser (handles quoted fields and embedded commas / newlines / "" escapes). */
function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows
    .filter((r) => r.length === header.length && r.some((cell) => cell.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx]])));
}

function passageText(title, tech, content) {
  const bits = [title];
  if (tech && tech.trim()) bits.push(`(${tech})`);
  bits.push(content);
  return bits.filter(Boolean).join('\n');
}

function pickZh(row, key) {
  // fall back to the en field if the zh column is blank, so the index stays
  // symmetric (each language always has 17 vectors) and search never 404s
  const zh = (row[`${key}_zh`] || '').trim();
  return zh || row[key] || '';
}

async function embed(text) {
  const response = await fetch(`${BASE_URL.replace(/\/$/, '')}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.ARK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: [text],
      encoding_format: 'float',
    }),
  });
  const body = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    throw new Error(`Ark embeddings API ${response.status}: ${parsed?.error?.message || body.slice(0, 200)}`);
  }
  const rawVector = parsed?.data?.[0]?.embedding;
  const vector = Array.isArray(rawVector?.[0]) ? rawVector[0] : rawVector;
  if (!Array.isArray(vector) || vector.some((value) => typeof value !== 'number')) {
    throw new Error(`unexpected Ark embeddings response shape: ${body.slice(0, 200)}`);
  }
  return { vector, resolvedModel: parsed?.model ?? MODEL };
}

async function main() {
  if (!process.env.ARK_API_KEY) {
    console.error('error: ARK_API_KEY not set. Put it in .env.local or export it, then rerun.');
    process.exit(1);
  }
  if (!existsSync(CSV_PATH)) {
    console.error(`error: CSV not found at ${CSV_PATH}`);
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
  console.log(`csv rows : ${rows.length}`);
  console.log(`model    : ${MODEL}`);
  console.log(`base URL : ${BASE_URL}`);
  console.log();

  const records = [];
  let resolvedModel = MODEL;
  let dimensions = 0;
  const total = rows.length * 2; // en + zh
  let step = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // --- en pass ---
    step += 1;
    const enPassage = passageText(row.title, row.tech, row.content);
    process.stdout.write(`  [${step.toString().padStart(2)}/${total}] ${row.id.padEnd(24)} en ... `);
    const { vector: enVec, resolvedModel: m1 } = await embed(enPassage);
    resolvedModel = m1;
    dimensions = enVec.length;
    console.log(`ok (${enVec.length}d)`);

    // --- zh pass ---
    step += 1;
    const zhTitle = pickZh(row, 'title');
    const zhTech = pickZh(row, 'tech');
    const zhContent = pickZh(row, 'content');
    const zhPassage = passageText(zhTitle, zhTech, zhContent);
    process.stdout.write(`  [${step.toString().padStart(2)}/${total}] ${row.id.padEnd(24)} zh ... `);
    const { vector: zhVec } = await embed(zhPassage);
    console.log(`ok (${zhVec.length}d)`);

    records.push({
      id: row.id,
      category: row.category,
      link: row.link,
      en: {
        title: row.title,
        period: row.period,
        tech: row.tech,
        content: row.content,
        embedding: enVec,
      },
      zh: {
        title: zhTitle,
        period: pickZh(row, 'period'),
        tech: zhTech,
        content: zhContent,
        embedding: zhVec,
      },
    });
  }

  const generatedAt = new Date().toISOString();
  const index = {
    provider: 'volcengine',
    base_url: BASE_URL,
    model: resolvedModel,
    dimensions,
    generated_at: generatedAt,
    records,
  };
  writeFileSync(OUT_PATH, JSON.stringify(index) + '\n');

  // Lightweight client index — no embeddings, text fields only.
  const clientIndex = {
    model: resolvedModel,
    dimensions,
    generated_at: generatedAt,
    records: records.map((r) => ({
      id: r.id,
      category: r.category,
      link: r.link,
      en: { title: r.en.title, period: r.en.period, tech: r.en.tech, content: r.en.content },
      zh: { title: r.zh.title, period: r.zh.period, tech: r.zh.tech, content: r.zh.content },
    })),
  };
  writeFileSync(CLIENT_OUT_PATH, JSON.stringify(clientIndex) + '\n');

  const bytes = readFileSync(OUT_PATH).byteLength;
  const clientBytes = readFileSync(CLIENT_OUT_PATH).byteLength;
  console.log();
  console.log(`wrote ${OUT_PATH} (${(bytes / 1024).toFixed(1)} KB, ${records.length} records)`);
  console.log(`wrote ${CLIENT_OUT_PATH} (${(clientBytes / 1024).toFixed(1)} KB, embeddings stripped)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
