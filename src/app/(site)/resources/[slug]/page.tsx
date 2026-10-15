import Image from "next/image";
import { linkify, linkCtx } from "@/lib/linker";
import { citiesForService } from "@/lib/sitemap";
import { guidePhoto } from "@/content/photos";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PhoneLink } from "@/components/PhoneLink";
import { CtaBand } from "@/components/Hero";
import { articles, getArticle } from "@/content/articles";
import { getService } from "@/content/services";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph, ORG_ID } from "@/lib/schema";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug)!;
  return pageMeta({ title: a.title, description: a.metaDescription, path: routes.guide(a.slug) });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const path = routes.guide(a.slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Guides", path: routes.resources }, { name: a.title, path }];
  const main = getService(a.services[0])!;
  const lc = linkCtx(path, 6);
  // Rotate which cities each guide links to, so local pages share links across guides.
  const pool = a.services.flatMap((sl) => citiesForService(sl));
  const start = pool.length ? (articles.indexOf(a) * 7) % pool.length : 0;
  const localHelp = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 8);
  return (
    <>
      <div className="container-x grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <Breadcrumbs items={crumbs} light={false} />
          <p className="eyebrow mb-3 mt-8 text-current">{a.category}</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{a.title}</h1>
          <p className="mt-3 text-sm text-muted">Updated <time dateTime={a.updated}>{new Date(a.updated + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time></p>
          <div className="answer-box mt-8"><p className="mb-1 text-xs font-bold uppercase tracking-wider">Short answer</p>{a.answer}</div>
          <Image src={guidePhoto(a.slug, a.services).src} alt={guidePhoto(a.slug, a.services).alt} width={1600} height={1067} priority
            sizes="(min-width: 1024px) 760px, 100vw" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />
          <div className="mt-10 space-y-10">
            {a.sections.map((sec) => (
              <section key={sec.heading} className="prose-bl">
                <h2 className="mb-3 text-2xl font-bold">{sec.heading}</h2>
                <p>{linkify(sec.body, lc)}</p>
                {sec.list && <ul>{sec.list.map((l) => <li key={l}>{linkify(l, lc)}</li>)}</ul>}
              </section>
            ))}
            <section>
              <h2 className="mb-3 text-2xl font-bold">When to call an electrician</h2>
              <p className="prose-bl mb-4">If anything is warm, smells hot, sparks or keeps failing after the simple checks above, stop and call. The electrician will test the circuit, find the cause and make it safe. Related service: <Link href={routes.service(main.slug)} className="link">{main.name}</Link>.</p>
            </section>
            <section>
              <h2 className="mb-4 text-2xl font-bold">Questions</h2>
              <FaqList faqs={a.faqs} />
            </section>
            {localHelp.length > 0 && (
              <section>
                <h2 className="mb-3 text-2xl font-bold">Local help with {main.name.toLowerCase()}</h2>
                <p className="mb-3 text-muted">City guides with local permit offices, utilities and housing notes:</p>
                <div className="flex flex-wrap gap-2">{localHelp.map((p) => <Link key={p.state.code + p.city.slug + p.service.slug} href={routes.cityService(p.state.slug, p.city.slug, p.service.slug)} className="chip">{p.service.name} in {p.city.name}, {p.state.code}</Link>)}</div>
              </section>
            )}
            <p className="rounded-lg bg-paper-deep p-4 text-sm text-muted">Editorial note: this guide is general information for US homes, not a substitute for an on-site assessment by a licensed electrician. Codes and permit rules vary by location.</p>
          </div>
        </article>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl bg-ink p-6 text-white">
            <p className="font-display text-xl font-bold">Need {main.name.toLowerCase()}?</p>
            <p className="mb-4 mt-1 text-sm text-white/75">Connect with a licensed electrician who serves your ZIP code.</p>
            <PhoneLink className="btn btn-primary w-full whitespace-normal" label={`Call ${site.phone}`} />
            <Link href={`${routes.request}?service=${main.slug}`} className="btn btn-outline-light mt-2 w-full">Request service</Link>
          </div>
          <div className="card p-5">
            <p className="mb-2 font-display font-bold">Related services</p>
            <ul className="space-y-1.5 text-sm">{a.services.map((sl) => <li key={sl}><Link href={routes.service(sl)} className="link">{getService(sl)!.name}</Link></li>)}</ul>
            <p className="mb-2 mt-4 font-display font-bold">Related guides</p>
            <ul className="space-y-1.5 text-sm">{a.related.map((sl) => <li key={sl}><Link href={routes.guide(sl)} className="link">{getArticle(sl)!.title}</Link></li>)}</ul>
          </div>
        </aside>
      </div>
      <CtaBand />
      <JsonLd data={pageGraph({ path, name: a.title, description: a.metaDescription, crumbs, faqs: a.faqs, extra: [{ "@type": "Article", "@id": `${site.url}${path}#article`, headline: a.title, datePublished: a.published, dateModified: a.updated, publisher: { "@id": ORG_ID }, author: { "@id": ORG_ID }, mainEntityOfPage: { "@id": `${site.url}${path}#webpage` } }] })} />
    </>
  );
}
