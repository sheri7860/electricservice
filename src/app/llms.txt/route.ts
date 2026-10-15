import { DISCLOSURE, site } from "@/content/site";
import { indexableUrls } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  const u = indexableUrls();
  const list = (urls: string[]) => urls.map((x) => `- ${site.url}${x}`).join("\n");
  const body = `# ${site.name}\n\n> Free referral service connecting US homeowners with independent, licensed electricians in 47 states and Washington, DC.\n\n${DISCLOSURE}\n\n## Pages\n${list(u.pages)}\n\n## Services\n${list(u.services)}\n\n## Locations\n${list(u.locations)}\n\n## Services by city\n${list(u["city-services"])}\n\n## Guides\n${list(u.guides)}\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
