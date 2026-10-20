import { publishedServices, getService } from "@/content/services";
import { subservices, type Subservice } from "@/content/subservices";
import { coveredStates } from "@/content/locations";
import { citySeasons } from "@/content/citySeasons";
import { cityServices } from "@/content/cityServices";
import { cityPages, cityServicePages } from "./sitemap";
import { sentences } from "./text";
import { wordCount, similarity, MAX_SIBLING_SIMILARITY, MIN_CITY_SERVICE_WORDS } from "./quality";
import { subCityNotes } from "@/content/subCityNotes";

/**
 * Service x location coverage matrix. Every combination is either published or recorded with the reason
 * it is not, so `npm run coverage` can report potential vs eligible vs published.
 * Gates (never lowered to publish more pages; write real local content instead):
 *   service + state:     >= 2 cities in the state have a hand-written local note for the service
 *   subservice + city:   a hand-written note (>= 90 words, distinct from sibling notes) and no page for the
 *                        parent service in that city (which would already cover the same need)
 *   subservice + state:  >= 2 subservice + city pages in the state
 */
export const MIN_STATE_CITIES = 2;
export const MIN_SUB_LOCAL_WORDS = 30;

type CityPage = ReturnType<typeof cityPages>[number];

/** All hand-written local text for a city, as sentences. */
function citySentences(p: CityPage) {
  const key = `${p.state.code}/${p.city.slug}`;
  const blocks = [p.local.intro, p.local.housing, citySeasons[key] ?? "", ...p.local.issues.map((i) => i + "."), ...Object.values(cityServices[key] ?? {})];
  return [...new Set(blocks.flatMap((b) => sentences(b)))];
}

/** Local sentences that discuss a subservice topic in a given city. */
export function localFacts(p: CityPage, sub: Subservice) {
  return citySentences(p).filter((s) => sub.topic.test(s));
}

let _stateService: ReturnType<typeof buildStateService> | undefined;
export const stateServicePages = () => (_stateService ??= buildStateService());
function buildStateService() {
  return coveredStates.flatMap((state) =>
    publishedServices.flatMap((service) => {
      const cities = cityServicePages().filter((p) => p.state.code === state.code && p.service.slug === service.slug);
      return cities.length >= MIN_STATE_CITIES ? [{ state, service, cities }] : [];
    }),
  );
}

let _subCity: ReturnType<typeof buildSubCity> | undefined;
export const subCityPages = () => (_subCity ??= buildSubCity());
/** Why a subservice + city combination is not published ("" means eligible). */
export function subCityGate(p: CityPage, sub: Subservice) {
  const key = `${p.state.code}/${p.city.slug}`;
  const note = subCityNotes[key]?.[sub.slug];
  if (!note) return "no hand-written local note yet";
  // A distinct sub-intent may sit beside its parent page in the same city, but its note must not echo the parent note.
  const parentNote = cityServices[key]?.[sub.parent];
  if (parentNote && similarity(note, parentNote) > MAX_SIBLING_SIMILARITY) return "note too similar to the parent service note in this city";
  if (wordCount(note) < MIN_CITY_SERVICE_WORDS) return `note ${wordCount(note)} < ${MIN_CITY_SERVICE_WORDS} words`;
  for (const [k, m] of Object.entries(subCityNotes)) if (k !== key && m[sub.slug] && similarity(note, m[sub.slug]) > MAX_SIBLING_SIMILARITY) return `note too similar to ${k}`;
  return "";
}

function buildSubCity() {
  return cityPages().flatMap((p) =>
    subservices.flatMap((sub) => {
      if (subCityGate(p, sub)) return [];
      const note = subCityNotes[`${p.state.code}/${p.city.slug}`][sub.slug];
      return [{ ...p, sub, note, facts: localFacts(p, sub) }];
    }),
  );
}

let _subState: ReturnType<typeof buildSubState> | undefined;
export const subStatePages = () => (_subState ??= buildSubState());
function buildSubState() {
  return coveredStates.flatMap((state) =>
    subservices.flatMap((sub) => {
      const cities = subCityPages().filter((p) => p.state.code === state.code && p.sub.slug === sub.slug);
      return cities.length >= MIN_STATE_CITIES ? [{ state, sub, cities }] : [];
    }),
  );
}

export const subCityFor = (stateCode: string, citySlug: string) => subCityPages().filter((p) => p.state.code === stateCode && p.city.slug === citySlug);
export const subCitiesOf = (sub: string) => subCityPages().filter((p) => p.sub.slug === sub);
export const stateServicesFor = (stateCode: string) => stateServicePages().filter((p) => p.state.code === stateCode);
export const subStatesFor = (stateCode: string) => subStatePages().filter((p) => p.state.code === stateCode);
export const statePagesOfService = (service: string) => stateServicePages().filter((p) => p.service.slug === service);
export const statePagesOfSub = (sub: string) => subStatePages().filter((p) => p.sub.slug === sub);

/** Full matrix with a status and reason for every combination (used by the coverage report). */
export function coverageMatrix() {
  const rows: { type: string; service: string; parent: string; state: string; city: string; status: "published" | "not eligible" | "needs content"; reason: string }[] = [];
  const cs = new Set(cityServicePages().map((p) => `${p.state.code}/${p.city.slug}/${p.service.slug}`));
  for (const p of cityPages()) for (const s of publishedServices) {
    const ok = cs.has(`${p.state.code}/${p.city.slug}/${s.slug}`);
    rows.push({ type: "service+city", service: s.slug, parent: "", state: p.state.code, city: p.city.slug, status: ok ? "published" : "not eligible", reason: ok ? "hand-written local service note passes the quality gate" : "no hand-written local note for this service in this city" });
  }
  const ss = new Set(stateServicePages().map((p) => `${p.state.code}/${p.service.slug}`));
  for (const st of coveredStates) for (const s of publishedServices) {
    const ok = ss.has(`${st.code}/${s.slug}`);
    const n = cityServicePages().filter((p) => p.state.code === st.code && p.service.slug === s.slug).length;
    rows.push({ type: "service+state", service: s.slug, parent: "", state: st.code, city: "", status: ok ? "published" : "not eligible", reason: ok ? `${n} cities with local notes` : `${n} cities with local notes (needs ${MIN_STATE_CITIES})` });
  }
  const sc = new Set(subCityPages().map((p) => `${p.state.code}/${p.city.slug}/${p.sub.slug}`));
  for (const p of cityPages()) for (const sub of subservices) {
    const ok = sc.has(`${p.state.code}/${p.city.slug}/${sub.slug}`);
    const w = wordCount(localFacts(p, sub).join(" "));
    const why = subCityGate(p, sub);
    const status = ok ? "published" : why === "no hand-written local note yet" && w >= MIN_SUB_LOCAL_WORDS ? "needs content" : "not eligible";
    rows.push({ type: "subservice+city", service: sub.slug, parent: sub.parent, state: p.state.code, city: p.city.slug, status, reason: ok ? "hand-written local note passes the gate" : `${why} (${w} words of local facts on this topic)` });
  }
  const sst = new Set(subStatePages().map((p) => `${p.state.code}/${p.sub.slug}`));
  for (const st of coveredStates) for (const sub of subservices) {
    const ok = sst.has(`${st.code}/${sub.slug}`);
    const n = subCityPages().filter((p) => p.state.code === st.code && p.sub.slug === sub.slug).length;
    rows.push({ type: "subservice+state", service: sub.slug, parent: sub.parent, state: st.code, city: "", status: ok ? "published" : "not eligible", reason: ok ? `${n} city pages for this subservice` : `${n} city pages for this subservice (needs ${MIN_STATE_CITIES})` });
  }
  return rows;
}

export { getService };
