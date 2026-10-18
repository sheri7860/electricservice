import { servicePhoto } from "@/content/photos";
import { linkify, linkCtx } from "@/lib/linker";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero, CtaBand } from "@/components/Hero";
import { FaqList } from "@/components/FaqList";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/icons";
import { getService } from "@/content/services";
import { articles } from "@/content/articles";
import { availability, site } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { sentences } from "@/lib/text";
import { pageGraph, ORG_ID } from "@/lib/schema";
import { cityServicePages, cityServicesFor, citiesForService } from "@/lib/sitemap";

function describe(note: string, city: string) {
  const s = sentences(note);
  let d = s[0];
  if (d.length > 155) d = d.slice(0, 152).replace(/\s+\S*$/, "") + "…";
  else if (d.length < 90 && s[1] && d.length + s[1].length < 158) d += " " + s[1];
  const withSuffix = `${d} Local permits, costs and what to ask a ${city} electrician.`;
  if (d.length < 120 && withSuffix.length <= 160) return withSuffix;
  if (d.length < 110) return `${d} Permits and costs in ${city}.`;
  return d;
}

type P = { params: Promise<{ state: string; city: string; service: string }> };

const find = (st: string, c: string, sv: string) => cityServicePages().find((p) => p.state.slug === st && p.city.slug === c && p.service.slug === sv);

export async function generateMetadata({ params }: P) {
  const { state, city, service } = await params;
  const p = find(state, city, service)!;
  return pageMeta({
    title: `${p.service.name} in ${p.city.name}, ${p.state.code}`,
    description: describe(p.note, p.city.name),
    path: routes.cityService(p.state.slug, p.city.slug, p.service.slug),
  });
}

export default async function Page({ params }: P) {
  const { state, city, service } = await params;
  const p = find(state, city, service);
  if (!p) notFound();
  const { state: s, city: c, local, service: svc, note } = p;
  const label = `${c.name}, ${s.code}`;
  const path = routes.cityService(s.slug, c.slug, svc.slug);
  const localLinks = new Map(cityServicesFor(s.code, c.slug).map((x) => [routes.service(x.service.slug), routes.cityService(s.slug, c.slug, x.service.slug)]));
  const lc = linkCtx(path, 5, (h) => localLinks.get(h) ?? h);
  lc.used.add(routes.service(svc.slug));
  const crumbs = [
    { name: "Home", path: "/" }, { name: "Locations", path: routes.locations }, { name: s.name, path: routes.state(s.slug) },
    { name: c.name, path: routes.city(s.slug, c.slug) }, { name: svc.name, path },
  ];
  const paras = sentences(note);
  const lead = paras.slice(0, 2).join(" ");
  const body = paras.slice(2).join(" ");
  const siblings = cityServicesFor(s.code, c.slug).filter((x) => x.service.slug !== svc.slug);
  const otherCities = citiesForService(svc.slug).filter((x) => x.city.slug !== c.slug);
  const guides = articles.filter((a) => a.services.includes(svc.slug)).slice(0, 4);
  const related = svc.related.map(getService).filter(Boolean).slice(0, 4);
  const faqs = [
    { q: `Do I need a permit for ${svc.name.toLowerCase()} in ${c.name}?`, a: `${svc.slug === "electrical-inspection" ? "An inspection itself does not need a permit, but any repairs it leads to usually do. " : "In most cases, yes. "}${local.permits} The electrician normally pulls the permit and arranges the inspection.` },
    ...svc.faqs.slice(0, 3),
    { q: `What electrical issues are common in ${c.name} homes?`, a: `Electricians in ${c.name} most often see: ${local.issues.map((i) => i.charAt(0).toLowerCase() + i.slice(1)).join("; ")}.` },
  ];
  return (
    <>
      <Hero photo={servicePhoto(svc.slug, svc.category)} crumbs={crumbs} eyebrow={`${svc.name} · ${label}`} title={`${svc.name} in ${label}`} requestHref={`${routes.request}?service=${svc.slug}`}
        lead={<p>{lead}</p>}
        facts={[availability, "Independent, licensed electricians", `Serving ${local.areas.slice(0, 3).join(", ")} and more`]} />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-3xl font-bold">What&apos;s different about {svc.name.toLowerCase()} in {c.name}</h2>
            <div className="prose-bl text-lg">
              {body && <p>{linkify(body, lc)}</p>}
              <p>{linkify(local.housing, lc)}</p>
            </div>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2">
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Permits in {c.name}</dt><dd className="mt-1 text-sm font-semibold">{local.permits}</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Where we connect you</dt><dd className="mt-1 text-sm font-semibold">{c.zips.length} ZIP codes in {c.name}, including {local.areas.join(", ")}</dd></div>
            </dl>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Signs it&apos;s time to call</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {svc.signs.slice(0, 6).map((x) => <li key={x} className="flex gap-3 rounded-lg bg-white p-4 ring-1 ring-line"><Icon name="bolt" className="h-5 w-5 shrink-0 text-volt-dark" />{x}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">How the job usually goes</h2>
            <ol className="space-y-3">
              {svc.process.map((x, i) => <li key={x.title} className="rounded-lg bg-white p-4 ring-1 ring-line"><p className="font-display font-bold">{i + 1}. {x.title}</p><p className="mt-1 text-sm text-ink/80">{x.text}</p></li>)}
            </ol>
            <p className="mt-4 text-sm">Full details on <Link href={routes.service(svc.slug)} className="link">{svc.name.toLowerCase()}</Link>, including what you can safely check yourself.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold">What moves the price in {c.name}</h2>
            <p className="mb-4 text-muted">Electricians set their own prices. Local permit fees, utility coordination and the age of the home all play a part, along with:</p>
            <ul className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">
              {svc.costFactors.map((x) => <li key={x} className="flex gap-3 p-4"><Icon name="check" className="h-5 w-5 shrink-0 text-current" />{x}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Stop and call an electrician if</h2>
            <ul className="space-y-2 rounded-xl bg-alert-tint p-5">{svc.diy.stop.map((x) => <li key={x}>✕ {x}</li>)}</ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{svc.name} in {c.name}: questions</h2>
            <FaqList faqs={faqs} />
          </section>

          {(siblings.length > 0 || related.length > 0) && (
            <section>
              <h2 className="mb-3 text-xl font-bold">More electrical help in {c.name}</h2>
              <div className="flex flex-wrap gap-2">
                {siblings.map((x) => <Link key={x.service.slug} href={routes.cityService(s.slug, c.slug, x.service.slug)} className="chip">{x.service.name} in {c.name}</Link>)}
                {related.map((r) => r && <Link key={r.slug} href={routes.service(r.slug)} className="chip">{r.name}</Link>)}
                <Link href={routes.city(s.slug, c.slug)} className="chip font-semibold">Electricians in {c.name} →</Link>
              </div>
            </section>
          )}

          {otherCities.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold">{svc.name} in other cities</h2>
              <div className="flex flex-wrap gap-2">
                {otherCities.map((x) => <Link key={x.state.code + x.city.slug} href={routes.cityService(x.state.slug, x.city.slug, svc.slug)} className="chip">{x.city.name}, {x.state.code}</Link>)}
              </div>
            </section>
          )}

          {guides.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Guides</h2>
              <ul className="grid gap-2 sm:grid-cols-2">{guides.map((g) => <li key={g.slug}><Link href={routes.guide(g.slug)} className="link">{g.title}</Link></li>)}</ul>
            </section>
          )}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><LeadFormBlock defaultService={svc.slug} /></aside>
      </div>
      <CtaBand title={`Need ${svc.name.toLowerCase()} in ${c.name}?`} />
      <JsonLd data={pageGraph({
        path, name: `${svc.name} in ${label}`, description: lead, crumbs, faqs,
        extra: [{
          "@type": "Service", "@id": `${site.url}${path}#service`, name: `${svc.name} in ${label}`, serviceType: svc.name,
          areaServed: { "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: s.name } },
          broker: { "@id": ORG_ID },
        }],
      })} />
    </>
  );
}
