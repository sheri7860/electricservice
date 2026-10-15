import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "./routes";

/**
 * Contextual internal links. Each topic has one owning page. The first mention of a topic in body
 * text becomes a link to its owner, at most once per target per page, never to the current page,
 * and capped per page so links stay useful rather than dense.
 */
const topics: [RegExp, string][] = [
  [/\b(burning(?:-plastic)? smells?|smell(?:s|ing)? (?:of )?burning(?: plastic)?)\b/i, routes.guide("burning-smell-from-outlet")],
  [/\b(breakers? (?:keeps? )?trip(?:ping|s)?|tripping breakers?|tripped breakers?)\b/i, routes.guide("breaker-keeps-tripping")],
  [/\b(dead outlets?|outlets? (?:that )?stopped working)\b/i, routes.guide("outlet-not-working")],
  [/\b(Federal Pacific|Zinsco|fuse (?:box(?:es)?|panels?))\b/i, routes.guide("signs-you-need-a-panel-upgrade")],
  [/\b(GFCI|AFCI)\b/, routes.service("gfci-afci-protection")],
  [/\b(knob-and-tube|cloth-insulated wiring|aluminum (?:branch )?wiring)\b/i, routes.service("home-rewiring")],
  [/\b((?:service|panel) upgrades?)\b/i, routes.service("panel-upgrade")],
  [/\b(EV chargers?|Level 2 chargers?)\b/i, routes.service("ev-charger-installation")],
  [/\b(standby generators?|generator inlets?|transfer switch(?:es)?)\b/i, routes.service("generator-installation")],
  [/\b(surge protect(?:ion|ors?|ive devices?)|whole-home surge)\b/i, routes.service("surge-protection")],
  [/\b(smoke (?:alarms?|detectors?)|carbon monoxide alarms?)\b/i, routes.service("smoke-detector-installation")],
  [/\b(dedicated circuits?)\b/i, routes.service("dedicated-circuits")],
  [/\b(ceiling fans?)\b/i, routes.service("ceiling-fan-installation")],
  [/\b(recessed lights?|recessed lighting|pendant lights?)\b/i, routes.service("lighting-installation")],
  [/\b(ungrounded (?:two-prong )?outlets?|two-prong outlets?)\b/i, routes.service("outlet-switch-repair")],
  [/\b((?:pre-purchase|electrical) inspections?)\b/i, routes.service("electrical-inspection")],
  [/\b(generator safety)\b/i, routes.guide("generator-safety")],
];

/** `map` lets a page swap a generic target for a more specific one, e.g. a city-specific service page. */
export type LinkCtx = { path: string; used: Set<string>; max: number; map?: (href: string) => string };
export const linkCtx = (path: string, max = 6, map?: (href: string) => string): LinkCtx => ({ path, used: new Set([path]), max, map });

/** Returns the text with the first eligible topic mention(s) turned into links. */
export function linkify(text: string, ctx: LinkCtx): ReactNode {
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;
  // Repeatedly find the earliest eligible match in the remaining text.
  for (;;) {
    if (ctx.used.size - 1 >= ctx.max) break;
    let best: { i: number; len: number; href: string } | null = null;
    for (const [re, generic] of topics) {
      const href = ctx.map?.(generic) ?? generic;
      if (ctx.used.has(href)) continue;
      const m = re.exec(rest);
      if (m && (best === null || m.index < best.i)) best = { i: m.index, len: m[0].length, href };
    }
    if (!best) break;
    ctx.used.add(best.href);
    out.push(rest.slice(0, best.i));
    out.push(<Link key={key++} href={best.href} className="link">{rest.slice(best.i, best.i + best.len)}</Link>);
    rest = rest.slice(best.i + best.len);
  }
  out.push(rest);
  return out.length === 1 ? text : <>{out}</>;
}
