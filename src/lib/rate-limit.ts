/**
 * Simple in-memory rate limiter.
 *
 * NOTE: This store is per-process. In serverless environments (Vercel, etc.)
 * each cold-start gets a fresh Map, and concurrent requests may hit different
 * processes. This provides best-effort protection only. For strict enforcement,
 * use a distributed store (e.g. Upstash Redis).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 10000;

interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowSeconds }: RateLimitOptions
): { allowed: boolean; remaining: number } {
  const now = Date.now();

  // Evict expired entries when store grows large to prevent memory leaks
  if (store.size > MAX_STORE_SIZE) {
    for (const [k, v] of store) {
      if (now >= v.resetAt) store.delete(k);
    }
    // Hard cap: if still over limit after eviction, drop oldest entries
    // Map iterates in insertion order, so earliest-inserted entries are removed first
    if (store.size > MAX_STORE_SIZE) {
      let toRemove = store.size - MAX_STORE_SIZE;
      for (const [k] of store) {
        if (toRemove <= 0) break;
        store.delete(k);
        toRemove--;
      }
    }
  }

  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - entry.count };
}
