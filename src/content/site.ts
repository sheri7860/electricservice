const env = (k: string) => (process.env[k] ?? "").trim();

/** LeadSmart toll-free tracking number for the Electrician offer. Env vars override it. */
const DEFAULT_PHONE = "(877) 370-0920";
const DEFAULT_PHONE_E164 = "+18773700920";
const phone = env("NEXT_PUBLIC_BUSINESS_PHONE");

export const site = {
  name: "Brightlane Electric",
  shortName: "Brightlane",
  url: (env("NEXT_PUBLIC_SITE_URL") || "https://brightlaneelectric.com").replace(/\/$/, ""),
  market: "the United States",
  phone: phone || DEFAULT_PHONE,
  phoneE164: env("NEXT_PUBLIC_BUSINESS_PHONE_E164") || DEFAULT_PHONE_E164,
  /** Real number is set, so it can appear in structured data. */
  phoneIsPlaceholder: false,
  ppcPhone: env("NEXT_PUBLIC_PPC_TRACKING_PHONE"),
  email: env("NEXT_PUBLIC_BUSINESS_EMAIL"),
  hours: env("NEXT_PUBLIC_BUSINESS_HOURS"),
  is247: env("NEXT_PUBLIC_EMERGENCY_24_7") === "true",
  gtmId: env("NEXT_PUBLIC_GTM_ID"),
  googleVerification: env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
  bingVerification: env("NEXT_PUBLIC_BING_SITE_VERIFICATION"),
};

export const telHref = (e164 = site.phoneE164) => `tel:${e164}`;

/** Availability line: never claims 24/7 unless configured. */
export const availability = site.is247
  ? "Calls answered 24/7, including emergencies"
  : site.hours
    ? `Calls answered ${site.hours}`
    : "Call now to check electrician availability in your area";

export const BRAND_PROMISE = "One call connects you with an independent, licensed electrician who serves your ZIP code.";

export const DISCLOSURE =
  "Brightlane Electric is a free referral service. We are not an electrical contractor and do not perform work. Calls and requests are routed to independent, licensed electricians and electrical companies, who set their own prices and are responsible for their own work, licensing and insurance.";
