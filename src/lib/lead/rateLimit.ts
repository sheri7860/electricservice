// In-memory limiter. Move to Redis/Upstash for serverless hosting.
const hits = new Map<string, number[]>();
export function limited(key: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}
