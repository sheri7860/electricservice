import type { Metadata } from "next";
import { site } from "@/content/site";

const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "Brightlane Electric: licensed electricians, one call away" };

type Opts = { title: string; description: string; path: string; noindex?: boolean; canonical?: string };

/** Keep descriptions within ~155 characters: drop trailing sentences first, then cut at a word. */
function clampDescription(d: string, max = 155) {
  if (d.length <= max) return d;
  const sentences = d.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = "";
  for (const s of sentences) { if ((out + s).trim().length > max) break; out += s; }
  if (out.trim().length >= 90) return out.trim();
  return d.slice(0, max - 1).replace(/[\s,;:]+\S*$/, "") + "…";
}

export function pageMeta({ title, description: raw, path, noindex, canonical }: Opts): Metadata {
  const description = clampDescription(raw);
  const full = title.length + site.name.length + 3 <= 60 ? `${title} | ${site.name}` : title;
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
 * the title within ~56 characters (about 560px) so Google shows it whole.
 */
export function ctaTitle(base: string) {
  for (const suffix of [" | Licensed Electricians, Call Now", " | Licensed Local Electricians", " | Licensed Electricians", " | Call Now"]) {
    if (base.length + suffix.length <= 56) return base + suffix;
  }
  return base;
}

/**
 * Click-focused description (≤155 chars): a question matching the search, the phone number,
 * then a page-specific local detail so every description stays unique.
 */
export function ctaDescription(need: string, place: string, detail = "") {
  const what = need.split(" ").map((w) => (/^[A-Z0-9]{2,}/.test(w) ? w : w.toLowerCase())).join(" ");
  const lead = `Need ${what} in ${place}? Call ${site.phone} to reach a licensed local electrician.`;
  const room = 155 - lead.length - 1;
  if (!detail || room < 25) return lead;
  let d = detail.trim();
  if (d.length > room) d = d.slice(0, room - 1).replace(/[\s,;:]+\S*$/, "") + "…";
  return `${lead} ${d}`;
}
