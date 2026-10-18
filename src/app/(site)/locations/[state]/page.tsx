import { permanentRedirect } from "next/navigation";
import { coveredStates } from "@/content/locations";
import { routes } from "@/lib/routes";

/** Legacy nested state URL: permanently redirects to the flat page. */
export const dynamicParams = false;
export const generateStaticParams = () => coveredStates.map((s) => ({ state: s.slug }));

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  permanentRedirect(routes.state((await params).state));
}
