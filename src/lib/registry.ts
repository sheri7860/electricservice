import { publishedServices } from "@/content/services";
import { coveredStates } from "@/content/locations";
import { cityPages, cityServicePages } from "./sitemap";
import { routes } from "./routes";

/** Every flat page rendered by app/(site)/[slug]/page.tsx, keyed by its slug. */
export type FlatEntry =
  | { kind: "service"; slug: string; params: { slug: string } }
  | { kind: "state"; slug: string; params: { state: string } }
  | { kind: "city"; slug: string; params: { state: string; city: string } }
  | { kind: "cityService"; slug: string; params: { state: string; city: string; service: string } };

/** Top-level routes that exist as their own folders; a flat slug must never shadow them. */
const RESERVED = new Set(["electrical-services", "emergency-electrician", "locations", "resources", "about", "contact", "faq", "request-service", "privacy", "terms", "accessibility", "thank-you", "lp", "api"]);

const slugOf = (path: string) => path.replace(/^\/|\/$/g, "");

let _registry: Map<string, FlatEntry> | undefined;
export function flatRegistry() {
  if (_registry) return _registry;
  const map = new Map<string, FlatEntry>();
  const add = (e: FlatEntry) => {
    if (e.slug.includes("/")) throw new Error(`Flat slug contains a slash: ${e.slug}`);
    if (RESERVED.has(e.slug)) throw new Error(`Flat slug collides with a reserved route: ${e.slug}`);
    const prev = map.get(e.slug);
    if (prev) throw new Error(`Flat slug collision: "${e.slug}" is both ${prev.kind} and ${e.kind}`);
    map.set(e.slug, e);
  };
  for (const s of publishedServices) if (s.slug !== "emergency-electrician") add({ kind: "service", slug: slugOf(routes.service(s.slug)), params: { slug: s.slug } });
  for (const s of coveredStates) add({ kind: "state", slug: slugOf(routes.state(s.slug)), params: { state: s.slug } });
  for (const p of cityPages()) add({ kind: "city", slug: slugOf(routes.city(p.state.slug, p.city.slug)), params: { state: p.state.slug, city: p.city.slug } });
  for (const p of cityServicePages()) add({ kind: "cityService", slug: slugOf(routes.cityService(p.state.slug, p.city.slug, p.service.slug)), params: { state: p.state.slug, city: p.city.slug, service: p.service.slug } });
  return (_registry = map);
}
