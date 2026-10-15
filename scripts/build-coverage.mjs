// Pulls the live LeadSmart coverage feed and keeps only the Electrical niche.
// Output: src/data/coverage.json (states → cities) and public/data/zips.json (ZIP → city index).
// Run: npm run data:coverage   (re-run whenever LeadSmart coverage changes)
import fs from "node:fs";

const BASE = "https://leadsmart-coverage.netlify.app/";
const NICHE = "Electrical";

const html = await (await fetch(BASE)).text();
const ver = (await (await fetch(BASE + html.match(/src="(data\.js\?v=[^"]+)"/)[1])).text()).match(/DB_VERSION = '([^']+)'/)[1];
const get = async (p) => (await fetch(`${BASE}api/${p}?v=${ver}`)).json();
const meta = await get("meta.json");
const states = await get("states.json");

const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = { source: "LeadSmart coverage feed", niche: NICHE, dataDate: meta.data_date, states: {} };
const zipIndex = {};

for (const { state_id: st } of states) {
  const sh = await get(`state/${st}.json`);
  const ni = sh.niche.indexOf(NICHE);
  if (ni < 0) continue;
  const cities = new Map();
  for (const r of sh.rows) {
    if (r[2] !== ni || r[0] < 0) continue;
    const name = sh.city[r[0]];
    const c = cities.get(name) ?? { name, county: r[9] < 0 ? null : sh.county[r[9]], zips: new Set(), pop: 0 };
    const zip = String(r[1]).padStart(5, "0");
    if (!c.zips.has(zip)) { c.zips.add(zip); c.pop += r[5] || 0; }
    cities.set(name, c);
  }
  if (!cities.size) continue;
  const list = [...cities.values()].sort((a, b) => b.pop - a.pop).map((c) => {
    const slug = slugify(c.name);
    for (const z of c.zips) zipIndex[z] = [c.name, st];
    return { name: c.name, slug, county: c.county, zips: [...c.zips].sort(), population: c.pop };
  });
  out.states[st] = list;
  console.log(st, list.length);
}

fs.writeFileSync("src/data/coverage.json", JSON.stringify(out));
fs.writeFileSync("public/data/zips.json", JSON.stringify(zipIndex));
console.log("states:", Object.keys(out.states).length, "zips:", Object.keys(zipIndex).length);
