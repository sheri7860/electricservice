#!/usr/bin/env node
/**
 * Validation crawl. Start the production server first (`npm run build && npm start`), then:
 *   node scripts/seo-crawl.mjs [http://localhost:3000]
 * Crawls every sitemap URL plus every internal link it finds and reports status codes,
 * canonicals, robots, titles/H1s/descriptions (missing or duplicated), heading order,
 * JSON-LD validity, image alt text, orphans, click depth and near-duplicate body text.
 * Exits non-zero when an indexable page fails.
 */
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://brightlaneelectric.com").replace(/\/$/, "");

const fetchRetry = async (u, n = 4) => { for (let i = 0; ; i++) { try { return await fetch(u, { redirect: "manual" }); } catch (e) { if (i >= n) throw e; await new Promise((r) => setTimeout(r, 500 * (i + 1))); } } };
const get = async (u) => { const r = await fetchRetry(u); return { status: r.status, text: r.status === 200 ? await r.text() : "", loc: r.headers.get("location"), robots: r.headers.get("x-robots-tag") }; };
const m1 = (re, s) => (s.match(re) || [])[1];
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) => s?.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const smIndex = await get(`${BASE}/sitemap.xml`);
const maps = [...smIndex.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1].replace(SITE, BASE));
const sitemap = new Set();
for (const m of maps) for (const x of (await get(m)).text.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemap.add(x[1].replace(SITE, ""));

const pages = new Map();
const inbound = new Map();
const depth = new Map([["/", 0]]);
const queue = ["/", ...sitemap];
const seen = new Set();
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const r = await get(BASE + path);
  const h = r.text;
  const links = [...h.matchAll(/<a[^>]+href="(\/[^"#?]*)/g)].map((x) => x[1]).filter((x) => !x.startsWith("/_next") && !/\.(xml|txt|svg|png|jpg|webp)$/.test(x));
  const main = m1(/<main[^>]*>([\s\S]*)<\/main>/, h) ?? h;
  const p = {
    path, status: r.status, loc: r.loc,
    title: decode(m1(/<title>([^<]*)<\/title>/, h)),
    desc: decode(m1(/<meta name="description" content="([^"]*)"/, h)),
    canonical: m1(/<link rel="canonical" href="([^"]*)"/, h),
    noindex: /<meta name="robots" content="[^"]*noindex/.test(h) || /noindex/.test(r.robots || ""),
    h1s: [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((x) => strip(x[1])),
    levels: [...main.matchAll(/<h([1-6])[\s>]/g)].map((x) => +x[1]),
    jsonld: [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((x) => x[1]),
    imgsNoAlt: [...h.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)].length,
    hasCrumbs: /BreadcrumbList/.test(h),
    lang: m1(/<html[^>]*\blang="([^"]+)"/, h),
    ogTitle: /<meta property="og:title"/.test(h),
    ogImage: m1(/<meta property="og:image" content="([^"]*)"/, h),
    twitter: m1(/<meta name="twitter:card" content="([^"]*)"/, h),
    imgsEmptySrc: [...h.matchAll(/<img[^>]*\bsrc=""/g)].length,
    text: strip(main),
    rawMain: main.replace(/<[^>]+>/g, " "),
    links: [...new Set(links)],
  };
  pages.set(path, p);
  for (const l of p.links) {
    if (!inbound.has(l)) inbound.set(l, new Set());
    if (l !== path) inbound.get(l).add(path);
    if (!depth.has(l) && depth.has(path)) depth.set(l, depth.get(path) + 1);
    if (!seen.has(l)) queue.push(l);
  }
}

const issues = [];
const flag = (path, msg) => issues.push(`${path}  ${msg}`);
const indexable = [...pages.values()].filter((p) => p.status === 200 && !p.noindex);
const dupes = (key) => { const m = new Map(); for (const p of indexable) { const k = key(p); if (!k) continue; m.set(k, [...(m.get(k) || []), p.path]); } return [...m].filter(([, v]) => v.length > 1); };

for (const p of pages.values()) {
  if (p.status >= 400) flag(p.path, `HTTP ${p.status} (linked from ${[...(inbound.get(p.path) || [])].slice(0, 3).join(", ")})`);
  if (p.status >= 300 && p.status < 400) flag(p.path, `redirect ${p.status} -> ${p.loc} (internal links should point at the final URL)`);
}
for (const p of indexable) {
  if (!p.title) flag(p.path, "missing <title>");
  else if (p.title.length > 65) flag(p.path, `title ${p.title.length} chars`);
  if (!p.desc || p.desc.length < 70) flag(p.path, "missing/short meta description");
  if (p.canonical !== SITE + p.path) flag(p.path, `canonical ${p.canonical}`);
  if (p.h1s.length !== 1) flag(p.path, `${p.h1s.length} H1s`);
  for (let i = 1; i < p.levels.length; i++) if (p.levels[i] > p.levels[i - 1] + 1) { flag(p.path, `heading jump h${p.levels[i - 1]} -> h${p.levels[i]}`); break; }
  for (const j of p.jsonld) try { JSON.parse(j); } catch { flag(p.path, "invalid JSON-LD"); }
  if (p.path !== "/" && !p.hasCrumbs) flag(p.path, "no BreadcrumbList");
  if (p.imgsNoAlt) flag(p.path, `${p.imgsNoAlt} <img> without alt`);
  if (p.path !== "/" && !(inbound.get(p.path)?.size)) flag(p.path, "orphan: no internal links point here");
  if ((depth.get(p.path) ?? 99) > 3) flag(p.path, `click depth ${depth.get(p.path)}`);
  if (!sitemap.has(p.path) && !["/request-service/"].includes(p.path)) flag(p.path, "indexable but not in sitemap");
}
for (const u of sitemap) { const p = pages.get(u); if (!p || p.status !== 200 || p.noindex) flag(u, "in sitemap but not a 200 indexable page"); }
for (const [k, v] of dupes((p) => p.title)) flag(v.join(", "), `duplicate title "${k}"`);
for (const [k, v] of dupes((p) => p.desc)) flag(v.join(", "), `duplicate description "${k.slice(0, 50)}…"`);
for (const [k, v] of dupes((p) => p.h1s[0])) flag(v.join(", "), `duplicate H1 "${k}"`);

// Metadata details, social tags and structured data.
for (const p of indexable) {
  if (p.desc && p.desc.length > 160) flag(p.path, `description ${p.desc.length} chars (over 160 may be truncated)`);
  if (p.title && p.title.length < 15) flag(p.path, `title only ${p.title.length} chars`);
  if (!/^en(-US)?$/.test(p.lang || "")) flag(p.path, `html lang="${p.lang}"`);
  if (!p.ogTitle || !p.ogImage) flag(p.path, "missing og:title or og:image");
  if (p.twitter !== "summary_large_image") flag(p.path, `twitter:card ${p.twitter}`);
  if (p.imgsEmptySrc) flag(p.path, `${p.imgsEmptySrc} <img> with empty src`);
  const ids = new Set();
  for (const j of p.jsonld) {
    let data; try { data = JSON.parse(j); } catch { continue; }
    for (const n of data["@graph"] ?? [data]) {
      if (!n["@type"]) flag(p.path, "JSON-LD node without @type");
      if (n["@id"]) { if (ids.has(n["@id"])) flag(p.path, `duplicate JSON-LD @id ${n["@id"]}`); ids.add(n["@id"]); }
      if (n["@type"] === "BreadcrumbList") {
        const items = n.itemListElement ?? [];
        if (!items.length || items.at(-1).item !== SITE + p.path) flag(p.path, "breadcrumb does not end at this page");
        if (items.some((x, i) => x.position !== i + 1 || !x.name)) flag(p.path, "breadcrumb positions or names invalid");
      }
      if (n["@type"] === "FAQPage") {
        const qs = n.mainEntity ?? [];
        if (!qs.length || qs.some((q) => !q.name || !q.acceptedAnswer?.text)) flag(p.path, "FAQPage with empty question or answer");
        const norm = (t) => t.replace(/&#x27;|&#39;|&quot;|&amp;/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const pageText = norm(p.rawMain);
        for (const q of qs) if (!pageText.includes(norm(q.name).slice(0, 40))) { flag(p.path, `FAQ question not visible on page: "${q.name.slice(0, 50)}"`); break; }
      }
      if (["WebPage", "ItemPage", "CollectionPage"].includes(n["@type"]) && n.url !== SITE + p.path) flag(p.path, `schema WebPage url ${n.url}`);
    }
  }
}

// robots.txt, noindex pages, 404 handling and URL variants.
{
  const robots = (await get(`${BASE}/robots.txt`)).text;
  if (!new RegExp(`Sitemap: ${SITE}/sitemap.xml`).test(robots)) flag("/robots.txt", "missing or wrong Sitemap line");
  const disallows = [...robots.matchAll(/^Disallow: (\S+)/gm)].map((x) => x[1]);
  for (const p of indexable) for (const d of disallows) {
    const re = new RegExp("^" + d.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*"));
    if (re.test(p.path)) flag(p.path, `blocked by robots.txt rule "${d}"`);
  }
  for (const path of ["/request-service/", "/thank-you/"]) {
    const r = await get(BASE + path);
    if (r.status === 200 && !/noindex/.test(r.robots || "") && !/<meta name="robots" content="[^"]*noindex/.test(r.text)) flag(path, "should be noindex");
  }
  const nf = await get(`${BASE}/this-page-does-not-exist-404/`);
  if (nf.status !== 404) flag("/this-page-does-not-exist-404/", `expected 404, got ${nf.status}`);
  const slash = await get(`${BASE}/about`);
  if (!(slash.status === 308 || slash.status === 301) || !/\/about\/$/.test(slash.loc || "")) flag("/about", `no-trailing-slash variant returns ${slash.status} -> ${slash.loc}`);
  for (const m of maps) { const x = (await get(m)).text; if (/<loc>(?!https:\/\/)/.test(x) || /<loc>[^<]*\/\/www\./.test(x)) flag(m, "sitemap contains non-HTTPS or www URLs"); }
}

// Near-duplicate check among location pages: 5-word shingles on main text.
const sh = (t) => { const w = t.toLowerCase().split(/\W+/).filter(Boolean); const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(" ")); return s; };
const loc = indexable.filter((p) => /-in-[a-z0-9-]+\/$/.test(p.path)).map((p) => ({ path: p.path, s: sh(p.text) }));
let maxSim = 0, maxPair = "";
for (let i = 0; i < loc.length; i++) for (let j = i + 1; j < loc.length; j++) {
  const a = loc[i].s, b = loc[j].s; let n = 0; for (const x of a) if (b.has(x)) n++;
  const sim = n / (a.size + b.size - n); if (sim > maxSim) { maxSim = sim; maxPair = `${loc[i].path} ~ ${loc[j].path}`; }
  if (sim > 0.6) flag(`${loc[i].path} ~ ${loc[j].path}`, `near-duplicate (${sim.toFixed(2)})`);
}

const count = (f) => [...pages.values()].filter(f).length;
console.log(`Crawled ${pages.size} URLs: ${count((p) => p.status === 200)} x 200, ${count((p) => p.status >= 300 && p.status < 400)} redirects, ${count((p) => p.status >= 400)} errors`);
console.log(`Indexable ${indexable.length} · sitemap ${sitemap.size} · max depth ${Math.max(...indexable.map((p) => depth.get(p.path) ?? 99))} · max city/service page similarity ${maxSim.toFixed(2)} (${maxPair})`);
console.log(issues.length ? `\n${issues.length} issue(s):\n` + issues.join("\n") : "\nNo issues.");
process.exit(issues.length ? 1 : 0);
