import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { flatRegistry, type FlatEntry } from "@/lib/registry";
import ServiceView, { generateMetadata as serviceMeta } from "@/views/ServiceView";
import StateView, { generateMetadata as stateMeta } from "@/views/StateView";
import CityView, { generateMetadata as cityMeta } from "@/views/CityView";
import CityServiceView, { generateMetadata as cityServiceMeta } from "@/views/CityServiceView";

/** Single route for every flat URL (services, states, cities, service + city, ...). Unknown slugs are a real 404. */
export const dynamicParams = false;
export const generateStaticParams = () => [...flatRegistry().keys()].map((slug) => ({ slug }));

type P = { params: Promise<{ slug: string }> };
const entry = async (params: P["params"]) => flatRegistry().get((await params).slug);

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const e = await entry(params);
  if (!e) return {};
  return meta(e);
}

export default async function Page({ params }: P) {
  const e = await entry(params);
  if (!e) notFound();
  return view(e);
}

function meta(e: FlatEntry): Promise<Metadata> {
  switch (e.kind) {
    case "service": return serviceMeta({ params: Promise.resolve(e.params) });
    case "state": return stateMeta({ params: Promise.resolve(e.params) });
    case "city": return cityMeta({ params: Promise.resolve(e.params) });
    case "cityService": return cityServiceMeta({ params: Promise.resolve(e.params) });
  }
}

function view(e: FlatEntry) {
  switch (e.kind) {
    case "service": return <ServiceView params={Promise.resolve(e.params)} />;
    case "state": return <StateView params={Promise.resolve(e.params)} />;
    case "city": return <CityView params={Promise.resolve(e.params)} />;
    case "cityService": return <CityServiceView params={Promise.resolve(e.params)} />;
  }
}
