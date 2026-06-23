import { db } from "./db";

const rateStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  interval: number; // ms
  maxRequests: number;
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = { interval: 60000, maxRequests: 5 }
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const key = `rate:${identifier}`;
  const entry = rateStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + options.interval });
    return { success: true, remaining: options.maxRequests - 1, resetAt: now + options.interval };
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: options.maxRequests - entry.count, resetAt: entry.resetAt };
}

// Очистка старых записей раз в минуту
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateStore.entries()) {
      if (now > entry.resetAt) {
        rateStore.delete(key);
      }
    }
  }, 60000);
}