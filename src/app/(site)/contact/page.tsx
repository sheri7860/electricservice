import { photos } from "@/content/photos";
import { STATE_COUNT } from "@/content/locations";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { availability, site, telHref } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = `Call ${site.phone} to reach a licensed electrician who serves your ZIP code, for repairs, panel upgrades, EV chargers and urgent electrical problems.`;
export const metadata = pageMeta({ title: `Contact Us: Call ${site.phone}`, description: desc, path: routes.contact });
const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: routes.contact }];

export default function Page() {
  return (
    <>
      <Hero photo={photos.van} crumbs={crumbs} eyebrow="Contact" title="Talk to us about your electrical problem" lead={<p>Call us and we connect you with a licensed electrician who serves your area.</p>} />
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <div className="card-top p-6"><p className="text-sm text-muted">Phone</p><a href={telHref()} data-event="call_click" className="font-display text-3xl font-bold">{site.phone}</a><p className="mt-1 text-sm text-muted">{availability}</p></div>
          {site.email && <div className="card p-6"><p className="text-sm text-muted">Email</p><a href={`mailto:${site.email}`} className="link">{site.email}</a></div>}
          <div className="card p-6"><p className="text-sm text-muted">Service area</p><p className="font-semibold">{STATE_COUNT} states and Washington, DC. We are a service-area business with no walk-in office.</p></div>
          <div className="card p-6 space-y-3 text-sm leading-relaxed"><p className="font-semibold">What happens when you call</p><p>Tell us your ZIP code and what is going on: a dead outlet, a breaker that keeps tripping, a panel you want upgraded, an EV charger you plan to install or a burning smell you cannot trace. We connect you with a licensed electrician who works in your area so you can describe the problem directly and ask about timing and price.</p><p>If you smell burning, see sparks or have a hot panel, switch off the affected breaker if it is safe to do so and say it is urgent when you call. If there is smoke or fire, leave the building and call 911 first.</p><p>Calls are free and there is no obligation to book. Electricians in the network are independent licensed contractors who give their own quotes before any work starts.</p></div>
        </div>
        <LeadFormBlock />
      </div>
      <JsonLd data={pageGraph({ path: routes.contact, name: "Contact", description: desc, type: "ContactPage", crumbs })} />
    </>
  );
}
