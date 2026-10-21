import { photos } from "@/content/photos";
import Link from "next/link";
import { Hero, CtaBand } from "@/components/Hero";
import { ZipChecker } from "@/components/ZipChecker";
import { ZipBand } from "@/components/ZipBand";
import { StateTileMap } from "@/components/StateTileMap";
import { SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { regions, statesInRegion, citiesIn, zipCount, coveredStates, uncoveredStates, totalCities, totalZips, coverageDate, STATE_COUNT } from "@/content/locations";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = `Find a licensed electrician in ${STATE_COUNT} states and Washington, DC. Browse covered states and cities or check your ZIP code.`;
export const metadata = pageMeta({ title: `Electrician Service Areas: ${STATE_COUNT} States + DC`, description: desc, path: routes.locations });
const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: routes.locations }];
const fmt = (n: number) => n.toLocaleString("en-US");

export default function Page() {
  return (
    <>
      <Hero photo={photos.locations} crumbs={crumbs} eyebrow="Service areas" title="Electricians across the United States"
        lead={<p>We route calls to independent electricians in {fmt(totalCities)} cities and towns and {fmt(totalZips)} ZIP codes across {coveredStates.length - 1} states and Washington, DC. Coverage is listed ZIP by ZIP, because that is how electricians define where they work.</p>} />
      <ZipBand title="Check your ZIP code" note={`Coverage refreshed ${coverageDate}.`} stats={[[`${coveredStates.length - 1} + DC`, "states"], [fmt(totalCities), "cities & towns"], [fmt(totalZips), "ZIP codes"]]} />

      <section className="py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="card p-4 sm:p-6"><StateTileMap /></div>
          <div className="prose-bl">
            <h2 className="mb-3 text-2xl font-bold">How service areas work</h2>
            <p>Each independent electrician in our network chooses the ZIP codes they serve. When you call, we connect you with an electrician who covers your address. Coverage changes as electricians join or adjust their areas; it was last refreshed on {coverageDate}.</p>
            <h3 className="mb-2 text-lg font-bold">What changes from place to place</h3>
            <p>Licensing is set by the state, and in some places by the city or county. Permits are issued by your city or county building department, and some cities run their own electrical codes. The electrician you hire handles the permit and inspection.</p>
            <h3 className="mb-2 text-lg font-bold">Weather and housing</h3>
            <p>A Gulf Coast home needs storm and surge planning; a Northeast triple-decker often needs rewiring. Each state page notes the local conditions that drive most electrical calls.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x">
          <SectionHeading title="States by region" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r) => statesInRegion(r.slug).length > 0 && (
              <div key={r.slug}>
                <h3 className="mb-3 border-b-2 border-volt pb-2 text-lg font-bold">{r.name}</h3>
                <ul className="space-y-1.5">
                  {statesInRegion(r.slug).map((s) => (
                    <li key={s.code}><Link href={routes.state(s.slug)} className="flex justify-between gap-2 hover:text-current"><span className="font-semibold">{s.name}</span><span className="text-sm text-muted">{fmt(citiesIn(s.code).length)} cities · {fmt(zipCount(s.code))} ZIPs</span></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-xl bg-paper p-5 text-sm ring-1 ring-line">
            <strong>Not yet covered:</strong> {uncoveredStates.map((s) => s.name).join(", ")}. No electricians in our network serve these states right now, so we do not publish pages for them. Coverage is reviewed each time the network data is refreshed.
          </p>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={pageGraph({ path: routes.locations, name: "Electrician service areas", description: desc, type: "CollectionPage", crumbs })} />
    </>
  );
}
