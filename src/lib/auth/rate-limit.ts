// Simple in-memory rate limiter for auth endpoints
// For production, replace with Redis-based solution

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  });
}, 60_000);

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  "forgot-password": { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  "verify-email": { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
};

export function checkRateLimit(
  action: string,
  identifier: string,
): { allowed: boolean; retryAfterMs: number } {
  const config = RATE_LIMITS[action] ?? { maxAttempts: 10, windowMs: 60_000 };
  const key = `${action}:${identifier}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= config.maxAttempts) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
