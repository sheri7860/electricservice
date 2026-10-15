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
