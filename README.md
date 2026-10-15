# Brightlane Electric: nationwide electrician lead-gen site

Built from the SteadWell playbook (`Local Service Lead-Gen Website — Complete Build Playbook`), adapted for **electrical services** across the **whole USA**. Coverage comes from the **LeadSmart coverage feed** (https://leadsmart-coverage.netlify.app/), **Electrical** niche only.

## Snapshot

| | |
|---|---|
| Brand | **Brightlane Electric**. `brightlaneelectric.com` returned 404 from Verisign RDAP on 2026-10-13, so it looked unregistered. Run a USPTO/state check before you buy it. |
| Model | A call brand for LeadSmart buyers. The site never claims its own electricians, licenses, trucks or reviews (see `DISCLOSURE` in `src/content/site.ts`) |
| Coverage | 47 states + DC: **9,953 cities/towns, 16,988 ZIP codes** (LeadSmart data date 2026-10-11). No Electrical coverage yet in AK, SD or VT, so they have no pages |
| Services | 14 in 4 categories (repair, panels & wiring, installation, safety) |
| Location pages | 48 state pages (every covered state + DC), 85 metro pages and 255 city + service pages, all with hand-written local content |
| Guides | 8 |
| PPC pages | 4 (`/lp/*`, noindex, `?kw=` whitelist) |
| Temporary phone | `(555) 010-0142` (fictional range). It is kept out of schema. Replace it with the LeadSmart number. |

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev                 # http://localhost:3000
npm run build && npm start
npm run data:coverage       # re-pull LeadSmart Electrical coverage (states, cities, ZIPs)
```

## What's different from the SteadWell design

- A graphite + volt-yellow palette (`#15171c` / `#ffc21a`) with a teal accent (`#0f766e`), in place of navy and copper.
- Space Grotesk headings + Inter UI, in place of Source Serif + Inter Tight.
- Heroes have a solid graphite background, a volt-yellow left rule and a white panel holding the ZIP checker or form.
- A **US tile-grid coverage map**: covered states are clickable and uncovered ones are greyed out.
- Cards have a yellow top border (`.card-top`) and the service process is a numbered timeline.
- Heroes use a dimmed Pexels photo behind the graphite background; the services hub has a photo per category. Stock only, never presented as network work.

## How coverage works

`scripts/build-coverage.mjs` reads the LeadSmart site's static API: `meta.json`, then `states.json`, then one shard per state (`api/state/XX.json`). It keeps only the `Electrical` rows and writes:

- `src/data/coverage.json`: states → cities (name, slug, county, ZIPs, population). This drives the state pages, the menus and the tile map.
- `public/data/zips.json`: ZIP → [city, state]. The client ZIP checker uses it, and the lead API uses it to mark each lead `covered`.

The feed stores ZIPs as numbers, so the script pads them back to 5 digits (02134, not 2134).

## Indexing rules (no doorway pages)

- **State pages** come from real coverage data (city list, ZIP counts) plus a state note and a region climate/housing section. They link to every metro page and local service page in the state.
- **City pages** (`/locations/{state}/{city}/`) exist **only** for cities with hand-written content in `src/content/cityLocal*.ts` (housing, issues, permits, neighborhoods) plus a weather/utility note in `citySeasons*.ts`.
- **City + service pages** (`/locations/{state}/{city}/{service}/`) exist **only** where `cityServices*.ts` has a hand-written note on how that service plays out in that city (permit office, utility, housing, weather).
- **Quality gate** (`src/lib/quality.ts`): a city needs at least 180 words of local copy, 2 or more issues and 3 or more neighborhoods; a city + service note needs at least 90 words, a published parent service, and no more than 0.30 four-word-shingle similarity with the same service in any other city. Failing pages are not built (real 404) and stay out of the sitemap. Fix failures by writing more real local content, never by lowering thresholds.
- Every other covered city is listed on its state page and served through the ZIP checker. Cities with only a handful of covered ZIPs (most of HI, ME, MS, MT, ND, WY) intentionally have no city page.
- New content goes in a new `*WaveN.ts` file and is merged with `Object.assign` at the bottom of the base file.

## Validation crawl

```bash
npm run build && npm start      # in one terminal
npm run seo:crawl -- http://localhost:3000
```

`scripts/seo-crawl.mjs` crawls every sitemap URL and internal link. It checks status codes, redirects, canonicals, noindex, titles, descriptions and H1s (missing or duplicated), heading order, JSON-LD validity, breadcrumbs, image alt text, orphans, click depth and sitemap coverage, and it flags location pages whose main text is more than 60% similar. It exits non-zero on any issue.

## Before launch

- [ ] Set the real LeadSmart phone (`NEXT_PUBLIC_BUSINESS_PHONE` / `_E164`) and, for PPC, `NEXT_PUBLIC_PPC_TRACKING_PHONE`
- [ ] `LEAD_WEBHOOK_URL` + `LEAD_WEBHOOK_SECRET`. Without them, production returns 503 "please call". In dev, leads go to `.data/leads.jsonl`.
- [ ] Set `NEXT_PUBLIC_EMERGENCY_24_7=true` only if calls really are answered 24/7
- [ ] Register the domain; then DNS, HTTPS, Search Console (Domain property), sitemap submission and Bing
- [ ] Have a lawyer review Privacy/Terms, and check the TCPA consent wording
- [x] Licensed Pexels photos added (`public/photos/`, credits in `CREDITS.md`, mapped in `src/content/photos.ts`)
- [x] OG share image (`public/og.jpg`, 1200×630) on every page, large Twitter/X card
- [ ] Move the rate limiter to Redis/Upstash if hosting is serverless
- [x] Fact-check pass on permit offices, licensing and utilities (2026-10-15); re-verify before launch, since offices get renamed
- [ ] Confirm each city's permit office link is current; offices and portals change
- [ ] Add more metro pages in a new `cityLocalWaveN.ts`, each with real local content
- [ ] Re-run `npm run data:coverage` on a schedule so coverage stays current

## QA done (2026-10-13)

- `tsc --noEmit` is clean and `next build` passes. Every content route is static.
- Status, title and H1 are correct on: home, a service page, emergency, locations, a state page, a city page, a guide, an LP with `?kw=`, a real 404, the sitemaps, `llms.txt` and `robots.txt`.
- No horizontal overflow at 375px on home, state, service, city and LP pages.
- The ZIP checker resolves leading-zero ZIPs (02134 → Allston, MA).
- The lead API's Zod validation returns 422 with per-field errors. Production with no destination returns 503, as designed.

## Nationwide expansion (2026-10-15)

- 85 metro pages and 255 city + service pages across 41 states + DC, built in seven gated waves.
- `npm run seo:crawl` on the production build: 421 URLs, all 200, 420 indexable and all in the sitemap, max click depth 2, no duplicate titles/descriptions/H1s, no orphans; the most similar pair of location pages is 0.57 (limit 0.60).

## After launch: IndexNow

`npm run indexnow` notifies Bing and other IndexNow engines (not Google) about new, changed and removed URLs, read from the live sitemaps. Run it after each production deploy; `--dry-run` shows what it would send. The key file is `public/d0a774b24c72486887c14a5f45494f3e.txt` and must be live first. State and logs go to `.data/` (git-ignored). Google still relies on the sitemap in Search Console.
