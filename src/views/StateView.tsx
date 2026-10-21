import { photos } from "@/content/photos";
import { stateServicesFor, subStatesFor } from "@/lib/coverage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero, CtaBand } from "@/components/Hero";
import { ZipChecker } from "@/components/ZipChecker";
import { ZipBand } from "@/components/ZipBand";
import { FaqList } from "@/components/FaqList";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { JsonLd } from "@/components/JsonLd";
import { coveredStates, getState, getRegion, citiesIn, zipCount, statesInRegion, coverageDate } from "@/content/locations";
import { cityServicePages, cityPages } from "@/lib/sitemap";
import { publishedServices } from "@/content/services";
import { availability } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const fmt = (n: number) => n.toLocaleString("en-US");

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const s = getState((await params).state)!;
  const n = citiesIn(s.code).length;
  return pageMeta({
    title: `Electricians in ${s.name}`,
    description: `Connect with a licensed electrician in ${s.name}: ${fmt(n)} covered ${n === 1 ? "city" : "cities and towns"}, ${fmt(zipCount(s.code))} ZIP codes. Repairs, panels, EV chargers and emergencies.`,
    path: routes.state(s.slug),
  });
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const s = getState((await params).state);
  if (!s) notFound();
  const r = getRegion(s.region);
  const cities = citiesIn(s.code);
  const zips = zipCount(s.code);
  const metroSlugs = new Set(cityPages().filter((p) => p.state.code === s.code).map((p) => p.city.slug));
  const metros = cities.filter((c) => metroSlugs.has(c.slug));
  const localGuides = cityServicePages().filter((p) => p.state.code === s.code);
  const stateGuides = stateServicesFor(s.code);
  const stateSubs = subStatesFor(s.code);
  const top = cities.slice(0, 48);
  const rest = cities.slice(48).sort((a, b) => a.name.localeCompare(b.name));
  const counties = new Set(cities.map((c) => c.county).filter(Boolean)).size;
  const path = routes.state(s.slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: routes.locations }, { name: s.name, path }];
  const isDC = s.code === "DC";
  const faqs = [
    { q: `Which parts of ${s.name} do you cover?`, a: `Electricians in our network currently serve ${fmt(cities.length)} ${cities.length === 1 ? "city" : "cities and towns"} and ${fmt(zips)} ZIP codes${counties > 1 ? ` across ${counties} counties` : ""} in ${s.name}. Enter your ZIP code above to confirm your address.` },
    { q: `Do electricians need a license in ${s.name}?`, a: `Electrical work in ${s.name} is regulated, and licensing is handled at the ${isDC ? "District" : "state and, in some places, local"} level. Ask any electrician for their license number and verify it with the licensing board before work starts.` },
    { q: `Who issues electrical permits in ${s.name}?`, a: `Permits are issued by the ${isDC ? "District's" : "city or county"} building department where the property is located. Panel upgrades, new circuits, EV chargers and generators almost always need one, and the electrician normally pulls it.` },
  ];
  const neighbors = statesInRegion(s.region).filter((x) => x.code !== s.code);
  return (
    <>
      <Hero photo={photos.storm} crumbs={crumbs} eyebrow={`${r.name} · ${fmt(cities.length)} covered ${cities.length === 1 ? "city" : "cities"}`} title={`Electricians in ${s.name}`}
        lead={<p>Get connected with an independent, licensed electrician in {s.name} for repairs, panel upgrades, EV chargers, lighting and urgent problems. {s.note}</p>}
        facts={[availability, `${fmt(zips)} ZIP codes covered`]} />
      <ZipBand title={`Check your ${s.name} ZIP code`} note={`Coverage refreshed ${coverageDate}.`} stats={[[fmt(cities.length), cities.length === 1 ? "covered city" : "covered cities"], [fmt(zips), "ZIP codes"]]} />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-3xl font-bold">Electrical conditions in {s.name}</h2>
            <div className="prose-bl text-lg">
              <p>{s.note} Across the {r.name}, homes deal with {r.climate}, and the housing stock includes {r.housing}.</p>
              <p>That mix shapes the calls electricians here get most. When you call, describe the problem and the age of the home if you know it; it helps the electrician arrive with the right parts.</p>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {r.issues.map((i) => <li key={i} className="card-top p-4 text-sm font-semibold">{i}</li>)}
            </ul>
          </section>

          {metros.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">Metro guides in {s.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {metros.map((c) => <Link key={c.slug} href={routes.city(s.slug, c.slug)} className="card flex items-center justify-between p-5 font-display text-lg font-bold hover:ring-ink">Electricians in {c.name} <span aria-hidden="true">→</span></Link>)}
              </div>
              {localGuides.length > 0 && (
                <>
                  <h3 className="mb-3 mt-6 text-lg font-bold">Local service guides</h3>
                  <div className="flex flex-wrap gap-2">
                    {localGuides.map((p) => <Link key={p.city.slug + p.service.slug} href={routes.cityService(s.slug, p.city.slug, p.service.slug)} className="chip">{p.service.name} in {p.city.name}</Link>)}
                  </div>
                </>
              )}
              {(stateGuides.length > 0 || stateSubs.length > 0) && (
                <>
                  <h3 className="mb-3 mt-6 text-lg font-bold">Statewide service guides</h3>
                  <div className="flex flex-wrap gap-2">
                    {stateGuides.map((p) => <Link key={p.service.slug} href={routes.stateService(s.slug, p.service.slug)} className="chip">{p.service.name} in {s.name}</Link>)}
                    {stateSubs.map((p) => <Link key={p.sub.slug} href={routes.stateService(s.slug, p.sub.slug)} className="chip">{p.sub.name} in {s.name}</Link>)}
                  </div>
                </>
              )}
            </section>
          )}

          <section>
            <h2 className="mb-2 text-2xl font-bold">Covered cities and towns in {s.name}</h2>
            <p className="mb-5 text-muted">{fmt(cities.length)} {cities.length === 1 ? "location" : "locations"}, largest first. Any covered ZIP code can call for service.</p>
            <ul className="columns-2 gap-6 text-sm sm:columns-3">
              {top.map((c) => <li key={c.slug} className="mb-1.5 break-inside-avoid">{metroSlugs.has(c.slug) ? <Link href={routes.city(s.slug, c.slug)} className="link">{c.name}</Link> : c.name} <span className="text-muted">({c.zips.length} ZIP{c.zips.length > 1 ? "s" : ""})</span></li>)}
            </ul>
            {rest.length > 0 && (
              <details className="mt-4 rounded-xl bg-white p-5 ring-1 ring-line">
                <summary className="cursor-pointer font-semibold">Show all {fmt(rest.length)} more locations (A–Z)</summary>
                <ul className="mt-4 columns-2 gap-6 text-sm sm:columns-3">{rest.map((c) => <li key={c.slug + c.zips[0]} className="mb-1 break-inside-avoid">{c.name}</li>)}</ul>
              </details>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Electrical services in {s.name}</h2>
            <div className="flex flex-wrap gap-2">{publishedServices.map((x) => <Link key={x.slug} href={routes.service(x.slug)} className="chip">{x.name}</Link>)}</div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{s.name} FAQ</h2>
            <FaqList faqs={faqs} />
          </section>

          {neighbors.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Nearby states in the {r.name}</h2>
              <div className="flex flex-wrap gap-2">{neighbors.map((n) => <Link key={n.code} href={routes.state(n.slug)} className="chip">{n.name}</Link>)}<Link href={routes.locations} className="chip font-semibold">All states →</Link></div>
            </section>
          )}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><LeadFormBlock /></aside>
      </div>
      <CtaBand title={`Need an electrician in ${s.name}?`} />
      <JsonLd data={pageGraph({ path, name: `Electricians in ${s.name}`, description: s.note, type: "CollectionPage", crumbs, faqs })} />
    </>
  );
}
