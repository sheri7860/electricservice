import { permanentRedirect } from "next/navigation";
import { cityServicePages } from "@/lib/sitemap";
import { routes } from "@/lib/routes";

/** Legacy nested service + city URL: permanently redirects to the flat page. */
export const dynamicParams = false;
export const generateStaticParams = () => cityServicePages().map((p) => ({ state: p.state.slug, city: p.city.slug, service: p.service.slug }));

export default async function Page({ params }: { params: Promise<{ state: string; city: string; service: string }> }) {
  const { state, city, service } = await params;
  permanentRedirect(routes.cityService(state, city, service));
}
