import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { flatRegistry, type FlatEntry } from "@/lib/registry";
import ServiceView, { generateMetadata as serviceMeta } from "@/views/ServiceView";
import SubserviceView, { generateMetadata as subserviceMeta } from "@/views/SubserviceView";
import StateView, { generateMetadata as stateMeta } from "@/views/StateView";
import CityView, { generateMetadata as cityMeta } from "@/views/CityView";
import StateServiceView, { generateMetadata as stateServiceMeta } from "@/views/StateServiceView";
import SubCityView, { generateMetadata as subCityMeta } from "@/views/SubCityView";
import SubStateView, { generateMetadata as subStateMeta } from "@/views/SubStateView";
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
    case "subservice": return subserviceMeta({ params: Promise.resolve(e.params) });
    case "state": return stateMeta({ params: Promise.resolve(e.params) });
    case "city": return cityMeta({ params: Promise.resolve(e.params) });
    case "cityService": return cityServiceMeta({ params: Promise.resolve(e.params) });
    case "stateService": return stateServiceMeta({ params: Promise.resolve(e.params) });
    case "subCity": return subCityMeta({ params: Promise.resolve(e.params) });
    case "subState": return subStateMeta({ params: Promise.resolve(e.params) });
  }
}

function view(e: FlatEntry) {
  switch (e.kind) {
    case "service": return <ServiceView params={Promise.resolve(e.params)} />;
    case "subservice": return <SubserviceView params={Promise.resolve(e.params)} />;
    case "state": return <StateView params={Promise.resolve(e.params)} />;
    case "city": return <CityView params={Promise.resolve(e.params)} />;
    case "cityService": return <CityServiceView params={Promise.resolve(e.params)} />;
    case "stateService": return <StateServiceView params={Promise.resolve(e.params)} />;
    case "subCity": return <SubCityView params={Promise.resolve(e.params)} />;
    case "subState": return <SubStateView params={Promise.resolve(e.params)} />;
  }
}
