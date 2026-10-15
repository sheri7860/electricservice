import Image from "next/image";
import { photos, categoryPhoto, servicePhoto } from "@/content/photos";
import { Hero, CtaBand } from "@/components/Hero";
import { ServiceCard, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { categories, servicesIn } from "@/content/services";
import { availability } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = "Electrical repair, panel upgrades, rewiring, EV chargers, lighting, generators and safety upgrades. Connect with a licensed electrician near you.";
export const metadata = pageMeta({ title: "Electrical Services for Homes", description: desc, path: routes.services });
const crumbs = [{ name: "Home", path: "/" }, { name: "Electrical services", path: routes.services }];

export default function Page() {
  return (
    <>
      <Hero photo={photos.panels} crumbs={crumbs} eyebrow="All services" title="Residential electrical services" lead={<p>Licensed electricians in our network handle repairs, upgrades, installations and safety work for homes. Pick a service to see the warning signs, what the work involves and what affects the price.</p>} facts={[availability, "47 states + DC"]} />
      <div className="container-x py-14">
        {categories.map((c) => (
          <section key={c.slug} id={c.slug} className="mb-14 scroll-mt-28 last:mb-0">
            <div className="mb-6 grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <SectionHeading title={c.name} lead={c.blurb} />
              {categoryPhoto[c.slug] && (
                <Image src={categoryPhoto[c.slug].src} alt={categoryPhoto[c.slug].alt} width={categoryPhoto[c.slug].width} height={categoryPhoto[c.slug].height}
                  sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[5/2] w-full rounded-xl object-cover" />
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {servicesIn(c.slug).map((s) => <ServiceCard key={s.slug} image={servicePhoto(s.slug, s.category)} href={routes.service(s.slug)} icon={s.icon} title={s.name} text={s.answer.split(". ")[0] + "."} />)}
            </div>
          </section>
        ))}
      </div>
      <CtaBand />
      <JsonLd data={pageGraph({ path: routes.services, name: "Residential electrical services", description: desc, type: "CollectionPage", crumbs })} />
    </>
  );
}
