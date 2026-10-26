import { nearbyTowns } from "@/lib/nearby";
import { photos } from "@/content/photos";
import { subCityFor } from "@/lib/coverage";
import { linkify, linkCtx } from "@/lib/linker";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero, CtaBand } from "@/components/Hero";
import { FaqList } from "@/components/FaqList";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { JsonLd } from "@/components/JsonLd";
import { getService } from "@/content/services";
import { articles } from "@/content/articles";
import { availability } from "@/content/site";
import { citiesIn } from "@/content/locations";
import { routes } from "@/lib/routes";
import { pageMeta, ctaTitle, ctaDescription } from "@/lib/seo";
import { sentences } from "@/lib/text";
import { pageGraph } from "@/lib/schema";
import { cityPages, cityServicesFor } from "@/lib/sitemap";
import { citySeasons } from "@/content/citySeasons";
import { cityUtility } from "@/content/cityUtility";

const find = (st: string, c: string) => cityPages().find((p) => p.state.slug === st && p.city.slug === c);

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const p = find(state, city)!;
  return pageMeta({
    title: ctaTitle(`Electricians in ${p.city.name}, ${p.state.code}`),
    description: ctaDescription("an electrician", `${p.city.name}, ${p.state.code}`, `Repairs, panels, EV chargers and emergencies in ${p.local.areas.slice(0, 3).join(", ")} and ${p.city.zips.length} ZIP codes.`),
    path: routes.city(p.state.slug, p.city.slug),
  });
}

const popular = ["electrical-repair", "panel-upgrade", "ev-charger-installation", "generator-installation", "home-rewiring", "surge-protection"];

export default async function Page({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const p = find(state, city);
  if (!p) notFound();
  const { state: s, city: c, local } = p;
  const label = `${c.name}, ${s.code}`;
  const path = routes.city(s.slug, c.slug);
  const localLinks = new Map(cityServicesFor(s.code, c.slug).map((x) => [routes.service(x.service.slug), routes.cityService(s.slug, c.slug, x.service.slug)]));
  const lc = linkCtx(path, 5, (h) => localLinks.get(h) ?? h);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: routes.locations }, { name: s.name, path: routes.state(s.slug) }, { name: c.name, path }];
  const localSvcs = cityServicesFor(s.code, c.slug);
  const calls = [...localSvcs.map((x) => x.service.slug), ...popular.filter((x) => !localSvcs.some((l) => l.service.slug === x))].slice(0, 8);
  const metros = cityPages().filter((p) => !(p.state.code === s.code && p.city.slug === c.slug));
  const siblings = [...metros.filter((p) => p.state.code === s.code), ...metros.filter((p) => p.state.code !== s.code && p.state.region === s.region)].slice(0, 8);
  const localSlugs = new Set(localSvcs.map((x) => x.service.slug));
  const cityGuides = [...articles.filter((a) => a.services.some((x) => localSlugs.has(x))), ...articles].filter((a, i, arr) => arr.indexOf(a) === i).slice(0, 4);
  const citySubs = subCityFor(s.code, c.slug);
  const nearby = citiesIn(s.code).filter((x) => x.slug !== c.slug && x.county === c.county).slice(0, 12);
  const faqs = [
    { q: `Who issues electrical permits in ${c.name}?`, a: local.permits },
    { q: `Which ${c.name} ZIP codes are covered?`, a: `Electricians in our network cover ${c.zips.length} ZIP codes in ${c.name}, including ${c.zips.slice(0, 8).join(", ")}${c.zips.length > 8 ? " and more" : ""}.` },
    { q: `What are the most common electrical problems in ${c.name}?`, a: local.issues.join("; ") + "." },
  ];
  return (
    <>
      <Hero photo={photos.locations} crumbs={crumbs} eyebrow={`${s.name} · ${local.county ?? c.county + " County"}`} title={`Electricians in ${label}`}
        lead={<p>{sentences(local.intro).slice(0, 2).join(" ")}</p>}
        facts={[availability, `${c.zips.length} ZIP codes covered`, `Serving ${local.areas.slice(0, 3).join(", ")} and more`]} />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-3xl font-bold">Homes and wiring in {c.name}</h2>
            <div className="prose-bl text-lg"><p>{linkify(local.intro, lc)}</p><p>{linkify(local.housing, lc)}</p></div>
          </section>
          {citySeasons[`${s.code}/${c.slug}`] && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">Weather, seasons and the utility</h2>
              <div className="prose-bl"><p>{linkify(citySeasons[`${s.code}/${c.slug}`], lc)}</p></div>
            </section>
          )}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Local issues electricians see</h2>
            <ul className="grid gap-3 sm:grid-cols-3">{local.issues.map((i) => <li key={i} className="card-top p-4 text-sm font-semibold">{i}</li>)}</ul>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">Common calls in {c.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {calls.map((slug) => {
                const x = getService(slug)!;
                const loc = localSvcs.find((l) => l.service.slug === slug);
                return (
                  <Link key={slug} href={loc ? routes.cityService(s.slug, c.slug, slug) : routes.service(slug)} className="card p-4 hover:ring-ink">
                    <span className="font-display font-bold">{loc ? `${x.name} in ${c.name}` : x.name}</span>
                    <span className="mt-1 block text-sm text-muted">{sentences(loc ? loc.note : x.answer)[0]}</span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-4 text-sm">Something urgent? See <Link href={routes.emergency} className="link">emergency electrician help</Link> or browse <Link href={routes.services} className="link">all electrical services</Link>.</p>
          </section>
          <section>
            <dl className="grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2">
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">{c.name} at a glance</dt><dd className="mt-1 font-semibold">{local.county ?? c.county + " County"}, {s.name}</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">ZIP codes covered</dt><dd className="mt-1 font-semibold">{c.zips.length}</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Neighborhoods</dt><dd className="mt-1 font-semibold">{local.areas.join(", ")}</dd></div>
              {nearbyTowns(s.code, c.slug).length > 0 && <div className="bg-white p-4 sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Nearby towns also served</dt><dd className="mt-1 text-sm font-semibold">{nearbyTowns(s.code, c.slug).join(", ")}</dd></div>}
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Permits</dt><dd className="mt-1 font-semibold">Pulled by the electrician</dd></div>
              {cityUtility[`${s.code}/${c.slug}`] && <div className="bg-white p-4 sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Electric utility</dt><dd className="mt-1 font-semibold">{cityUtility[`${s.code}/${c.slug}`]}</dd><p className="mt-1 text-sm text-muted">The utility owns the meter and service drop, so service upgrades and storm reconnections are scheduled with it.</p></div>}
            </dl>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">{c.name} FAQ</h2>
            <FaqList faqs={faqs} />
          </section>
          {citySubs.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Specialized jobs in {c.name}</h2>
              <div className="flex flex-wrap gap-2">{citySubs.map((x) => <Link key={x.sub.slug} href={routes.cityService(s.slug, c.slug, x.sub.slug)} className="chip">{x.sub.name} in {c.name}</Link>)}</div>
            </section>
          )}
          <section>
            <h2 className="mb-3 text-xl font-bold">Guides</h2>
            <ul className="grid gap-2 sm:grid-cols-2">{cityGuides.map((a) => <li key={a.slug}><Link href={routes.guide(a.slug)} className="link">{a.title}</Link></li>)}</ul>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold">Nearby and related metro guides</h2>
            {nearby.length > 0 && <p className="mb-3 text-sm text-muted">Also covered in {local.county ?? c.county + " County"}: {nearby.map((n) => n.name).join(" · ")}</p>}
            <div className="flex flex-wrap gap-2">
              {siblings.map((p) => <Link key={p.state.code + p.city.slug} href={routes.city(p.state.slug, p.city.slug)} className="chip">Electricians in {p.city.name}, {p.state.code}</Link>)}
              <Link href={routes.state(s.slug)} className="chip font-semibold">All covered cities in {s.name} →</Link>
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><LeadFormBlock /></aside>
      </div>
      <CtaBand title={`Need an electrician in ${c.name}?`} />
      <JsonLd data={pageGraph({ path, name: `Electricians in ${label}`, description: local.intro, crumbs, faqs })} />
    </>
  );
}
