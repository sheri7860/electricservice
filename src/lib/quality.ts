import { cityLocal } from "@/content/cityLocal";
import { cityServices } from "@/content/cityServices";
import { citySeasons } from "@/content/citySeasons";
import { getService } from "@/content/services";

/** Quality gate for location pages. Fix failures by writing more real local content, never by lowering thresholds. */
export const MIN_CITY_WORDS = 180;
export const MIN_CITY_SERVICE_WORDS = 90;
export const MAX_SIBLING_SIMILARITY = 0.3;

const words = (s: string) => s.toLowerCase().match(/[a-z0-9']+/g) ?? [];
export const wordCount = (s: string) => words(s).length;

function shingles(s: string, n = 4) {
  const w = words(s);
  const set = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(" "));
  return set;
}
/** Jaccard similarity of 4-word shingles: catches city-name-swapped copy. */
export function similarity(a: string, b: string) {
  const A = shingles(a), B = shingles(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

export type GateResult = { ok: boolean; reasons: string[] };

export function cityGate(key: string): GateResult {
  const c = cityLocal[key];
  const reasons: string[] = [];
  if (!c) return { ok: false, reasons: ["no local content"] };
  const text = [c.intro, c.housing, citySeasons[key] ?? "", c.permits, ...c.issues].join(" ");
  if (wordCount(text) < MIN_CITY_WORDS) reasons.push(`local copy ${wordCount(text)} < ${MIN_CITY_WORDS} words`);
  if (c.issues.length < 2) reasons.push("fewer than 2 local issues");
  if (c.areas.length < 3) reasons.push("fewer than 3 neighborhoods");
  return { ok: !reasons.length, reasons };
}

export function cityServiceGate(key: string, service: string): GateResult {
  const note = cityServices[key]?.[service];
  const reasons: string[] = [];
  if (!note) return { ok: false, reasons: ["no local service note"] };
  if (!cityGate(key).ok) reasons.push("parent city fails gate");
  const svc = getService(service);
  if (!svc || svc.status !== "PUBLISHED") reasons.push("parent service not published");
  if (wordCount(note) < MIN_CITY_SERVICE_WORDS) reasons.push(`local note ${wordCount(note)} < ${MIN_CITY_SERVICE_WORDS} words`);
  for (const [k, m] of Object.entries(cityServices)) {
    if (k === key || !m[service]) continue;
    const sim = similarity(note, m[service]);
    if (sim > MAX_SIBLING_SIMILARITY) reasons.push(`too similar to ${k} (${sim.toFixed(2)})`);
  }
  return { ok: !reasons.length, reasons };
}
