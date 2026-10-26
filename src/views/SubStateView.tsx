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
import { routes } from "@/lib/routes";
import { pageMeta, ctaTitle, ctaDescription } from "@/lib/seo";
import { sentences } from "@/lib/text";
import { pageGraph, ORG_ID } from "@/lib/schema";
import { subStatePages, statePagesOfSub, stateServicePages, subStatesFor } from "@/lib/coverage";

type P = { params: Promise<{ state: string; sub: string }> };
const find = (st: string, sb: string) => subStatePages().find((p) => p.state.slug === st && p.sub.slug === sb);

export async function generateMetadata({ params }: P) {
  const { state, sub } = await params;
  const p = find(state, sub)!;
  const names = p.cities.map((c) => c.city.name);
  const list = names.length > 2 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names.join(" and ");
  return pageMeta({
    title: ctaTitle(`${p.sub.name} in ${p.state.name}`),
    description: ctaDescription(p.sub.name, p.state.name, `Local notes for ${list}.`),
    path: routes.stateService(p.state.slug, p.sub.slug),
  });
}

export default async function Page({ params }: P) {
  const { state, sub: subSlug } = await params;
  const p = find(state, subSlug);
  if (!p) notFound();
  const { state: s, sub, cities } = p;
  const parent = getService(sub.parent)!;
  const path = routes.stateService(s.slug, sub.slug);
  const parentState = stateServicePages().find((x) => x.state.code === s.code && x.service.slug === parent.slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: routes.locations }, { name: s.name, path: routes.state(s.slug) }, ...(parentState ? [{ name: parent.name, path: routes.stateService(s.slug, parent.slug) }] : []), { name: sub.name, path }];
  const otherStates = statePagesOfSub(sub.slug).filter((x) => x.state.code !== s.code);
  const siblings = subStatesFor(s.code).filter((x) => x.sub.slug !== sub.slug);
  const faqs = [
    { q: `Where in ${s.name} is ${sub.name.toLowerCase()} common?`, a: `Our local notes cover ${cities.map((c) => c.city.name).join(", ")}. ${sentences(cities[0].note)[0]}` },
    { q: `Who issues permits for ${sub.name.toLowerCase()} in ${s.name}?`, a: `The city or county building department where the home is. ${cities.slice(0, 3).map((c) => `${c.city.name}: ${sentences(c.local.permits)[0]}`).join(" ")}` },
    ...sub.faqs.slice(0, 3),
  ];
  return (
    <>
      <Hero photo={servicePhoto(sub.slug, sub.category)} crumbs={crumbs} eyebrow={`${sub.name} · ${s.name}`} title={`${sub.name} in ${s.name}`} requestHref={`${routes.request}?service=${parent.slug}`}
        lead={<p>{sub.answer}</p>}
        facts={[availability, "Independent, licensed electricians", `Local notes for ${cities.length} ${s.name} cities`]} />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="mb-4 text-3xl font-bold">{sub.name} across {s.name}</h2>
            <div className="space-y-4">
              {cities.map((c) => (
                <article key={c.city.slug} className="card-top p-5">
                  <h3 className="text-xl font-bold"><Link href={routes.cityService(s.slug, c.city.slug, sub.slug)} className="hover:underline">{sub.name} in {c.city.name}, {s.code}</Link></h3>
                  <p className="mt-2 text-ink/80">{sentences(c.note).slice(0, 2).join(" ")}</p>
                  <p className="mt-2 text-sm text-muted">{c.local.housing}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">What {sub.name.toLowerCase()} involves</h2>
            <div className="prose-bl text-lg">{sub.intro.map((x) => <p key={x.slice(0, 20)}>{x}</p>)}</div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Signs to look for</h2>
            <ul className="grid gap-3 sm:grid-cols-2">{sub.signs.map((x) => <li key={x} className="flex gap-3 rounded-lg bg-white p-4 ring-1 ring-line"><Icon name="bolt" className="h-5 w-5 shrink-0 text-volt-dark" />{x}</li>)}</ul>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold">What moves the price</h2>
            <ul className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">{sub.costFactors.map((x) => <li key={x} className="flex gap-3 p-4"><Icon name="check" className="h-5 w-5 shrink-0 text-current" />{x}</li>)}</ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{sub.name} in {s.name}: questions</h2>
            <FaqList faqs={faqs} />
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Related help in {s.name}</h2>
            <div className="flex flex-wrap gap-2">
              {parentState && <Link href={routes.stateService(s.slug, parent.slug)} className="chip">{parent.name} in {s.name}</Link>}
              {siblings.map((x) => <Link key={x.sub.slug} href={routes.stateService(s.slug, x.sub.slug)} className="chip">{x.sub.name} in {s.name}</Link>)}
              {otherStates.map((x) => <Link key={x.state.code} href={routes.stateService(x.state.slug, sub.slug)} className="chip">{sub.name} in {x.state.name}</Link>)}
              <Link href={routes.subservice(sub.slug)} className="chip font-semibold">About {sub.name.toLowerCase()} →</Link>
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><LeadFormBlock defaultService={parent.slug} /></aside>
      </div>
      <CtaBand title={`Need ${sub.name.toLowerCase()} in ${s.name}?`} />
      <JsonLd data={pageGraph({
        path, name: `${sub.name} in ${s.name}`, description: sub.answer, crumbs, faqs,
        extra: [{ "@type": "Service", "@id": `${site.url}${path}#service`, name: `${sub.name} in ${s.name}`, serviceType: sub.name, areaServed: { "@type": "State", name: s.name }, broker: { "@id": ORG_ID } }],
      })} />
    </>
  );
}
