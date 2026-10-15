import { ServiceTemplate } from "@/components/ServiceTemplate";
import { getService } from "@/content/services";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

const s = getService("emergency-electrician")!;
export const metadata = pageMeta({ title: s.seoTitle, description: s.metaDescription, path: routes.emergency });

export default function Page() {
  return <ServiceTemplate s={s} path={routes.emergency} crumbs={[{ name: "Home", path: "/" }, { name: "Emergency electrician", path: routes.emergency }]} />;
}
