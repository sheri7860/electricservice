import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { pageGraph } from "@/lib/schema";

export function LegalPage({ title, path, sections }: { title: string; path: string; sections: [string, string][] }) {
  const crumbs = [{ name: "Home", path: "/" }, { name: title, path }];
  return (
    <div className="container-x max-w-3xl py-12">
      <Breadcrumbs items={crumbs} light={false} />
      <h1 className="mb-8 mt-6 text-4xl font-bold">{title}</h1>
      <div className="prose-bl space-y-6">
        {sections.map(([h, t]) => <section key={h}><h2 className="mb-2 text-xl font-bold">{h}</h2><p>{t}</p></section>)}
      </div>
      <p className="mt-10 text-sm text-muted">Last updated October 13, 2026</p>
      <JsonLd data={pageGraph({ path, name: title, description: title, crumbs })} />
    </div>
  );
}
