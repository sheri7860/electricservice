import { categories, servicesIn } from "@/content/services";
import { coveredStates, regions, statesInRegion } from "@/content/locations";
import { routes } from "@/lib/routes";

export const serviceGroups = categories.map((c) => ({ name: c.name, items: servicesIn(c.slug).map((s) => ({ name: s.name, href: routes.service(s.slug) })) }));
export const stateGroups = regions
  .map((r) => ({ name: r.name, items: statesInRegion(r.slug).map((s) => ({ name: s.name, href: routes.state(s.slug) })) }))
  .filter((g) => g.items.length);
export const stateCount = coveredStates.length;
