import type { Metadata } from "next";
import { site } from "@/content/site";

const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "Brightlane Electric: licensed electricians, one call away" };

type Opts = { title: string; description: string; path: string; noindex?: boolean; canonical?: string };

export function pageMeta({ title, description, path, noindex, canonical }: Opts): Metadata {
  const full = title.length + site.name.length + 3 <= 62 ? `${title} | ${site.name}` : title;
  const url = site.url + (canonical ?? path);
  return {
    title: { absolute: full },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: { type: "website", siteName: site.name, title: full, description, url, locale: "en_US", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}

/**
 * Click-focused title: the search phrase first, then the longest selling suffix that keeps
 * the title within ~60 characters so Google shows it whole.
 */
export function ctaTitle(base: string) {
  for (const suffix of [" | Licensed Electricians, Call Now", " | Licensed Local Electricians", " | Licensed Electricians", " | Call Now"]) {
    if (base.length + suffix.length <= 60) return base + suffix;
  }
  return base;
}

/**
 * Click-focused description (≤158 chars): a question matching the search, the phone number,
 * then a page-specific local detail so every description stays unique.
 */
export function ctaDescription(need: string, place: string, detail = "") {
  const what = need.split(" ").map((w) => (/^[A-Z0-9]{2,}/.test(w) ? w : w.toLowerCase())).join(" ");
  const lead = `Need ${what} in ${place}? Call ${site.phone} to reach a licensed local electrician.`;
  const room = 158 - lead.length - 1;
  if (!detail || room < 25) return lead;
  let d = detail.trim();
  if (d.length > room) d = d.slice(0, room - 1).replace(/[\s,;:]+\S*$/, "") + "…";
  return `${lead} ${d}`;
}
