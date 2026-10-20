import { DISCLOSURE, site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { coveredStates, STATE_COUNT } from "@/content/locations";
import { articles } from "@/content/articles";
import { cityPages, cityServicePages } from "@/lib/sitemap";
import { routes } from "@/lib/routes";
import { sentences } from "@/lib/text";
import { subservices } from "@/content/subservices";
import { stateServicePages, subCityPages, subStatePages } from "@/lib/coverage";

export const dynamic = "force-static";

/** llms.txt in the llmstxt.org format: H1, summary blockquote, then sections of Markdown links with short notes. */
export function GET() {
  const link = (title: string, path: string, note?: string) => `- [${title}](${site.url}${path})${note ? `: ${note}` : ""}`;
  const first = (t: string) => sentences(t)[0];

  const pages = [
    link("Home", routes.home, "What Brightlane Electric does and how to reach an electrician"),
    link("Electrical services", routes.services, "All residential electrical services, grouped by category"),
    link("Service areas", routes.locations, "States and cities with electrician coverage, with a ZIP code checker"),
    link("Electrical guides", routes.resources, "Plain-English guides to common home electrical problems"),
    link("How it works", routes.about, "How the referral service works and who does the work"),
    link("FAQ", routes.faq, "Common questions before calling an electrician"),
    link("Contact", routes.contact, "Phone and contact details"),
  ];
  const services = publishedServices.map((s) => link(s.name, routes.service(s.slug), first(s.answer)));
  const subs = subservices.map((s) => link(s.name, routes.subservice(s.slug), first(s.answer)));
  const statewide = [...stateServicePages().map((p) => link(`${p.service.name} in ${p.state.name}`, routes.stateService(p.state.slug, p.service.slug))), ...subStatePages().map((p) => link(`${p.sub.name} in ${p.state.name}`, routes.stateService(p.state.slug, p.sub.slug)))];
  const subLocal = subCityPages().map((p) => link(`${p.sub.name} in ${p.city.name}, ${p.state.code}`, routes.cityService(p.state.slug, p.city.slug, p.sub.slug), first(p.note)));
  const guides = articles.map((a) => link(a.title, routes.guide(a.slug), first(a.answer)));
  const states = coveredStates.map((s) => link(`Electricians in ${s.name}`, routes.state(s.slug)));
  const cities = cityPages().map((p) => link(`Electricians in ${p.city.name}, ${p.state.code}`, routes.city(p.state.slug, p.city.slug), first(p.local.intro)));
  const cityServices = cityServicePages().map((p) => link(`${p.service.name} in ${p.city.name}, ${p.state.code}`, routes.cityService(p.state.slug, p.city.slug, p.service.slug)));

  const body = [
    `# ${site.name}`,
    "",
    `> Free referral service connecting US homeowners with independent, licensed electricians in ${STATE_COUNT} states and Washington, DC.`,
    "",
    DISCLOSURE,
    "",
    "## Main pages", ...pages, "",
    "## Electrical services", ...services, "",
    "## Specialized services", ...subs, "",
    "## Guides", ...guides, "",
    "## States", ...states, "",
    "## Cities", ...cities, "",
    "## Statewide service guides", ...statewide, "",
    "## Optional", "Local service guides for specific cities:", ...cityServices, ...subLocal, "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
