import { notFound } from "next/navigation";
import { ServiceTemplate } from "@/components/ServiceTemplate";
import { getService, publishedServices } from "@/content/services";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => publishedServices.filter((s) => s.slug !== "emergency-electrician").map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug)!;
  return pageMeta({ title: s.seoTitle, description: s.metaDescription, path: routes.service(s.slug) });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const path = routes.service(s.slug);
  return <ServiceTemplate s={s} path={path} crumbs={[{ name: "Home", path: "/" }, { name: "Electrical services", path: routes.services }, { name: s.name, path }]} />;
}
