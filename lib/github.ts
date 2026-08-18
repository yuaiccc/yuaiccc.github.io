/**
 * Shared GitHub fetch helpers.
 *
 * Why this exists:
 *  - The home page previously fired 7 independent `cache: 'no-store'`
 *    requests to api.github.com on every visit (4 RepositoryActivity +
 *    2 star hooks + 1 search API), plus a cache-busted
 *    raw.githubusercontent.com fetch. With the unauthenticated rate limit
 *    at 60 req/h/IP, a visitor refreshing ~8 times hit 403s and every badge
 *    silently went missing.
 *  - A module-level cache deduplicates in-flight requests (so two components
 *    asking for the same URL share one network call) and keeps the response
 *    for TTL_MS, turning those 7 cold-load requests into at most 5 unique
 *    fetches and 0 on warm loads within the TTL.
 *  - We also drop `cache: 'no-store'` so the browser's HTTP cache can serve
 *    GitHub's own ETag-tagged responses on subsequent navigations.
 *
 * This module is client-safe (it only uses fetch + the browser cache); do
 * not import server-only secrets here.
 */

type CacheEntry<T> = {
  /** Resolved JSON payload. */
  value: T;
  /** Wall-clock expiration in ms (performance.timeOrigin-independent). */
  expiresAt: number;
};

type CacheMap = Map<string, CacheEntry<unknown>>;
type InflightMap = Map<string, Promise<unknown>>;

// Lazy singletons so this module works in both client and (if ever imported
// from a server component) server bundles without referencing `window` at
// module-eval time.
let _cache: CacheMap | null = null;
let _inflight: InflightMap | null = null;

const getCache = (): CacheMap => {
  if (!_cache) _cache = new Map();
  return _cache;
};

const getInflight = (): InflightMap => {
  if (!_inflight) _inflight = new Map();
  return _inflight;
};

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const GH_API_BASE = 'https://api.github.com';
const RAW_BASE = 'https://raw.githubusercontent.com';

const GH_HEADERS: HeadersInit = {
  Accept: 'application/vnd.github+json',
};

/**
 * Fetch a GitHub (or raw.githubusercontent.com) URL with:
 *   - in-flight promise deduping (same URL → same Promise while pending)
 *   - a short-lived in-memory cache so sibling components don't repeat calls
 *   - HTTP caching via `force-cache` (the browser stores GitHub's ETag-tagged
 *     responses and conditional requests take care of freshness)
 *
 * Returns the parsed JSON, or `null` when the request fails or returns a
 * non-OK status — callers already treat null as "no data".
 */
export async function fetchGitHubJson<T>(
  url: string,
  options: { ttlMs?: number; signal?: AbortSignal } = {},
): Promise<T | null> {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const cache = getCache();
  const inflight = getInflight();

  // 1. Fresh in-memory cache hit — zero network.
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }

  // 2. Same URL already in flight — share the pending promise so React Strict
  //    Mode double-invokes and sibling components don't produce duplicate calls.
  const pending = inflight.get(url) as Promise<T | null> | undefined;
  if (pending) return pending;

  const run = (async () => {
    try {
      const response = await fetch(url, {
        headers: GH_HEADERS,
        signal: options.signal,
        // Let the browser/HTTP cache do its job; GitHub returns ETags and
        // respects conditional requests. This is the key change from the
        // previous `no-store` that forced a fresh request every mount.
        cache: 'default',
      });
      if (!response.ok) return null;
      const data = (await response.json()) as T;
      cache.set(url, { value: data, expiresAt: Date.now() + ttlMs });
      return data;
    } catch {
      // A missing badge should never break the page. Keep a stale value if
      // we have one; otherwise resolve to null.
      const stale = cache.get(url);
      if (stale) return stale.value as T;
      return null;
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, run as Promise<unknown>);
  return run;
}

/** Fetch a repository metadata object (stargazers_count etc.). */
export const fetchRepo = (ownerRepo: string, signal?: AbortSignal) =>
  fetchGitHubJson<{ stargazers_count?: number }>(`${GH_API_BASE}/repos/${ownerRepo}`, {
    signal,
    ttlMs: 10 * 60 * 1000, // stars move slowly, cache 10 min
  });

/** Fetch the most recent commit for a repository (for "last updated" badges). */
export const fetchLatestCommitDate = (ownerRepo: string, signal?: AbortSignal) =>
  fetchGitHubJson<Array<{ commit?: { committer?: { date?: string } } }>>(
    `${GH_API_BASE}/repos/${ownerRepo}/commits?per_page=1`,
    { signal, ttlMs: 5 * 60 * 1000 },
  );

/**
 * Fetch the count of merged PRs opened by the signed-in user against a repo.
 * Uses the GitHub Search API (rate-limited more aggressively: 10 req/min
 * unauthenticated), so a longer TTL keeps us far from the ceiling.
 */
export const fetchMergedPrCount = (
  ownerRepo: string,
  author: string,
  signal?: AbortSignal,
) =>
  fetchGitHubJson<{ total_count?: number }>(
    `${GH_API_BASE}/search/issues?q=${encodeURIComponent(
      `repo:${ownerRepo} type:pr author:${author} is:merged`,
    )}&per_page=1`,
    { signal, ttlMs: 30 * 60 * 1000 }, // 30 min — search API is expensive
  );

/**
 * Fetch a JSON file from raw.githubusercontent.com with the same caching /
 * deduping behavior. No cache-buster query string — GitHub serves ETagged
 * content and a fresh commit produces a new URL anyway.
 */
export const fetchRawJson = <T>(url: string, signal?: AbortSignal, ttlMs = 5 * 60 * 1000) =>
  fetchGitHubJson<T>(url, { signal, ttlMs });

export const GITHUB_RAW_BASE = RAW_BASE;
