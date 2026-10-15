import Image from "next/image";
import { photos, categoryPhoto, upgradePairs, guidePhoto, servicePhoto } from "@/content/photos";
import Link from "next/link";
import { Hero, CtaBand } from "@/components/Hero";
import { ZipChecker } from "@/components/ZipChecker";
import { ZipBand } from "@/components/ZipBand";
import { SectionHeading, ServiceCard } from "@/components/ui";
import { StateTileMap } from "@/components/StateTileMap";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/icons";
import { PhoneLink } from "@/components/PhoneLink";
import { categories, servicesIn, getService } from "@/content/services";
import { coveredStates, totalCities, totalZips } from "@/content/locations";
import { articles } from "@/content/articles";
import { availability, BRAND_PROMISE } from "@/content/site";
import { homeFaqs } from "@/content/faqs";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { cityPages } from "@/lib/sitemap";

const desc = "Find a licensed electrician for repairs, panel upgrades, EV chargers, lighting and emergencies. One call connects you with a local pro in 47 states and DC.";
export const metadata = pageMeta({ title: "Brightlane Electric: Licensed Electricians Nationwide", description: desc, path: "/" });

const problems = [
  { s: "Breaker keeps tripping", href: routes.guide("breaker-keeps-tripping") },
  { s: "Outlet stopped working", href: routes.guide("outlet-not-working") },
  { s: "Burning smell from an outlet", href: routes.guide("burning-smell-from-outlet") },
  { s: "Lights flicker or dim", href: routes.service("electrical-repair") },
  { s: "Need an EV charger", href: routes.service("ev-charger-installation") },
  { s: "Old fuse box or panel", href: routes.guide("signs-you-need-a-panel-upgrade") },
  { s: "Power outages and storms", href: routes.service("generator-installation") },
  { s: "Smoke alarms chirping", href: routes.guide("smoke-alarm-replacement") },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Home() {
  const big = cityPages();
  return (
    <div data-home>
      <Hero photo={photos.hero} bleed
        eyebrow="Electrical repair · upgrades · emergencies"
        title="Licensed electricians, one call away, almost anywhere in the US."
        lead={<p>{BRAND_PROMISE} Tell us what is wrong and where you are, and we route you to an electrician who works your ZIP code, from dead outlets to panel upgrades and EV chargers.</p>}
        facts={[availability, `${coveredStates.length - 1} states + DC`, "Free to use, no obligation"]}
      />

      <ZipBand title="Is there an electrician near you?" note={`Check your ZIP code against ${fmt(totalZips)} covered ZIP codes.`}
        stats={[[`${coveredStates.length - 1} + DC`, "states"], [fmt(totalCities), "cities & towns"], [fmt(totalZips), "ZIP codes"]]} />

      <section className="border-b border-line bg-white">
        <div className="container-x grid gap-6 py-8 sm:grid-cols-3">
          {[["phone", "Talk to a person", "Explain the problem once, and get routed to an electrician who covers your address."], ["shield", "Licensed pros only", "Requests go to independent electricians licensed for the work they do."], ["clock", "Start with safety", "Our guides tell you what to shut off and what to leave alone before help arrives."]].map(([i, t, d]) => (
            <div key={t} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-volt-tint text-ink"><Icon name={i as "phone"} /></span>
              <div><p className="font-display font-bold">{t}</p><p className="text-sm text-muted">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-alert text-white">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <p className="flex items-start gap-3 text-lg"><Icon name="alert" className="mt-0.5 h-7 w-7 shrink-0" /><span><b>Burning smell, sparks or a buzzing panel?</b> Turn off the circuit if it is safe, then call. Smoke or flame: get out and call 911.</span></p>
          <Link href={routes.emergency} className="btn shrink-0 bg-white text-alert hover:bg-alert-tint">Emergency help</Link>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Services" title="What electricians in our network handle" lead="Fourteen common jobs, grouped the way homeowners search for them." />
          {categories.map((c) => (
            <div key={c.slug} className="mb-12 grid gap-6 last:mb-0 lg:grid-cols-[300px_minmax(0,1fr)]">
              <Link href={`${routes.services}#${c.slug}`} className="group relative block min-h-48 overflow-hidden rounded-2xl bg-ink text-white">
                <Image src={categoryPhoto[c.slug].src} alt={categoryPhoto[c.slug].alt} fill sizes="(min-width: 1024px) 300px, 100vw" className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-xl font-bold">{c.name}</span>
                  <span className="mt-1 block text-sm text-white/80">{c.blurb}</span>
                </span>
              </Link>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {servicesIn(c.slug).map((s) => <ServiceCard key={s.slug} image={servicePhoto(s.slug, s.category)} href={routes.service(s.slug)} icon={s.icon} title={s.name} text={s.answer.split(". ")[0] + "."} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="container-x">
          <p className="eyebrow mb-3 text-volt">Before &amp; after</p>
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Common upgrades, and what changes</h2>
          <p className="mt-3 max-w-2xl text-white/75">Three of the projects homeowners ask about most. The photos are examples to show the difference, not jobs completed by electricians in our network.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {upgradePairs.map((u) => (
              <article key={u.title} className="overflow-hidden rounded-2xl bg-ink-2 ring-1 ring-white/10">
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  {([["Before", u.before], ["After", u.after]] as const).map(([label, ph]) => (
                    <figure key={label} className="relative aspect-[4/5] overflow-hidden">
                      <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1024px) 16vw, 50vw" className="object-cover" />
                      <figcaption className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${label === "Before" ? "bg-white/90 text-ink" : "bg-volt text-ink"}`}>{label}</figcaption>
                    </figure>
                  ))}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{u.text}</p>
                  <Link href={u.href} className="mt-4 inline-block text-sm font-semibold text-volt hover:underline">How this upgrade works →</Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/50">Example stock photos from Pexels.</p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <SectionHeading eyebrow="Symptom finder" title="What's going on with your electrical?" lead="Pick the closest match. Each one opens a plain-English explanation and when to call." />
          <ul className="grid gap-3 sm:grid-cols-2">
            {problems.map((p) => (
              <li key={p.s}><Link href={p.href} className="flex min-h-14 items-center justify-between gap-3 rounded-lg bg-paper px-4 py-3 font-semibold ring-1 ring-line hover:bg-volt-tint hover:ring-volt">{p.s}<span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="relative">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-2/3 w-2/3 rounded-2xl bg-volt" />
            <Image src={photos.howItWorks.src} alt={photos.howItWorks.alt} width={photos.howItWorks.width} height={photos.howItWorks.height} sizes="(min-width: 1024px) 40vw, 100vw" className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" />
          </div>
          <div>
          <SectionHeading eyebrow="How it works" title="From your call to a licensed electrician" />
          <ol className="grid gap-4">
            {[["Tell us the problem", "Call or send the short form: what is wrong, your ZIP code and how soon you need help."], ["We route you", "Your call or request goes to an independent, licensed electrician who serves your area."], ["The electrician takes it from there", "They confirm the details, quote the work and schedule it. You decide whether to hire them."]].map(([t, d], i) => (
              <li key={t} className="card flex gap-5 p-5">
                <span className="font-display text-4xl font-bold leading-none text-volt">0{i + 1}</span>
                <div><p className="font-display text-lg font-bold">{t}</p><p className="mt-1 text-muted">{d}</p></div>
              </li>
            ))}
          </ol>
          </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center">
          <div>
            <p className="eyebrow mb-3 text-volt">Coverage</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Electricians in {coveredStates.length - 1} states and Washington, DC</h2>
            <p className="mt-4 text-white/80">Coverage is built ZIP by ZIP from the electricians who take calls in each area. Highlighted states have active coverage; select one to see its covered cities.</p>
            <div className="mt-6 rounded-xl bg-white/5 p-5 ring-1 ring-white/10"><ZipChecker dark /></div>
            <p className="mt-6 text-sm text-white/70">Major metros: {big.map((p, i) => <span key={p.city.slug + p.state.code}>{i > 0 && " · "}<Link href={routes.city(p.state.slug, p.city.slug)} className="hover:text-volt hover:underline">{p.city.name}</Link></span>)}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 sm:p-6"><StateTileMap /></div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Guides" title="Know what you're dealing with" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((a) => (
              <Link key={a.slug} href={routes.guide(a.slug)} className="card group flex flex-col overflow-hidden hover:ring-ink">
                <span className="relative block aspect-[16/9] overflow-hidden">
                  <Image src={guidePhoto(a.slug, a.services).src} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="flex flex-1 flex-col p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-current">{a.category}</span>
                <h3 className="mt-2 text-lg font-bold group-hover:underline">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{a.answer}</p>
                </span>
              </Link>
            ))}
          </div>
          <Link href={routes.resources} className="link mt-6 inline-block">All electrical guides →</Link>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <SectionHeading eyebrow="FAQ" title="Questions people ask before they call" />
            <PhoneLink />
          </div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <CtaBand />
      <JsonLd data={pageGraph({ path: "/", name: "Brightlane Electric", description: desc, crumbs: [{ name: "Home", path: "/" }], faqs: homeFaqs })} />
    </div>
  );
}
