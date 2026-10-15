import { site } from "@/content/site";
import { CONTENT_DATE } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  const maps = ["pages", "services", "locations", "city-services", "guides"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${maps.map((m) => `  <sitemap><loc>${site.url}/sitemap-${m}.xml</loc><lastmod>${CONTENT_DATE}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
