import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { coveredStates } from "@/content/locations";
import { routes } from "./routes";
import type { Faq } from "@/content/types";

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;
const serviceId = (slug: string) => `${site.url}${routes.service(slug)}#service`;

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        url: site.url,
        description: "A free referral service that connects US homeowners with independent, licensed electricians.",
        ...(site.phoneIsPlaceholder ? {} : { telephone: site.phoneE164 }),
        ...(site.email ? { email: site.email } : {}),
        areaServed: coveredStates.map((s) => ({ "@type": "State", name: s.name })),
        knowsAbout: ["electrical repair", "panel upgrades", "EV charger installation", "home rewiring", "generator installation", "surge protection"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Electrical services",
          itemListElement: publishedServices.map((s) => ({ "@type": "Offer", itemOffered: { "@id": serviceId(s.slug) } })),
        },
      },
      { "@type": "WebSite", "@id": WEBSITE_ID, name: site.name, url: site.url, publisher: { "@id": ORG_ID } },
      ...publishedServices.map((s) => ({ "@type": "Service", "@id": serviceId(s.slug), name: s.name, url: site.url + routes.service(s.slug), serviceType: s.name, broker: { "@id": ORG_ID } })),
    ],
  };
}

type Crumb = { name: string; path: string };
export function pageGraph(o: { path: string; name: string; description: string; type?: string; crumbs: Crumb[]; faqs?: Faq[]; extra?: object[] }) {
  const url = site.url + o.path;
  const nodes: object[] = [
    {
      "@type": o.type ?? "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: o.name,
      description: o.description,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: o.crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: site.url + c.path })),
    },
  ];
  if (o.faqs?.length)
    nodes.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: o.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  return { "@context": "https://schema.org", "@graph": [...nodes, ...(o.extra ?? [])] };
}
