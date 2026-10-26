import cov from "@/data/coverage.json";

type Town = { name: string; slug: string; county: string; zips: string[] };
const states = (cov as unknown as { states: Record<string, Town[]> }).states;
const memo = new Map<string, string[]>();

/**
 * Covered towns near a metro: towns in the same state whose ZIP codes share the metro's
 * 3-digit ZIP prefix or an adjacent one (USPS sectional centers are numbered regionally).
 * Largest first, so suburbs like Baker or Prairieville appear on the Baton Rouge pages.
 */
export function nearbyTowns(stateCode: string, citySlug: string, limit = 14): string[] {
  const key = `${stateCode}/${citySlug}/${limit}`;
  const hit = memo.get(key);
  if (hit) return hit;
  const list = states[stateCode] ?? [];
  const me = list.find((t) => t.slug === citySlug);
  if (!me) return [];
  const prefixes = new Set<number>();
  for (const z of me.zips) { const n = +z.slice(0, 3); prefixes.add(n - 1); prefixes.add(n); prefixes.add(n + 1); }
  const out = list
    .filter((t) => t.slug !== citySlug && t.zips.some((z) => prefixes.has(+z.slice(0, 3))))
    .sort((a, b) => b.zips.length - a.zips.length || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((t) => t.name);
  memo.set(key, out);
  return out;
}
