import { cityServiceGate, wordCount } from "@/lib/quality";
import { cityServices } from "@/content/cityServices";
import { subCityPages, subCityGate } from "@/lib/coverage";
import { cityPages } from "@/lib/sitemap";
import { subCityNotes } from "@/content/subCityNotes";
import { getSubservice } from "@/content/subservices";
(async () => {
  const mod = await import("../src/content/" + process.argv[2] + ".ts");
  const w = Object.values(mod).find((v) => typeof v === "object") as Record<string, Record<string, string>>;
  let bad = 0, n = 0;
  for (const [k, m] of Object.entries(w)) for (const s of Object.keys(m)) { n++; const r = cityServiceGate(k, s); if (!r.ok) { bad++; console.log(k, "|", s, "|", wordCount(cityServices[k][s]), "|", r.reasons.join("; ")); } }
  for (const k of Object.keys(w)) { const p = cityPages().find(p => p.state.code + "/" + p.city.slug === k)!; for (const s of Object.keys(subCityNotes[k] ?? {})) { const r = subCityGate(p, getSubservice(s)!); if (r) console.log("SUBBROKEN", k, s, r); } }
  console.log("notes", n, "failures", bad, "subCity", subCityPages().length);
})();
