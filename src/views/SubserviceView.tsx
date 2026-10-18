import { notFound } from "next/navigation";
import { ServiceTemplate } from "@/components/ServiceTemplate";
import { getService } from "@/content/services";
import { getSubservice } from "@/content/subservices";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = getSubservice((await params).slug)!;
  return pageMeta({ title: s.seoTitle, description: s.metaDescription, path: routes.subservice(s.slug) });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = getSubservice((await params).slug);
  if (!s) notFound();
  const parent = getService(s.parent)!;
  const path = routes.subservice(s.slug);
  return (
    <ServiceTemplate s={s} path={path} crumbs={[
      { name: "Home", path: "/" },
      { name: "Electrical services", path: routes.services },
      { name: parent.name, path: routes.service(parent.slug) },
      { name: s.name, path },
    ]} />
  );
}
