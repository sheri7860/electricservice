import { stateInfo } from "@/content/locations";

export const SERVICES = "electrical-services";

/** State code (lowercase) for a state slug, e.g. "texas" -> "tx". */
const codeBySlug = new Map(stateInfo.map((s) => [s.slug, s.code.toLowerCase()]));
const code = (stateSlug: string) => {
  const c = codeBySlug.get(stateSlug);
  if (!c) throw new Error(`Unknown state slug: ${stateSlug}`);
  return c;
};

/**
 * Every public page uses a flat URL:
 *   /{service}/  /{subservice}/  /electricians-in-{state}/  /electricians-in-{city}-{st}/
 *   /{service}-in-{city}-{st}/  /{service}-in-{state}/  /{subservice}-in-{city}-{st}/  /{subservice}-in-{state}/
 * Hubs (/electrical-services/, /locations/, /resources/) stay as browse pages.
 * Old nested URLs (/electrical-services/x/, /locations/...) 301 to these.
 */
export const routes = {
  home: "/",
  services: `/${SERVICES}/`,
  service: (slug: string) => `/${slug}/`,
  subservice: (slug: string) => `/${slug}/`,
  emergency: "/emergency-electrician/",
  locations: "/locations/",
  state: (state: string) => `/electricians-in-${state}/`,
  city: (state: string, city: string) => `/electricians-in-${city}-${code(state)}/`,
  cityService: (state: string, city: string, service: string) => `/${service}-in-${city}-${code(state)}/`,
  stateService: (state: string, service: string) => `/${service}-in-${state}/`,
  resources: "/resources/",
  guide: (slug: string) => `/resources/${slug}/`,
  about: "/about/",
  contact: "/contact/",
  faq: "/faq/",
  request: "/request-service/",
  privacy: "/privacy/",
  terms: "/terms/",
  accessibility: "/accessibility/",
  thankYou: "/thank-you/",
  lp: (slug: string) => `/lp/${slug}/`,
};

/** The pre-flat nested URLs, kept only to 301 old links to the flat pages. */
export const legacyRoutes = {
  service: (slug: string) => `/${SERVICES}/${slug}/`,
  state: (state: string) => `/locations/${state}/`,
  city: (state: string, city: string) => `/locations/${state}/${city}/`,
  cityService: (state: string, city: string, service: string) => `/locations/${state}/${city}/${service}/`,
};
