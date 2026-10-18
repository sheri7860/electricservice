import { permanentRedirect } from "next/navigation";
import { publishedServices } from "@/content/services";
import { routes } from "@/lib/routes";

/** Legacy nested service URL: permanently redirects to the flat page. */
export const dynamicParams = false;
export const generateStaticParams = () => publishedServices.filter((s) => s.slug !== "emergency-electrician").map((s) => ({ slug: s.slug }));

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  permanentRedirect(routes.service((await params).slug));
}
