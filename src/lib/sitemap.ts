import { publishedServices, getService } from "@/content/services";
import { coveredStates, citiesIn } from "@/content/locations";
import { cityLocal } from "@/content/cityLocal";
import { cityServices } from "@/content/cityServices";
import { articles } from "@/content/articles";
import { cityGate, cityServiceGate } from "./quality";
import { routes } from "./routes";

export const CONTENT_DATE = "2026-10-15";

/** Indexed city pages: hand-written local content that passes the quality gate AND live coverage. */
let _cityPages: ReturnType<typeof buildCityPages> | undefined;
export const cityPages = () => (_cityPages ??= buildCityPages());
function buildCityPages() {
  return coveredStates.flatMap((s) =>
    citiesIn(s.code)
      .filter((c) => cityGate(`${s.code}/${c.slug}`).ok)
      .map((c) => ({ state: s, city: c, local: cityLocal[`${s.code}/${c.slug}`] })),
  );
}

/** City+service pages: a hand-written local service note that passes the quality gate. */
let _csPages: ReturnType<typeof buildCityServicePages> | undefined;
export const cityServicePages = () => (_csPages ??= buildCityServicePages());
function buildCityServicePages() {
  return cityPages().flatMap((p) => {
    const key = `${p.state.code}/${p.city.slug}`;
    return Object.keys(cityServices[key] ?? {})
      .filter((slug) => cityServiceGate(key, slug).ok)
      .map((slug) => ({ ...p, service: getService(slug)!, note: cityServices[key][slug] }));
  });
}
export const cityServicesFor = (stateCode: string, citySlug: string) => cityServicePages().filter((p) => p.state.code === stateCode && p.city.slug === citySlug);
export const citiesForService = (slug: string) => cityServicePages().filter((p) => p.service.slug === slug);

export function indexableUrls() {
  return {
    pages: [routes.home, routes.services, routes.emergency, routes.locations, routes.resources, routes.about, routes.contact, routes.faq, routes.privacy, routes.terms, routes.accessibility],
    services: publishedServices.filter((s) => s.slug !== "emergency-electrician").map((s) => routes.service(s.slug)),
    locations: [...coveredStates.map((s) => routes.state(s.slug)), ...cityPages().map((p) => routes.city(p.state.slug, p.city.slug))],
    "city-services": cityServicePages().map((p) => routes.cityService(p.state.slug, p.city.slug, p.service.slug)),
    guides: articles.map((a) => routes.guide(a.slug)),
  };
}

export function sitemapResponse(kind: keyof ReturnType<typeof indexableUrls>) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://brightlaneelectric.com").replace(/\/$/, "");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableUrls()[kind].map((u) => `  <url><loc>${base}${u}</loc><lastmod>${CONTENT_DATE}</lastmod></url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
