import Image from "next/image";
import { guidePhoto } from "@/content/photos";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { articles } from "@/content/articles";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";

const desc = "Plain-English electrical guides: tripping breakers, dead outlets, burning smells, panel upgrades, EV chargers, generators and safety devices.";
export const metadata = pageMeta({ title: "Home Electrical Guides", description: desc, path: routes.resources });
const crumbs = [{ name: "Home", path: "/" }, { name: "Guides", path: routes.resources }];

export default function Page() {
  const cats = [...new Set(articles.map((a) => a.category))];
  return (
    <>
      <Hero crumbs={crumbs} eyebrow="Guides" title="Home electrical guides" lead={<p>Short, direct answers to the problems homeowners search for most: what is happening, what you can safely check, and when to call an electrician.</p>} />
      <div className="container-x space-y-12 py-14">
        {cats.map((c) => (
          <section key={c}>
            <h2 className="mb-4 text-2xl font-bold">{c}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.filter((a) => a.category === c).map((a) => (
                <Link key={a.slug} href={routes.guide(a.slug)} className="card group flex flex-col overflow-hidden hover:ring-ink">
                  <span className="relative block aspect-[16/9] overflow-hidden">
                    <Image src={guidePhoto(a.slug, a.services).src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </span>
                  <span className="p-6">
                    <h3 className="text-lg font-bold group-hover:underline">{a.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted">{a.answer}</p>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      <JsonLd data={pageGraph({ path: routes.resources, name: "Home electrical guides", description: desc, type: "CollectionPage", crumbs })} />
    </>
  );
}
