export const SERVICES = "electrical-services";

export const routes = {
  home: "/",
  services: `/${SERVICES}/`,
  service: (slug: string) => (slug === "emergency-electrician" ? "/emergency-electrician/" : `/${SERVICES}/${slug}/`),
  emergency: "/emergency-electrician/",
  locations: "/locations/",
  state: (state: string) => `/locations/${state}/`,
  city: (state: string, city: string) => `/locations/${state}/${city}/`,
  cityService: (state: string, city: string, service: string) => `/locations/${state}/${city}/${service}/`,
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
