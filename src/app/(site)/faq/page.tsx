import { Hero, CtaBand } from "@/components/Hero";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { generalFaqs } from "@/content/faqs";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = "Answers about how Brightlane Electric works, costs, coverage, licensing, permits and emergencies.";
export const metadata = pageMeta({ title: "Frequently Asked Questions", description: desc, path: routes.faq });
const crumbs = [{ name: "Home", path: "/" }, { name: "FAQ", path: routes.faq }];

export default function Page() {
  return (
    <>
      <Hero crumbs={crumbs} eyebrow="FAQ" title="Frequently asked questions" lead={<p>How the service works, what it costs, and what to expect from the electrician.</p>} />
      <div className="container-x max-w-3xl py-14"><FaqList faqs={generalFaqs} /></div>
      <CtaBand />
      <JsonLd data={pageGraph({ path: routes.faq, name: "Frequently asked questions", description: desc, crumbs, faqs: generalFaqs })} />
    </>
  );
}
