import { notFound } from "next/navigation";
import { STATE_COUNT } from "@/content/locations";
import { Logo } from "@/components/Logo";
import { PhoneLink } from "@/components/PhoneLink";
import { FaqList } from "@/components/FaqList";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { Icon } from "@/components/icons";
import { landingPages, getLanding } from "@/content/landingPages";
import { getService } from "@/content/services";
import { DISCLOSURE, availability, site, telHref } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => landingPages.map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const l = getLanding((await params).slug)!;
  const s = getService(l.service)!;
  return pageMeta({ title: l.h1, description: s.metaDescription, path: routes.lp(l.slug), canonical: routes.service(s.slug), noindex: true });
}

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ kw?: string }> }) {
  const l = getLanding((await params).slug);
  if (!l) notFound();
  const kw = (await searchParams).kw;
  const h1 = (kw && Object.hasOwn(l.kw, kw) ? l.kw[kw] : l.h1); // whitelist only, never reflect raw text
  const s = getService(l.service)!;
  const phone = site.ppcPhone || site.phone;
  return (
    <>
      <header className="border-b border-white/10 bg-ink">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Logo />
          <PhoneLink ppc className="btn btn-primary px-4 text-sm" label={`Call ${phone}`} emergency={l.service === "emergency-electrician"} />
        </div>
      </header>
      <main id="main">
        <section className="bg-ink text-white">
          <div className="container-x grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold sm:text-5xl">{h1}</h1>
              <p className="mt-4 text-lg text-white/85">{s.answer}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">{l.bullets.map((b) => <li key={b} className="flex gap-2"><Icon name="check" className="h-5 w-5 shrink-0 text-volt" />{b}</li>)}</ul>
              <p className="mt-6 text-sm text-white/70">{availability} · Independent, licensed electricians in {STATE_COUNT} states + DC</p>
              <div className="mt-6"><PhoneLink ppc className="btn btn-primary" label={`Call ${phone}`} /></div>
            </div>
            <div className="text-ink"><LeadFormBlock defaultService={s.slug} /></div>
          </div>
        </section>
        <section className="container-x grid gap-10 py-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold">What to expect</h2>
            <ol className="space-y-3">{s.process.map((p, i) => <li key={p.title} className="card p-4"><b>{i + 1}. {p.title}.</b> {p.text}</li>)}</ol>
            <h2 className="mb-3 mt-8 text-2xl font-bold">Signs to watch for</h2>
            <ul className="list-disc space-y-1 pl-5">{s.signs.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div><h2 className="mb-4 text-2xl font-bold">Questions</h2><FaqList faqs={s.faqs} /></div>
        </section>
      </main>
      <footer className="bg-ink pb-24 text-xs text-white/60 lg:pb-0"><div className="container-x py-6"><p>{DISCLOSURE}</p><p className="mt-2">© {new Date().getFullYear()} {site.name}</p></div></footer>
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-line bg-white/95 p-2.5 lg:hidden">
        <a href={telHref(site.ppcPhone ? "+1" + site.ppcPhone.replace(/\D/g, "").slice(-10) : site.phoneE164)} className="btn btn-primary" data-event="call_click">Call now</a>
        <a href="#lead-form" className="btn btn-secondary">Request</a>
      </div>
    </>
  );
}
