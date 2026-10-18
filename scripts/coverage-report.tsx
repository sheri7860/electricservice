/**
 * Coverage report: every service x location combination with its status and reason.
 *   npm run coverage
 * Writes reports/coverage.csv and prints a summary of potential vs published vs needs-content vs not-eligible.
 */
import fs from "node:fs";
import path from "node:path";
import { coverageMatrix } from "@/lib/coverage";
import { stateInfo } from "@/content/locations";
import { routes } from "@/lib/routes";
import { flatRegistry } from "@/lib/registry";

const rows = coverageMatrix();
const slugByCode = new Map(stateInfo.map((s) => [s.code, s.slug]));
const url = (r: (typeof rows)[number]) => {
  const st = slugByCode.get(r.state)!;
  return r.city ? routes.cityService(st, r.city, r.service) : routes.stateService(st, r.service);
};

// Every published row must exist in the route registry, and every registry location page must be a published row.
const registry = flatRegistry();
const published = new Set(rows.filter((r) => r.status === "published").map(url));
const problems: string[] = [];
for (const u of published) if (!registry.has(u.replace(/^\/|\/$/g, ""))) problems.push(`published but not routed: ${u}`);
for (const [slug, e] of registry) if (["cityService", "stateService", "subCity", "subState"].includes(e.kind) && !published.has(`/${slug}/`)) problems.push(`routed but not in matrix: /${slug}/`);

const csv = ["type,service,parent,state,city,url,status,reason", ...rows.map((r) => [r.type, r.service, r.parent, r.state, r.city, url(r), r.status, `"${r.reason.replace(/"/g, "'")}"`].join(","))].join("\n");
fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync(path.join("reports", "coverage.csv"), csv + "\n");

const types = [...new Set(rows.map((r) => r.type))];
console.log("type".padEnd(18), "potential", "published", "needs content", "not eligible");
for (const t of types) {
  const xs = rows.filter((r) => r.type === t);
  const n = (s: string) => xs.filter((r) => r.status === s).length;
  console.log(t.padEnd(18), String(xs.length).padStart(9), String(n("published")).padStart(9), String(n("needs content")).padStart(13), String(n("not eligible")).padStart(12));
}
console.log(`\nWrote reports/coverage.csv (${rows.length} rows).`);
if (problems.length) { console.log(`\n${problems.length} problem(s):\n` + problems.join("\n")); process.exit(1); }
console.log("Registry and matrix agree: every published combination is routed, and nothing extra is routed.");
