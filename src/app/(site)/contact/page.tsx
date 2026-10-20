import { photos } from "@/content/photos";
import { STATE_COUNT } from "@/content/locations";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { availability, site, telHref } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = "Call or send a request to connect with a licensed electrician who serves your ZIP code.";
export const metadata = pageMeta({ title: "Contact", description: desc, path: routes.contact });
const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: routes.contact }];

export default function Page() {
  return (
    <>
      <Hero photo={photos.van} crumbs={crumbs} eyebrow="Contact" title="Talk to us about your electrical problem" lead={<p>The fastest way to reach an electrician is by phone. You can also send the form and an electrician serving your area will contact you.</p>} />
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <div className="card-top p-6"><p className="text-sm text-muted">Phone</p><a href={telHref()} data-event="call_click" className="font-display text-3xl font-bold">{site.phone}</a><p className="mt-1 text-sm text-muted">{availability}</p></div>
          {site.email && <div className="card p-6"><p className="text-sm text-muted">Email</p><a href={`mailto:${site.email}`} className="link">{site.email}</a></div>}
          <div className="card p-6"><p className="text-sm text-muted">Service area</p><p className="font-semibold">{STATE_COUNT} states and Washington, DC. We are a service-area business with no walk-in office.</p></div>
        </div>
        <LeadFormBlock />
      </div>
      <JsonLd data={pageGraph({ path: routes.contact, name: "Contact", description: desc, type: "ContactPage", crumbs })} />
    </>
  );
}
