import { photos } from "@/content/photos";
import { STATE_COUNT } from "@/content/locations";
import { Hero, CtaBand } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { DISCLOSURE } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = `How Brightlane Electric works: a free referral service that connects homeowners with independent, licensed electricians in ${STATE_COUNT} states and DC.`;
export const metadata = pageMeta({ title: "How Brightlane Electric Works", description: desc, path: routes.about });
const crumbs = [{ name: "Home", path: "/" }, { name: "How it works", path: routes.about }];

export default function Page() {
  return (
    <>
      <Hero photo={photos.portrait} crumbs={crumbs} eyebrow="About" title="How Brightlane Electric works" lead={<p>Finding an electrician who actually serves your address, answers the phone and does the kind of job you need takes time. We do that routing for you.</p>} />
      <div className="container-x max-w-3xl py-14">
        <div className="prose-bl text-lg">
          <h2 className="mb-3 text-2xl font-bold">What we are</h2>
          <p>Brightlane Electric is a call and request service for homeowners. When you call or fill in the form, we connect you with an independent electrician or electrical company that serves your ZIP code.</p>
          <h2 className="mb-3 mt-8 text-2xl font-bold">What we are not</h2>
          <p>We are not an electrical contractor. We do not employ electricians, set prices, pull permits or perform any work. The electrician you speak with is an independent business responsible for their own license, insurance, pricing and workmanship.</p>
          <h2 className="mb-3 mt-8 text-2xl font-bold">How to choose well</h2>
          <ul>
            <li>Ask for the electrician&apos;s license number and verify it with your state or local board.</li>
            <li>Ask whether the job needs a permit and who will pull it.</li>
            <li>Get the scope and price in writing before work starts.</li>
            <li>For larger jobs, compare more than one quote using the cost factors on our service pages.</li>
          </ul>
          <h2 className="mb-3 mt-8 text-2xl font-bold">Disclosure</h2>
          <p>{DISCLOSURE}</p>
        </div>
      </div>
      <CtaBand />
      <JsonLd data={pageGraph({ path: routes.about, name: "How Brightlane Electric works", description: desc, type: "AboutPage", crumbs })} />
    </>
  );
}
