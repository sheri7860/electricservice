import { servicePhoto } from "@/content/photos";
import { linkify, linkCtx } from "@/lib/linker";
import { serviceExtras } from "@/content/serviceExtras";
import Link from "next/link";
import { Hero, CtaBand } from "./Hero";
import { FaqList } from "./FaqList";
import { LeadFormBlock } from "./lead/LeadFormBlock";
import { PhoneLink } from "./PhoneLink";
import { ServiceCard } from "./ui";
import { Icon } from "./icons";
import { JsonLd } from "./JsonLd";
import type { Service } from "@/content/types";
import { getService, categories } from "@/content/services";
import { articles } from "@/content/articles";
import { availability } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import { cityPages, citiesForService } from "@/lib/sitemap";
import { site } from "@/content/site";

export function ServiceTemplate({ s, path, crumbs }: { s: Service; path: string; crumbs: { name: string; path: string }[] }) {
  const cat = categories.find((c) => c.slug === s.category)!;
  const guides = articles.filter((a) => a.services.includes(s.slug));
  const related = s.related.map(getService).filter(Boolean) as Service[];
  const local = citiesForService(s.slug);
  const extra = serviceExtras[s.slug];
  const faqs = [...s.faqs, ...(extra?.faqs ?? [])];
  const lc = linkCtx(path, 5);
  const nav = [["Overview", "overview"], ["Signs", "signs"], ["Process", "process"], ["Cost", "cost"], ["Safety", "diy"], ...(extra?.terms.length ? [["Key terms", "terms"]] : []), ["FAQ", "faq"]];
  return (
    <>
      <Hero photo={servicePhoto(s.slug, s.category)} crumbs={crumbs} eyebrow={cat.name} title={s.h1} emergency={s.isEmergencyCapable && s.slug === "emergency-electrician"} requestHref={`${routes.request}?service=${s.slug}`}
        lead={<p>{s.answer}</p>} facts={[availability, "Licensed, independent electricians", "47 states + DC"]} />

      <nav aria-label="On this page" className="sticky top-[72px] z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-x flex gap-1 overflow-x-auto py-2 text-sm font-semibold">
          {nav.map(([n, id]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-md px-3 py-2 hover:bg-white">{n}</a>)}
        </div>
      </nav>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-14">
          <section id="overview" className="scroll-mt-32">
            <h2 className="mb-4 text-3xl font-bold">About {s.name.toLowerCase()}</h2>
            <div className="prose-bl text-lg">{s.intro.map((p) => <p key={p.slice(0, 20)}>{linkify(p, lc)}</p>)}</div>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2">
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">{s.name} at a glance</dt><dd className="mt-1 font-semibold">{cat.name}</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Who does the work</dt><dd className="mt-1 font-semibold">An independent licensed electrician</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Urgent calls</dt><dd className="mt-1 font-semibold">{s.isEmergencyCapable ? "Yes, call for same-day help when available" : "Usually scheduled"}</dd></div>
              <div className="bg-white p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted">Typical first step</dt><dd className="mt-1 font-semibold">{s.process[0].title}</dd></div>
            </dl>
          </section>

          <section id="signs" className="scroll-mt-32">
            <h2 className="mb-4 text-3xl font-bold">Signs you need this</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {s.signs.map((x) => <li key={x} className="flex gap-3 rounded-lg bg-white p-4 ring-1 ring-line"><Icon name="bolt" className="h-5 w-5 shrink-0 text-volt-dark" /><span>{linkify(x, lc)}</span></li>)}
            </ul>
          </section>

          <section id="process" className="scroll-mt-32">
            <h2 className="mb-4 text-3xl font-bold">What the electrician does</h2>
            <ol className="relative space-y-6 border-l-2 border-volt pl-8">
              {s.process.map((p, i) => (
                <li key={p.title} className="relative">
                  <span className="absolute -left-[46px] grid h-8 w-8 place-items-center rounded-full bg-ink font-display text-sm font-bold text-volt">{i + 1}</span>
                  <p className="font-display text-xl font-bold">{p.title}</p>
                  <p className="mt-1 text-ink/80">{p.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="cost" className="scroll-mt-32">
            <h2 className="mb-2 text-3xl font-bold">What affects the cost</h2>
            <p className="mb-4 text-muted">Electricians set their own prices. These are the factors that move a quote up or down, so you can compare like for like.</p>
            <ul className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">
              {s.costFactors.map((c) => <li key={c} className="flex gap-3 p-4"><Icon name="check" className="h-5 w-5 shrink-0 text-current" />{c}</li>)}
            </ul>
          </section>

          <section id="diy" className="scroll-mt-32">
            <h2 className="mb-4 text-3xl font-bold">What you can do safely, and when to stop</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-current-tint p-5"><p className="mb-2 font-display text-lg font-bold text-current">Safe to do</p><ul className="space-y-2">{s.diy.safe.map((x) => <li key={x}>✓ {x}</li>)}</ul></div>
              <div className="rounded-xl bg-alert-tint p-5"><p className="mb-2 font-display text-lg font-bold text-alert">Stop and call</p><ul className="space-y-2">{s.diy.stop.map((x) => <li key={x}>✕ {x}</li>)}</ul></div>
            </div>
          </section>

          {extra?.terms.length ? (
            <section id="terms" className="scroll-mt-32">
              <h2 className="mb-4 text-3xl font-bold">Key terms</h2>
              <dl className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">
                {extra.terms.map((t) => (
                  <div key={t.term} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4"><dt className="font-display font-bold">{t.term}</dt><dd className="text-ink/80">{t.def}</dd></div>
                ))}
              </dl>
            </section>
          ) : null}

          <section id="faq" className="scroll-mt-32">
            <h2 className="mb-4 text-3xl font-bold">{s.name} FAQ</h2>
            <FaqList faqs={faqs} />
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">Where electricians offer this</h2>
            {local.length > 0 && (
              <>
                <p className="mb-3 text-muted">Local guides to {s.name.toLowerCase()}, with permit offices, housing and utility notes for each city:</p>
                <ul className="mb-6 grid gap-2 sm:grid-cols-2">
                  {local.map((p) => <li key={p.state.code + p.city.slug}><Link href={routes.cityService(p.state.slug, p.city.slug, s.slug)} className="card block p-4 font-semibold hover:ring-ink">{s.name} in {p.city.name}, {p.state.code} →</Link></li>)}
                </ul>
              </>
            )}
            <p className="mb-4 text-muted">Available through our network in 47 states and DC. Metro guides:</p>
            <div className="flex flex-wrap gap-2">
              {cityPages().map((p) => <Link key={p.state.code + p.city.slug} href={routes.city(p.state.slug, p.city.slug)} className="chip">{p.city.name}, {p.state.code}</Link>)}
              <Link href={routes.locations} className="chip font-semibold">All locations →</Link>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
          <LeadFormBlock defaultService={s.slug} />
          <div className="rounded-xl bg-ink p-5 text-white">
            <p className="font-display text-lg font-bold">Prefer to talk?</p>
            <p className="mb-3 text-sm text-white/75">{availability}</p>
            <PhoneLink className="btn btn-primary w-full" label={`Call ${site.phone}`} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-x">
            <h2 className="mb-6 text-3xl font-bold">Related services</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ServiceCard key={r.slug} image={servicePhoto(r.slug, r.category)} href={routes.service(r.slug)} icon={r.icon} title={r.name} text={r.answer.split(". ")[0] + "."} />)}</div>
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="py-14">
          <div className="container-x">
            <h2 className="mb-6 text-3xl font-bold">Guides</h2>
            <ul className="grid gap-3 sm:grid-cols-2">{guides.map((g) => <li key={g.slug}><Link href={routes.guide(g.slug)} className="card block p-5 font-semibold hover:ring-ink">{g.title} →</Link></li>)}</ul>
          </div>
        </section>
      )}

      <CtaBand title={`Need help with ${s.name.toLowerCase()}?`} />
      <JsonLd data={pageGraph({ path, name: s.h1, description: s.metaDescription, type: "ItemPage", crumbs, faqs })} />
    </>
  );
}
