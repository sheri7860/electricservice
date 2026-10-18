import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero, CtaBand } from "@/components/Hero";
import { FaqList } from "@/components/FaqList";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/icons";
import { servicePhoto } from "@/content/photos";
import { getRegion } from "@/content/locations";
import { availability, site } from "@/content/site";
import { cityUtility } from "@/content/cityUtility";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { sentences } from "@/lib/text";
import { pageGraph, ORG_ID } from "@/lib/schema";
import { stateServicePages, stateServicesFor, statePagesOfService, subStatesFor } from "@/lib/coverage";

type P = { params: Promise<{ state: string; service: string }> };
const find = (st: string, sv: string) => stateServicePages().find((p) => p.state.slug === st && p.service.slug === sv);

export async function generateMetadata({ params }: P) {
  const { state, service } = await params;
  const p = find(state, service)!;
  const names = p.cities.map((c) => c.city.name);
  const list = names.length > 2 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names.join(" and ");
  return pageMeta({
    title: `${p.service.name} in ${p.state.name}`,
    description: `${p.service.name} across ${p.state.name}: local permit offices, utilities and housing notes for ${list}. Connect with a licensed electrician.`.slice(0, 160),
    path: routes.stateService(p.state.slug, p.service.slug),
  });
}

export default async function Page({ params }: P) {
  const { state, service } = await params;
  const p = find(state, service);
  if (!p) notFound();
  const { state: s, service: svc, cities } = p;
  const r = getRegion(s.region);
  const path = routes.stateService(s.slug, svc.slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: routes.locations }, { name: s.name, path: routes.state(s.slug) }, { name: svc.name, path }];
  const otherServices = stateServicesFor(s.code).filter((x) => x.service.slug !== svc.slug);
  const otherStates = statePagesOfService(svc.slug).filter((x) => x.state.code !== s.code);
  const subsHere = subStatesFor(s.code).filter((x) => x.sub.parent === svc.slug);
  const faqs = [
    { q: `Who issues permits for ${svc.name.toLowerCase()} in ${s.name}?`, a: `Permits come from the city or county where the home is. For example: ${cities.map((c) => `${c.city.name}: ${sentences(c.local.permits)[0]}`).join(" ")}` },
    { q: `Which utilities are involved in ${s.name}?`, a: cities.map((c) => `${c.city.name}: ${cityUtility[`${s.code}/${c.city.slug}`] ?? "the local utility"}.`).join(" ") },
    ...svc.faqs.slice(0, 3),
  ];
  return (
    <>
      <Hero photo={servicePhoto(svc.slug, svc.category)} crumbs={crumbs} eyebrow={`${svc.name} · ${s.name}`} title={`${svc.name} in ${s.name}`} requestHref={`${routes.request}?service=${svc.slug}`}
        lead={<p>{svc.answer}</p>}
        facts={[availability, "Independent, licensed electricians", `Local guides for ${cities.length} ${s.name} cities`]} />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-3xl font-bold">{svc.name} in {s.name}: what changes city to city</h2>
            <div className="prose-bl text-lg">
              <p>{s.note}</p>
              <p>Across the {r.name}, homes deal with {r.climate}. Permit offices, utilities and housing stock differ by city, which affects how {svc.name.toLowerCase()} is planned and scheduled. These local guides cover the {s.name} cities where we have written specific notes.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Local guides in {s.name}</h2>
            <div className="space-y-4">
              {cities.map((c) => (
                <article key={c.city.slug} className="card-top p-5">
                  <h3 className="text-xl font-bold"><Link href={routes.cityService(s.slug, c.city.slug, svc.slug)} className="hover:underline">{svc.name} in {c.city.name}, {s.code}</Link></h3>
                  <p className="mt-2 text-ink/80">{sentences(c.note).slice(0, 2).join(" ")}</p>
                  <p className="mt-2 text-sm text-muted">Utility: {cityUtility[`${s.code}/${c.city.slug}`] ?? "local utility"}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Signs it&apos;s time to call</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {svc.signs.map((x) => <li key={x} className="flex gap-3 rounded-lg bg-white p-4 ring-1 ring-line"><Icon name="bolt" className="h-5 w-5 shrink-0 text-volt-dark" />{x}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">How the job usually goes</h2>
            <ol className="space-y-3">{svc.process.map((x, i) => <li key={x.title} className="rounded-lg bg-white p-4 ring-1 ring-line"><p className="font-display font-bold">{i + 1}. {x.title}</p><p className="mt-1 text-sm text-ink/80">{x.text}</p></li>)}</ol>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold">What moves the price</h2>
            <p className="mb-4 text-muted">Electricians set their own prices; local permit fees and utility requirements add to these factors.</p>
            <ul className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">{svc.costFactors.map((x) => <li key={x} className="flex gap-3 p-4"><Icon name="check" className="h-5 w-5 shrink-0 text-current" />{x}</li>)}</ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{svc.name} in {s.name}: questions</h2>
            <FaqList faqs={faqs} />
          </section>

          {(subsHere.length > 0 || otherServices.length > 0) && (
            <section>
              <h2 className="mb-3 text-xl font-bold">More electrical help in {s.name}</h2>
              <div className="flex flex-wrap gap-2">
                {subsHere.map((x) => <Link key={x.sub.slug} href={routes.stateService(s.slug, x.sub.slug)} className="chip">{x.sub.name} in {s.name}</Link>)}
                {otherServices.map((x) => <Link key={x.service.slug} href={routes.stateService(s.slug, x.service.slug)} className="chip">{x.service.name} in {s.name}</Link>)}
                <Link href={routes.state(s.slug)} className="chip font-semibold">Electricians in {s.name} →</Link>
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-xl font-bold">{svc.name} in other states</h2>
            <div className="flex flex-wrap gap-2">
              {otherStates.map((x) => <Link key={x.state.code} href={routes.stateService(x.state.slug, svc.slug)} className="chip">{x.state.name}</Link>)}
              <Link href={routes.service(svc.slug)} className="chip font-semibold">About {svc.name.toLowerCase()} →</Link>
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><LeadFormBlock defaultService={svc.slug} /></aside>
      </div>
      <CtaBand title={`Need ${svc.name.toLowerCase()} in ${s.name}?`} />
      <JsonLd data={pageGraph({
        path, name: `${svc.name} in ${s.name}`, description: svc.answer, crumbs, faqs,
        extra: [{ "@type": "Service", "@id": `${site.url}${path}#service`, name: `${svc.name} in ${s.name}`, serviceType: svc.name, areaServed: { "@type": "State", name: s.name }, broker: { "@id": ORG_ID } }],
      })} />
    </>
  );
}
