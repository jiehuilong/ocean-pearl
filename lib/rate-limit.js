// Simple in-memory rate limiter — swap for Redis in production
const hits = new Map();

export function rateLimit({ interval = 60000, max = 10 } = {}) {
  return (key) => {
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, resetAt: now + interval };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + interval;
    }

    entry.count++;
    hits.set(key, entry);

    // Cleanup stale entries every 100 writes
    if (hits.size > 1000) {
      for (const [k, v] of hits) {
        if (Date.now() > v.resetAt) hits.delete(k);
      }
    }

    return {
      allowed: entry.count <= max,
      remaining: Math.max(0, max - entry.count),
      resetAt: entry.resetAt,
    };
  };
}

export const authLimiter = rateLimit({ interval: 60000, max: 5 });
export const apiLimiter = rateLimit({ interval: 60000, max: 60 });
