import { permanentRedirect } from "next/navigation";
import { cityPages } from "@/lib/sitemap";
import { routes } from "@/lib/routes";

/** Legacy nested city URL: permanently redirects to the flat page. */
export const dynamicParams = false;
export const generateStaticParams = () => cityPages().map((p) => ({ state: p.state.slug, city: p.city.slug }));

export default async function Page({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  permanentRedirect(routes.city(state, city));
}
