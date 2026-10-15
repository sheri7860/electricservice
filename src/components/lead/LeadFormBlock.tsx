import { publishedServices } from "@/content/services";
import { LeadForm } from "./LeadForm";

export function LeadFormBlock({ defaultService, id }: { defaultService?: string; id?: string }) {
  return <LeadForm services={publishedServices.map((s) => ({ slug: s.slug, name: s.name }))} defaultService={defaultService} id={id} />;
}
