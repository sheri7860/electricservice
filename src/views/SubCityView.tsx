import { nearbyTowns } from "@/lib/nearby";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero, CtaBand } from "@/components/Hero";
import { FaqList } from "@/components/FaqList";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/icons";
import { servicePhoto } from "@/content/photos";
import { getService } from "@/content/services";
import { availability, site } from "@/content/site";
import { cityUtility } from "@/content/cityUtility";
import { routes } from "@/lib/routes";
import { pageMeta, ctaTitle, ctaDescription } from "@/lib/seo";
import { sentences } from "@/lib/text";
import { pageGraph, ORG_ID } from "@/lib/schema";
import { cityServicesFor } from "@/lib/sitemap";
import { subCityPages, subCityFor, subCitiesOf, subStatePages } from "@/lib/coverage";

type P = { params: Promise<{ state: string; city: string; sub: string }> };
const find = (st: string, c: string, sb: string) => subCityPages().find((p) => p.state.slug === st && p.city.slug === c && p.sub.slug === sb);

export async function generateMetadata({ params }: P) {
  const { state, city, sub } = await params;
  const p = find(state, city, sub)!;
  const first = sentences(p.note)[0];
  const d = first.length <= 150 ? first : first.slice(0, 147).replace(/\s+\S*$/, "") + "…";
  return pageMeta({ title: ctaTitle(`${p.sub.name} in ${p.city.name}, ${p.state.code}`), description: ctaDescription(p.sub.name, `${p.city.name}, ${p.state.code}`, d), path: routes.cityService(p.state.slug, p.city.slug, p.sub.slug) });
}

export default async function Page({ params }: P) {
  const { state, city, sub: subSlug } = await params;
  const p = find(state, city, subSlug);
  if (!p) notFound();
  const { state: s, city: c, local, sub, note } = p;
  const facts = p.facts.filter((f) => !note.includes(f));
  const parent = getService(sub.parent)!;
  const label = `${c.name}, ${s.code}`;
  const path = routes.cityService(s.slug, c.slug, sub.slug);
  const parentHere = cityServicesFor(s.code, c.slug).find((x) => x.service.slug === parent.slug);
  const crumbs = [
    { name: "Home", path: "/" }, { name: "Locations", path: routes.locations }, { name: s.name, path: routes.state(s.slug) },
    { name: c.name, path: routes.city(s.slug, c.slug) }, ...(parentHere ? [{ name: parent.name, path: routes.cityService(s.slug, c.slug, parent.slug) }] : []), { name: sub.name, path },
  ];
  const siblings = subCityFor(s.code, c.slug).filter((x) => x.sub.slug !== sub.slug);
  const otherCities = subCitiesOf(sub.slug).filter((x) => !(x.city.slug === c.slug && x.state.code === s.code)).slice(0, 10);
  const statePage = subStatePages().find((x) => x.state.code === s.code && x.sub.slug === sub.slug);
  const utility = cityUtility[`${s.code}/${c.slug}`];
  const faqs = [
    { q: `Do I need a permit for ${sub.name.toLowerCase()} in ${c.name}?`, a: `Usually, yes. ${local.permits} The electrician normally pulls the permit and schedules the inspection.` },
    ...(utility ? [{ q: `Is the utility involved in ${c.name}?`, a: `If the work affects the meter or service, the electrician coordinates with ${utility}, which owns the meter and service drop.` }] : []),
    ...sub.faqs.slice(0, 4),
  ];
  return (
    <>
      <Hero photo={servicePhoto(sub.slug, sub.category)} crumbs={crumbs} eyebrow={`${sub.name} · ${label}`} title={`${sub.name} in ${label}`} requestHref={`${routes.request}?service=${parent.slug}`}
        lead={<p>{sub.answer}</p>}
        facts={[availability, "Independent, licensed electricians", `Serving ${local.areas.slice(0, 3).join(", ")} and more`]} />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-3xl font-bold">Why {sub.name.toLowerCase()} comes up in {c.name}</h2>
            <div className="prose-bl text-lg">{sentences(note).length > 3 ? <><p>{sentences(note).slice(0, 3).join(" ")}</p><p>{sentences(note).slice(3).join(" ")}</p></> : <p>{note}</p>}</div>
            {facts.length > 0 && (
              <ul className="mt-5 space-y-3">
                {facts.map((f) => <li key={f} className="flex gap-3 rounded-lg bg-white p-4 ring-1 ring-line"><Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-current" /><span>{f}</span></li>)}
              </ul>
            )}
            <dl className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2">
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Permits in {c.name}</dt><dd className="mt-1 text-sm font-semibold">{local.permits}</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Electric utility</dt><dd className="mt-1 text-sm font-semibold">{utility ?? "Local utility"}</dd></div>
              {nearbyTowns(s.code, c.slug).length > 0 && <div className="bg-white p-4 sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Nearby towns also served</dt><dd className="mt-1 text-sm font-semibold">{sub.name} is also available in {nearbyTowns(s.code, c.slug).join(", ")}</dd></div>}
            </dl>
          </section>


          <section>
            <h2 className="mb-4 text-2xl font-bold">Signs to look for</h2>
            <ul className="grid gap-3 sm:grid-cols-2">{sub.signs.map((x) => <li key={x} className="flex gap-3 rounded-lg bg-white p-4 ring-1 ring-line"><Icon name="bolt" className="h-5 w-5 shrink-0 text-volt-dark" />{x}</li>)}</ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">How the work is done</h2>
            <ol className="space-y-3">{sub.process.map((x, i) => <li key={x.title} className="rounded-lg bg-white p-4 ring-1 ring-line"><p className="font-display font-bold">{i + 1}. {x.title}</p><p className="mt-1 text-sm text-ink/80">{x.text}</p></li>)}</ol>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold">What moves the price in {c.name}</h2>
            <p className="mb-4 text-muted">Electricians set their own prices. {sentences(local.housing)[0]}</p>
            <ul className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">{sub.costFactors.map((x) => <li key={x} className="flex gap-3 p-4"><Icon name="check" className="h-5 w-5 shrink-0 text-current" />{x}</li>)}</ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{sub.name} in {c.name}: questions</h2>
            <FaqList faqs={faqs} />
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Related help in {c.name}</h2>
            <div className="flex flex-wrap gap-2">
              {parentHere && <Link href={routes.cityService(s.slug, c.slug, parent.slug)} className="chip">{parent.name} in {c.name}</Link>}
              {siblings.map((x) => <Link key={x.sub.slug} href={routes.cityService(s.slug, c.slug, x.sub.slug)} className="chip">{x.sub.name} in {c.name}</Link>)}
              <Link href={routes.city(s.slug, c.slug)} className="chip font-semibold">Electricians in {c.name} →</Link>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">{sub.name} in other cities</h2>
            <div className="flex flex-wrap gap-2">
              {statePage && <Link href={routes.stateService(s.slug, sub.slug)} className="chip font-semibold">{sub.name} in {s.name}</Link>}
              {otherCities.map((x) => <Link key={x.state.code + x.city.slug} href={routes.cityService(x.state.slug, x.city.slug, sub.slug)} className="chip">{x.city.name}, {x.state.code}</Link>)}
              <Link href={routes.subservice(sub.slug)} className="chip">How {sub.name.toLowerCase()} works →</Link>
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><LeadFormBlock defaultService={parent.slug} /></aside>
      </div>
      <CtaBand title={`Need ${sub.name.toLowerCase()} in ${c.name}?`} />
      <JsonLd data={pageGraph({
        path, name: `${sub.name} in ${label}`, description: sentences(note)[0], crumbs, faqs,
        extra: [{ "@type": "Service", "@id": `${site.url}${path}#service`, name: `${sub.name} in ${label}`, serviceType: sub.name, areaServed: { "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: s.name } }, broker: { "@id": ORG_ID } }],
      })} />
    </>
  );
}
