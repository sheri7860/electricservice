#!/usr/bin/env node
/**
 * IndexNow submitter. Run after each production deploy:
 *   npm run indexnow              # submit new, changed and removed URLs
 *   npm run indexnow -- --dry-run # show what would be submitted
 *   npm run indexnow -- --all     # resubmit every sitemap URL (use sparingly)
 *
 * Reads the live sitemap index, compares each URL's <lastmod> with the last successful run
 * (.data/indexnow-state.json), and notifies IndexNow (Bing, Yandex, Seznam, Naver and other
 * participating engines; Google does not use IndexNow). Removed URLs are submitted too so engines
 * recrawl them and see the 404. A 200/202 response means the notification was accepted,
 * not that the page was indexed.
 *
 * Env: NEXT_PUBLIC_SITE_URL (default https://brightlaneelectric.com), INDEXNOW_KEY (default: the
 * 32-hex key file in public/), INDEXNOW_ENDPOINT (default https://api.indexnow.org/indexnow),
 * INDEXNOW_SOURCE (read sitemaps from here instead of the live site, e.g. http://localhost:3000).
 */
import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run");
const ALL = args.has("--all");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://brightlaneelectric.com").replace(/\/$/, "");
const HOST = new URL(SITE).host;
/** Where to read sitemaps and the key file from (defaults to the live site; set to a local build for testing). */
const SOURCE = (process.env.INDEXNOW_SOURCE || SITE).replace(/\/$/, "");
const fromSource = (u) => SOURCE + new URL(u).pathname;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const STATE = path.resolve(".data/indexnow-state.json");
const LOG = path.resolve(".data/indexnow.log");
const BATCH = 10000; // protocol maximum per request

const keyFile = fs.readdirSync("public").find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
const KEY = process.env.INDEXNOW_KEY || keyFile?.replace(/\.txt$/, "");
if (!KEY) throw new Error("No IndexNow key: set INDEXNOW_KEY or add public/<32-hex-key>.txt");
if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) throw new Error("IndexNow key must be 8-128 characters of a-z, A-Z, 0-9 or -");

const log = (msg) => {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, line + "\n");
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const r = await fetch(url, { headers: { "user-agent": "brightlane-indexnow/1.0" } });
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  return r.text();
}

/** Collect {url: lastmod} from the sitemap index and its child sitemaps. */
async function sitemapUrls() {
  const out = {};
  const index = await get(`${SOURCE}/sitemap.xml`);
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const m of maps) {
    const xml = await get(fromSource(m));
    for (const u of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
      if (new URL(u[1]).host === HOST) out[u[1]] = u[2] || "";
    }
  }
  return out;
}

/** POST one batch with retries on 429/5xx; returns true when accepted (200 or 202). */
async function submit(urlList) {
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList });
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body });
    log(`POST ${ENDPOINT} urls=${urlList.length} attempt=${attempt} -> ${r.status}`);
    if (r.status === 200 || r.status === 202) return true;
    if (r.status === 400) throw new Error("400 Bad request: check the URL list and JSON");
    if (r.status === 403) throw new Error(`403: key not valid. Is ${SITE}/${KEY}.txt live and does it contain the key?`);
    if (r.status === 422) throw new Error(`422: URLs do not belong to ${HOST} or the key does not match`);
    if (r.status === 429 || r.status >= 500) { await sleep(2000 * 2 ** attempt); continue; }
    throw new Error(`Unexpected status ${r.status}`);
  }
  return false;
}

const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {};
const current = await sitemapUrls();

// Verify the key file is live before submitting anything.
const keyBody = (await get(`${SOURCE}/${KEY}.txt`).catch(() => "")).trim();
if (keyBody !== KEY && !DRY) throw new Error(`Key file ${SITE}/${KEY}.txt is missing or wrong; deploy it first.`);

const added = Object.keys(current).filter((u) => !(u in state));
const changed = Object.keys(current).filter((u) => u in state && state[u] !== current[u]);
const removed = Object.keys(state).filter((u) => !(u in current));
const toSend = ALL ? Object.keys(current).concat(removed) : [...added, ...changed, ...removed];
log(`${HOST}: ${Object.keys(current).length} sitemap URLs; new ${added.length}, changed ${changed.length}, removed ${removed.length}; sending ${toSend.length}${DRY ? " (dry run)" : ""}`);

if (DRY) { toSend.slice(0, 20).forEach((u) => console.log("  " + u)); if (toSend.length > 20) console.log(`  … and ${toSend.length - 20} more`); process.exit(0); }
if (!toSend.length) process.exit(0);

let ok = true;
for (let i = 0; i < toSend.length; i += BATCH) {
  const accepted = await submit(toSend.slice(i, i + BATCH));
  ok &&= accepted;
  if (i + BATCH < toSend.length) await sleep(1000);
}
if (ok) {
  fs.mkdirSync(path.dirname(STATE), { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify(current, null, 0));
  log("State saved. Notifications accepted (this is not confirmation of indexing).");
} else {
  log("Some batches failed after retries; state not saved, so the next run will retry them.");
  process.exit(1);
}
