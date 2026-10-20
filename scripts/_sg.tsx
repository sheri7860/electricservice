import { subCityGate, subCityPages, subStatePages } from "@/lib/coverage";
import { cityPages } from "@/lib/sitemap";
import { getSubservice } from "@/content/subservices";
import { wordCount } from "@/lib/quality";
(async () => {
  const mod = await import("../src/content/" + process.argv[2] + ".ts");
  const w = Object.values(mod).find((v) => typeof v === "object") as Record<string, Record<string, string>>;
  let bad = 0, n = 0;
  for (const [k, m] of Object.entries(w)) { const p = cityPages().find(p => p.state.code + "/" + p.city.slug === k); if (!p) { console.log("NOCITY", k); continue; } for (const [s, note] of Object.entries(m)) { n++; const r = subCityGate(p, getSubservice(s)!); if (r) { bad++; console.log(k, "|", s, "|", wordCount(note), "|", r); } } }
  console.log("notes", n, "failures", bad, "subCity", subCityPages().length, "subState", subStatePages().length);
})();
