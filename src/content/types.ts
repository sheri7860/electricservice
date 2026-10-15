export type Status = "DRAFT" | "REVIEW" | "PUBLISHED" | "NOINDEX" | "ARCHIVED";
export type Faq = { q: string; a: string };

export type ServiceCategory = { slug: string; name: string; blurb: string; icon: IconName };

export type Service = {
  slug: string;
  name: string;
  category: string;
  status: Status;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  answer: string;
  intro: string[];
  signs: string[];
  process: { title: string; text: string }[];
  costFactors: string[];
  diy: { safe: string[]; stop: string[] };
  faqs: Faq[];
  related: string[];
  isEmergencyCapable: boolean;
  icon: IconName;
};

export type Region = { slug: string; name: string; climate: string; housing: string; issues: string[] };

export type StateInfo = {
  code: string;
  slug: string;
  name: string;
  region: string;
  /** Short, factual note about the state's electrical context (permits, weather, housing). */
  note: string;
};

export type CoverageCity = { name: string; slug: string; county: string | null; zips: string[]; population: number };

export type CityLocal = {
  intro: string;
  housing: string;
  issues: string[];
  permits: string;
  areas: string[];
};

export type Article = {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  answer: string;
  sections: { heading: string; body: string; list?: string[] }[];
  faqs: Faq[];
  services: string[];
  related: string[];
  published: string;
  updated: string;
};

export type LandingPage = {
  slug: string;
  service: string;
  h1: string;
  kw: Record<string, string>;
  bullets: string[];
};

export type IconName =
  | "bolt" | "panel" | "outlet" | "light" | "fan" | "ev" | "generator" | "surge" | "search" | "wire"
  | "alert" | "home" | "shield" | "phone" | "check" | "pin" | "clock" | "smoke" | "plug" | "sun";
