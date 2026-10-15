# Local Service Lead-Gen Website — Complete Build Playbook

> **How to use this file.** It's two things at once:
> 1. The documentation for **SteadWell Plumbing** (this project), and
> 2. A reusable **playbook for building the next site** the same way.
>
> For a new website: create an empty folder, put this README in it, and tell Claude:
> *"Build a new website following README.md. Business: {trade}, market: {city/state}, brand: {name or 'create one'}."*
> Claude should follow **Part B (Playbook)** start to finish, using **Part A** as the reference implementation.
>
> **Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS v4 · Zod · sharp. No CMS or database is required to launch; content is typed data shaped to match `prisma/schema.prisma` for a later move to a database.

---

## Table of contents

- **Part A — This project (SteadWell)**
  - A1. Snapshot · A2. Run it · A3. Folder map · A4. Configuration · A5. What's built · A6. Pending before launch
- **Part B — Playbook for the next site**
  - B0. Non-negotiable rules
  - B1. Phase 1: Research and strategy
  - B2. Phase 2: Brand and assets (logo, favicons, photos, OG images)
  - B3. Phase 3: Project setup
  - B4. Phase 4: Content model
  - B5. Phase 5: Design system and layout
  - B6. Phase 6: Page templates
  - B7. Phase 7: Lead system (LeadSmart workflow)
  - B8. Phase 8: PPC landing pages
  - B9. Phase 9: SEO, AEO and GEO system
  - B10. Phase 10: Analytics and attribution
  - B11. Phase 11: Security and performance
  - B12. Phase 12: QA and audit
  - B13. Launch checklist
  - B14. Gotchas we hit (and fixes)
  - B15. Copywriting rules
  - B16. Checklist for adapting to another trade or city

---

# PART A — THIS PROJECT

## A1. Snapshot

| | |
|---|---|
| Brand | **SteadWell Plumbing** (short: SteadWell). The logo artwork reads "Steadwell Plumbing & Drain"; both are declared as `alternateName` in schema |
| Market | Charlotte, NC metro + York County, SC — **19 towns in 6 regions** |
| Services | **24** in 10 categories |
| Guides | **16** (informational, problem and how-to intent) |
| Indexable URLs | **74** in 4 sitemaps, all within 2 clicks of home |
| Q&A content | **~200** questions with direct answers (service, city, guide and general FAQs) |
| Domain | **https://steadwellplumbing.com** (apex, canonical). `www.` 308-redirects in one hop |
| Temporary phone | `(704) 555-0123`, from the fictional 555-01xx range. Replace with the LeadSmart number. |
| Business model | **Call brand for LeadSmart buyers.** Independent licensed plumbers answer and do the work (see A7) |
| Audit status | `npm run audit:seo`: **0 errors**, CLS 0, all pages static |

## A2. Run it

```bash
npm install
cp .env.example .env.local      # fill ONLY verified business facts
npm run dev                     # http://localhost:3000
npm run build && npm start      # production build
npm run audit:seo               # crawl QA against the running build (exit 1 on errors)
npm run icons                   # complete a favicon bundle (favicon.ico + apple-touch-icon)
npm run indexnow                # after deploy: notify Bing/Yandex of all sitemap URLs
npm run indexnow -- /path/ /x/  # after an edit: notify only changed URLs
node scripts/process-logo.mjs   # regenerate transparent + light logo variants
```

In development, `GET /api/quality-report/` shows every location page and whether the quality gate allows indexing.

## A3. Folder map

```
docs/
  STRATEGY.md        research, brand, IA, keyword clusters, PPC plan (phase-1 output)
  SEO.md             intent map, indexation, schema graph, linking, AEO/GEO rules
  MEASUREMENT.md     analytics events, attribution, GTM setup
prisma/schema.prisma future DB/CMS model (mirrors src/content/types.ts)
public/
  brand/             logo-steadwell.png (transparent) + logo-steadwell-light.png (on dark)
  photos/            real photos + CREDITS.md (sources and license)
  favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png,
  android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest
scripts/
  seo-audit.mjs      crawler-based technical SEO audit
  process-logo.mjs   white-background logo → transparent + light variants
  make-icons.mjs     completes a favicon bundle (ico + apple icon)
src/
  content/           ALL business content, typed (the "CMS")
    site.ts            business facts from env (phone, license, 24/7 flag, review links)
    types.ts           content types (Service, City, CityService, Article, Review…)
    services.ts + servicesMore.ts    24 services, categories, category photos
    locations.ts + locationsMore.ts  states, 19 cities, city+service pages, regions
    articles.ts + articlesMore.ts    12 guides
    problems.ts        symptom → cause → service/guide (homepage problem finder)
    faqs.ts, reviews.ts, beforeAfter.ts, landingPages.ts, redirects.ts, dates.ts
  lib/
    routes.ts          every URL builder (single source of truth)
    seo.ts             pageMeta(): title, description, canonical, robots, OG, Twitter
    schema.ts          connected JSON-LD graph with stable @ids
    sitemap.ts         indexableUrls(), the list sitemaps, llms.txt and the audit share
    quality.ts         programmatic-SEO quality gate
    linker.tsx         contextual internal links (server-side, capped)
    og.ts              per-page Open Graph card definitions
    attribution.ts     UTM/gclid first-party capture
    analytics.ts       dataLayer events
    lead/              schema.ts (Zod), rateLimit.ts, store.ts (webhook/DB/dev file)
  components/
    layout/            Header, HeaderShell (sticky), MegaMenu, NavLink, MobileNav (portal drawer),
                       MobileActionBar, Footer, nav.ts
    templates/ServiceTemplate.tsx   service + city-service template
    lead/              LeadForm (3-step client form), LeadFormBlock (server wrapper)
    ui.tsx             SectionHeading, PhotoCard, Chip
    Logo, PhoneLink, Breadcrumbs, FaqList, Reviews, BeforeAfterSlider, ZipChecker,
    PhotoSlot, CtaBand, Related, JsonLd, Tracking, icons
  app/
    layout.tsx         fonts, icons, manifest, sitewide JSON-LD, tracking
    (site)/            public pages (with header/footer)
    lp/                PPC landing pages (minimal layout, noindex)
    api/lead           lead endpoint · api/quality-report (dev only)
    og/[key]           per-page OG images (static PNG)
    sitemap.xml, sitemap-{pages,services,locations,guides}.xml, robots.ts, llms.txt
```

## A4. Configuration (`.env.local`)

| Variable | Purpose | Rule |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical origin | set to the real domain before launch |
| `NEXT_PUBLIC_BUSINESS_PHONE` / `_E164` | main phone | unset = temporary 555 number (kept out of schema) |
| `NEXT_PUBLIC_PPC_TRACKING_PHONE` | call-tracking number on `/lp/*` | optional |
| `NEXT_PUBLIC_BUSINESS_EMAIL`, `_HOURS` | contact facts | hidden when empty |
| `NEXT_PUBLIC_LICENSE_NUMBER` | contractor license | shown and put in schema only when set |
| `NEXT_PUBLIC_OFFICE_ADDRESS` | real staffed office only | empty = "service-area business" |
| `NEXT_PUBLIC_EMERGENCY_24_7` | `true` only if 24/7 dispatch is staffed | controls every "24/7" claim |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` / `_PROFILE_URL` | Google review links | turns on the review invitation block |
| `NEXT_PUBLIC_GTM_ID`, `_GOOGLE_SITE_VERIFICATION`, `_BING_SITE_VERIFICATION` | analytics / Search Console | nothing loads when empty |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET` | lead delivery (HMAC-signed) | production refuses leads with no destination |
| `DATABASE_URL` | Prisma lead storage | wire up in `src/lib/lead/store.ts` |

## A5. What's built (feature inventory)

- **Pages:** home, services hub, 24 service pages, emergency hub, locations hub, 2 state pages, 19 city pages, 3 city+service pages, resources hub, 12 guides, about, contact, request service, FAQ, privacy, terms, accessibility, thank-you, 404, 5 PPC landing pages.
- **Header:** navy utility bar (service area, availability, promise); white sticky bar that shrinks and gains a shadow on scroll; logo; full-width mega menus with hover intent (services with icon tiles and an emergency photo card; locations grouped by region); active underline; phone block; "Request service" button. Mobile uses a slide-in drawer rendered via a portal, plus a sticky Call / Request bottom bar.
- **Homepage:** solid navy hero (what, where, benefit, availability, 2 CTAs, phone); promise band; emergency banner; category photo cards; symptom finder; before/after sliders; process timeline; service-area panel with ZIP checker; local-knowledge cards; guide cards; reviews; FAQ; final CTA.
- **Service template:** solid hero with direct answer, CTAs and promise list, plus a photo; sticky on-page nav; intro with contextual links; "{Service} at a glance" facts; signs; process timeline; cost factors (no invented prices); DIY safe/stop cards; FAQs; town chips; sticky lead form and call card; related-service photo cards; guides; closing CTA.
- **City pages:** hero with neighborhoods and availability; housing notes and local issues (with contextual links); common calls; "{City} at a glance"; FAQs; guides; nearby towns; state link; lead form.
- **Lead system:** 3-step form; short emergency path; client + server Zod validation; honeypot, minimum fill time, rate limit, same-origin check; hashed IP; attribution; signed webhook; thank-you page.
- **SEO system:** see B9 and `docs/SEO.md`.
- **Reviews:** renders only real, verified reviews (rating summary + cards); otherwise a "Leave a Google review" invitation when configured; otherwise nothing.
- **Assets:** brand logo (+ light variant), the owner's favicon bundle (completed with `.ico` and apple icon), real licensed photos, 83 per-page OG images.

## A6. Pending before launch

- [x] Domain chosen: steadwellplumbing.com (canonical is the default; set `NEXT_PUBLIC_SITE_URL` only to override)
- [ ] Point DNS for both `steadwellplumbing.com` and `www.steadwellplumbing.com` at the host; enable HTTPS and HTTP→HTTPS redirect at the host/CDN
- [ ] Google Search Console: add a **Domain property** (DNS TXT), submit `/sitemap.xml`, request indexing for the homepage and top service pages
- [ ] Bing Webmaster Tools: import from Search Console, then `npm run indexnow`
- [ ] Replace the temporary phone with the LeadSmart number
- [ ] Trademark / entity check (USPTO Class 37, NC & SC Secretary of State)
- [ ] License number (verify with the NC Plumbing Board), email, hours; set 24/7 only if true
- [ ] Lead delivery: `LEAD_WEBHOOK_URL` + secret (or wire Prisma)
- [ ] Move the rate limiter to Redis/Upstash if deploying serverless
- [ ] Google Business Profile → review links → add real reviews to `reviews.ts`
- [ ] Replace stock photos with real job photos as they come in (with homeowner consent for before/after)
- [ ] Legal review of Privacy/Terms; confirm SMS consent wording against TCPA
- [ ] GTM + Consent Mode, GA4, Ads conversions (docs/MEASUREMENT.md)
- [ ] `npm run audit:seo` on staging = 0 errors → submit `/sitemap.xml` to Search Console and Bing
- [ ] Spot-check pages in Google's Rich Results Test; run PageSpeed Insights on the live domain (LCP)


## A7. Optimization phase: status (2026-09-27)

> **Continue here next session:** the SteadWell pass is complete. The next site in the optimization order is **Copperline** (`D:\copperline-restoration`), followed by Sabine Crest, Kestrel, Sageline, Holdfast and Northgable. Each site is audited, fixed, tested, documented in its own README, then committed.

### Business model (owner decision, 2026-09-27)

Every portfolio site, SteadWell included, is a **call brand for LeadSmart buyers**:

- **Copy:** confident, but never claims SteadWell's own plumbers, dispatchers, trucks, licenses, offices or reviews.
- **Constants:** `BRAND_PROMISE` and `DISCLOSURE` live in `src/content/site.ts`.
- **Disclosure placement:** the footer bottom bar, the `/lp/` footer, the form consent (which names sharing with up to three plumbers), Terms, Privacy (which describes the sharing and call tracking) and `llms.txt`.
- **Schema:** the Organization is a plain `Organization`, no longer `Plumber`. Service nodes use `broker`, not `provider`. The brand license display and `hasCredential` were removed.
- **Rewrites:** about 60 sentences changed from "we fix / a dispatcher / we pull permits" to "the plumber…" or neutral wording. This covered the About page, home process, emergency service, landing pages, city FAQs, the thank-you page and contact.

### Content

- **Guides (16):**
  - Each gained a "when to call / what the plumber does" section and 2–3 direct-answer FAQs.
  - They now run about 490–640 words, up from 300–500.
  - FAQs render visibly (`FaqList`) with FAQPage markup.
  - The depth lives in `src/content/articleDepth.ts` and is merged in `articles.ts`.
- **State pages:** a new `details` field adds housing stock, water/sewer providers and permits. SC went from 217 to 392 words.
- **`/locations/` hub:** a new "How service areas work / What changes town to town / Permits and utilities" section, plus honest wording (no "we staff" or "we dispatch").
- **Homepage hero:** now reads "A Charlotte-area plumber who explains the problem before fixing it."

### Internal linking

- **Linker (`src/lib/linker.tsx`):** grew from 20 to 31 topics. New targets: shutoff valves, remodels, home inspections, crawl spaces, hard water, disposal jams, chemical drain cleaners/plungers, sewer smell, slow sinks, leaking water heaters, outdoor faucets and irrigation.
- **Related services:** leak detection now links to slab leak repair.
- **Results:** every sitemap URL is within 2 clicks. Weak pages gained contextual inbound links; see the scan below.

### Images

- **Replaced:**
  - The checkerboard sink (drains category, homepage problem finder, OG) → a plunger clearing a toilet, plus the plumber-under-sink photo.
  - European blue-hose tap (water lines) → water meter and supply line.
  - Gray push-fit pipework (sewer, before/after) → copper pipe runs.
  - European outdoor tap "after" → the US hose bib.
- **Processing:** new photos go through `scripts/optimize-photos.mjs` (hashed WebP and responsive variants in `photoAssets.json`). Credits are in `public/photos/CREDITS.md`.
- **Guide pages:** the top photo was lazy-loaded and was the LCP element. It is now `priority` (eager, high fetch priority, preloaded).

### Performance

- **`globals.css`:** below-the-fold sections (4th onward) use `content-visibility: auto`, which cuts initial style/layout on long pages.
- **The homepage is excluded** via `div[data-home]`, because deferred layout there tripped the target-size audit.
- **Avoid `:has()` in this rule.** It made style recalculation expensive and cancelled the gain.
- **Font experiment:** turning off the Archivo preload made no difference and added CLS, so it was reverted.
- **Lighthouse (local prod build, Performance / Accessibility / Best Practices / SEO):**

| Page | Mobile | Desktop |
|---|---|---|
| Home | 84–88 / 100 / 100 / 100 (LCP ≈4.0 s, hero text) | 100 across |
| Service (drain cleaning) | 89 / 100 / 100 / 100 (was 82–84) | 100 across |
| City (Charlotte) | 83–90 / 100 / 100 / 100 | 100 across |
| Guide | 78–91 / 100 / 100 / 100 | 99–100 |
| LP (noindex) | 89 / 100 / 100 / 69 (SEO 69 = intentional noindex) | 100 / 100 / 100 / 69 |

- **CLS:** 0 on every page.
- **Known issue:** simulated mobile LCP stays around 3.5–4.4 s. Real-world numbers should be checked with PageSpeed Insights / CrUX after deploy before more work. Candidates: a smaller Archivo subset (the width axis costs 89 KB), and trimming the header mega-menu DOM.

### QA done

- `npm run audit:seo`: 0 errors, 74 sitemap URLs, depth ≤2.
- Deep scan (`BASE=http://localhost:3101 node scripts/quality-scan.mjs`): no filler phrases, no unsupported absolutes (the remaining "best" uses are natural, e.g. "best for lines that…").
- Responsive check at 320px: no horizontal scroll on home, service, city, city+service, guide, locations, request, LP or FAQ. The service-page section nav is an intended swipe strip.

### Remaining work (priority order)

1. [ ] After deploy, measure field CWV (CrUX/PSI) and decide whether to subset fonts or slim the header DOM.
2. [ ] Consider adding more city+service pages (Huntersville/Matthews/Concord water heater and drain combos) only where the local angle is real.
3. [ ] Replace the remaining European-looking shower photos (`shower-valve`, `shower-head`, `glass-shower`) when better American stock or real job photos are available.
4. [ ] Owner: `public/steadwellplumbing-service-areas.png` shows as deleted in the working tree (not by this pass). Confirm whether to commit the deletion.
5. [ ] All items in A6 (launch) are still open.

---

# PART B — PLAYBOOK FOR THE NEXT SITE

Work through the phases in order. At the start, reply with the Phase 1 plan (the 14 planning items in B1), then build. After each major step, **verify in the browser** (desktop 1366/1280/1024, mobile 375) and fix what's found, rather than only reporting it.

## B0. Non-negotiable rules

1. **Never invent business facts.** No street addresses, license numbers, certifications, awards, years in business, job counts, team members, insurance claims, guaranteed response times or "24/7" unless configured. Use env config + `{{PLACEHOLDER}}` or omit.
2. **Never fabricate reviews or testimonials**, even if asked. It's illegal under the FTC's 2024 rule on fake reviews (civil penalties) and against Google policy. Build the review UI so it switches on when real reviews are added; meanwhile show a "Leave a Google review" invitation or nothing. Say this plainly if the owner asks for fake reviews.
3. **Never use AI-generated "real-looking" photos of workers or jobs.** Use real licensed photography (Pexels/Unsplash, commercial license, credited in `public/photos/CREDITS.md`) and label stock before/after pairs as *examples, not our jobs*.
4. **Phone placeholders use the fictional 555-0100–0199 range** and are excluded from structured data.
5. **No doorway pages.** Location and city+service pages must pass the quality gate (B9), or they aren't indexed.
6. **No fake schema:** no ratings, reviews, prices, offices, awards or licenses unless real and visible.
7. **Don't overwrite files the owner supplied.** Check `public/` for existing favicons and logos before generating anything with the same filenames.
8. Service-area business: towns are service areas, never "offices", unless a real staffed office exists.

## B1. Phase 1 — Research and strategy (write `docs/STRATEGY.md`)

Deliver these 14 items before coding:
1. Brand name (original; check it doesn't imitate majors; recommend a USPTO/state check)
2. Initial city/state (population, housing age, climate issues, competition)
3. Brand strategy (voice, palette, type, logo concept, CTA language)
4. SERP/competitor observations (label clearly if not a live scrape)
5. Keyword clusters (transactional, service, problem, local, cost) mapped to one page each
6. Information architecture (URL tree)
7. Service taxonomy (categories → services; sub-problems as sections, not thin pages)
8. Location architecture (state → city → city+service, gated)
9. Homepage wireframe
10. PPC landing-page strategy
11. Internal-linking strategy
12. Technical architecture
13. SEO implementation plan
14. Lead workflow

**Domain research:** check real availability through the registry's RDAP (404 = unregistered), in parallel with timeouts:
```bash
for d in brandname brandnameplumbing callbrandname; do (code=$(curl -s -m 40 -o /dev/null -w "%{http_code}" "https://rdap.verisign.com/com/v1/domain/$d.com"); echo "$d.com $code") & done; wait
```

**URL scheme** (keep it):
```
/  /plumbing-services/  /plumbing-services/{service}/  /emergency-plumbing/
/locations/  /locations/{state}/  /locations/{state}/{city}/  /locations/{state}/{city}/{service}/
/resources/  /resources/{guide}/  /about/ /contact/ /faq/ /request-service/ (noindex)
/privacy/ /terms/ /accessibility/ /thank-you/ (noindex)  /lp/{campaign}/ (noindex)
```
For another trade, rename `plumbing-services` (e.g. `hvac-services`) in `src/lib/routes.ts` only.

## B2. Phase 2 — Brand and assets

**Palette** (SteadWell; derive new ones from the client logo):

| Token | Hex | Use |
|---|---|---|
| ink | `#002855` | text, heroes, footer |
| sky / sky-deep / sky-tint | `#0695D9` / `#0071AE` / `#E6F4FB` | accents, links, icon tiles |
| copper / copper-dark | `#B4552D` / `#93421F` | primary CTA buttons only |
| alert / alert-tint | `#B42318` / `#FDECEA` | emergency only |
| paper / paper-deep / line | `#F7F4EE` / `#EFE9DF` / `#DDD5C8` | backgrounds, borders |
| sage | `#4F6B5B` | success, checks |

Sample the client logo's colors with sharp (read raw pixels at known coordinates) and align the tokens to them.

**Type:** Source Serif 4 (headings, weights 500/600/700) + Inter Tight (UI), via `next/font/google` with `display: swap`.

**Logo:** if the client logo PNG has a white background, run `scripts/process-logo.mjs`. It makes a transparent version (alpha from whiteness, un-premultiplied edges) and a light version for dark backgrounds (letters white, blue accents kept). Use it in `<Logo>` with `next/image` and static import.

**Favicons:** if the client provides a bundle (android-chrome-192/512, favicon-16/32, site.webmanifest), **use it**. Run `npm run icons` to add only what's missing (`favicon.ico` 16/32/48 built from their PNGs, and a 180px `apple-touch-icon.png` on white). Fill in the manifest's name and theme color, and declare every icon in `metadata.icons` + `manifest` in `app/layout.tsx`.

**Photos:** search Pexels via the browser (`fetch('/search/{q}/')` on pexels.com, parse `/photo/{slug}-{id}/`). Download thumbnails, build a sharp contact sheet, pick by eye (reject foreign-language branding, staged cheesiness, non-US fixtures). Download the chosen ones at `?auto=compress&cs=tinysrgb&w=1600` with descriptive filenames. Record IDs in `public/photos/CREDITS.md`. Map a photo to every service category plus hero, locations and CTA uses.

**OG images:** per-page 1200×630 PNG at `/og/{key}.png` (`src/app/og/[key]/route.tsx` + `src/lib/og.ts`), statically generated for every indexable URL. The layout is a navy panel with the light logo, eyebrow, title and area line, plus the page photo on the right. `pageMeta()` sets `openGraph.images` and `twitter.images` automatically, falling back to the home card.

## B3. Phase 3 — Project setup

`package.json` essentials: `next`, `react`, `react-dom`, `zod`, `sharp`; dev: `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `@types/*`. Scripts: `dev`, `build`, `start`, `typecheck`, `audit:seo`, `icons`.

- `tsconfig.json`: strict, `paths: {"@/*": ["./src/*"]}`
- `postcss.config.mjs`: `{ plugins: { "@tailwindcss/postcss": {} } }`
- `next.config.ts`: `trailingSlash: true`; `poweredByHeader: false`; images AVIF/WebP with `deviceSizes [390,640,828,1080,1280,1600]`; security headers (nosniff, X-Frame DENY, Referrer-Policy, Permissions-Policy, HSTS); `X-Robots-Tag` noindex for `/lp/*`, `/thank-you/`, `/api/*`, `/request-service/`; cache headers for `/photos` and `/brand`; redirects imported **statically** from `src/content/redirects.ts`.
- `.env.example` documents every variable (A4). `.gitignore` covers `.env*`, `.next`, `.data`.

## B4. Phase 4 — Content model (`src/content/`)

All content is typed data. Key types: `Service` (slug, name, category, status, seoTitle, metaDescription, h1, **answer**, intro[], signs[], process[], costFactors[], diy?, faqs[], related[], isEmergencyCapable, photo?, updated?), `City` (slug, stateSlug, county, status, officeAddress|null, zips[], areas[], intro, housingNotes, localIssues[], popularServices[], nearby[], faqs[], updated?), `CityService` (localAngle[], localFaqs[]), `Article` (answer, sections[], services[], relatedArticles[], published, updated, reviewedBy|null), `Review`, `BeforeAfter`, `LandingPage`.

- Statuses: `DRAFT | REVIEW | PUBLISHED | NOINDEX | ARCHIVED`. Existing in data never means published.
- `services.ts` concatenates core + `servicesMore.ts`; the same pattern applies to locations and articles. Add new records to the `*More.ts` files.
- `regions` in `locations.ts` groups towns for the menu, homepage and hub.
- `cityLabel(c)` is the only way to print "Town, ST". Never hardcode the state.
- `dates.ts` holds the collection content dates for sitemap `lastmod`.

**Content depth per record** (what passes review):
- Service: a 1–3 sentence direct answer, 2 intro paragraphs, 5 signs, 3–4 process steps, 4–5 cost factors, DIY safe/stop, 2–3 FAQs, 3–4 related.
- City: an intro about housing age, housing notes, 3 local issues (real local conditions: soil, trees, freezes, well/septic, permits), 2 FAQs (one about permits), ZIPs, neighborhoods, nearby towns.
- Guide: a short answer, 3–5 sections with lists, 2–3 services, related guides.

## B5. Phase 5 — Design system and layout

- **Tailwind v4:** tokens in `@theme` in `globals.css`. Component classes (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-alert`, `.btn-ghost-light`, `.container-x`, `.eyebrow`, `.prose-sw`, `.link`, `.answer-box`, `.field`, `.field-label`) go in `@layer components`. **You can't `@apply` another custom class in v4**, so use `class="btn btn-primary"`. `.btn` has `whitespace-nowrap`, min height 48px, 6px radius.
- **Visual rules:** solid backgrounds (no grids, blobs, glows or glassmorphism). Heroes are solid navy. Cards: `rounded-2xl bg-white ring-1 ring-line`. Photo cards zoom subtly on hover. Section rhythm alternates paper, paper-deep, white and navy. Monoline 1.5px icons (`components/icons.tsx`).
- **Header:** utility bar (not sticky) + `HeaderShell` (sticky, white, blur, shadow on scroll). Logo, then a **48–56px gap** (`lg:ml-8 xl:ml-10 2xl:ml-14`), then nav, then phone block and Request button. Hide "Contact" below `xl` to avoid overflow at 1024. Nav links use an animated underline and `aria-current`.
- **Mega menu:** a disclosure button with hover intent (90ms open / 160ms close, mouse only), click and Escape to close. It's a full-width panel positioned against the sticky header, with a feature card column plus 3 group columns.
- **Mobile drawer:** **must render through `createPortal(…, document.body)`**, because the header's `backdrop-filter` creates a containing block that traps `position: fixed` children. Use `invisible` + `inert` when closed, a focus trap start, Escape to close, and a body scroll lock. Emergency card first, then accordion categories, town tiles, company links, and a pinned Request button.
- **Mobile action bar:** fixed bottom Call / Request (on LP pages Request anchors to `#lead-form`). Add bottom padding to the footer so nothing hides behind it.

## B6. Phase 6 — Page templates

- **Hero pattern (every page type):** solid `bg-ink`, eyebrow, H1, direct answer or lead, primary CTA (copper, call), secondary (outline, request), then a thin divider and 2–4 facts (availability, service area / promises). Photo on the right with `priority`. No floating cards over the hero.
- **Service template:** see A5. Required sections, in order: hero → on-page nav → intro (linked) → at-a-glance `<dl>` → signs → [local conditions on city+service pages] → process → cost → DIY → FAQ → areas → reviews · sidebar form → related photo cards → guides → closing CTA.
- **City page:** hero (neighborhoods and availability) → housing and local issues → common calls (linking to city+service where one exists) → "also available" line linking to emergency and all services → at-a-glance → FAQ → guides → nearby chips + state link · sidebar form.
- **Hubs:** services grouped by category with photo cards and category anchors; locations grouped by region with a ZIP checker; resources grouped by category.
- **Guides:** breadcrumbs, category, H1, updated date, "Short answer" box, photo, sections (linked), editorial note, sidebar CTA to the primary service, related services and guides.

## B7. Phase 7 — Lead system (LeadSmart workflow)

- **Form (`LeadForm.tsx`, client):** Step 1 is the problem (service select) and "Is water actively leaking?". **Yes** shows a Call button and skips to a short step (name, phone, ZIP, consent). **No** goes to Step 2 (ZIP with a live coverage check, timing), then Step 3 (name, phone, optional email, contact method, notes, consent). Visible step counter, focus moved to the first error, `aria-invalid`/`aria-describedby`, a honeypot field, and `startedAt`. It supports `defaultService` and `defaultZip` (from `?service=&zip=`).
- **Server (`/api/lead`):** JSON only, same-origin check (403 otherwise), 10KB limit, rate limit per salted-IP hash, Zod validation (US phone, 5-digit ZIP, consent literal true). The honeypot or a submission under 2.5s gets a silent 200. Leads are delivered to a signed webhook, then the DB, then (dev only) `.data/leads.jsonl`. Production with no destination returns 503 ("please call"). Logs contain metadata only, never PII.
- **Thank-you page:** noindex; the message differs for emergency and out-of-area requests; no PII in the URL.

## B8. Phase 8 — PPC landing pages

`/lp/{slug}/` uses a minimal layout (logo + call button, no nav), H1 above the form on mobile, bullets, availability, area line, what-to-expect, signs and FAQs. **`?kw=` headline swaps come from a whitelist only** (arbitrary text is never reflected, which prevents injected content). The tracking phone is used when set. `noindex, follow` goes in both the meta tag and the header, with the canonical set to the matching organic page. UTM, gclid, gbraid and wbraid are persisted for the lead.

## B9. Phase 9 — SEO, AEO and GEO system (full detail in `docs/SEO.md`)

- **Q&A depth:** every service has about 6 FAQs (`faqsMore.ts` merges extras by slug), each opening with a quotable direct answer; problem and how-to guides cover the "what do I do" searches.
- **Titles:** `pageMeta` appends " | {brand}" but drops it automatically when the title would exceed about 62 characters.
- **One page per intent:** keep the intent map table (brand/metro → home; "plumber in {city}" → city page; service → service page; problem queries → guide; cost → cost section). The homepage title must **not** compete with the primary city page.
- **`pageMeta()`:** unique title (≤ 60 characters plus the brand template), description of 70–160 characters, self-canonical (LP canonical → organic page), robots, and OG/Twitter with the per-page image.
- **Quality gate (`lib/quality.ts`):** a city needs at least 180 words of unique local copy, at least 2 local issues, ZIPs, at least 3 services and nearby links. A city+service page needs at least 90 local words and a published parent. Failing records get noindex, stay out of sitemaps, or aren't generated at all (`dynamicParams = false` returns a real 404). Fix failures by **writing more real local content, never by lowering thresholds**.
- **Faster indexing:** a canonical apex domain with single-hop www redirects; sitemaps with honest `lastmod`; every page within 2 clicks of home; IndexNow (`public/<key>.txt` + `npm run indexnow`) for Bing and Yandex; Search Console Domain property + sitemap submission + URL Inspection "Request indexing" for key pages (Google does not use IndexNow; don't misuse the Indexing API, which is for job and livestream pages only).
- **Sitemaps:** `/sitemap.xml` indexes `/sitemap-pages.xml`, `-services`, `-locations` and `-guides`, all from `indexableUrls()`. `lastmod` comes from content dates, **never the build time**.
- **robots.ts:** production allows everything except `/api/`, `/thank-you/` and tracking parameters (`utm_`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `kw`, `ref`). Non-production disallows everything. Don't block noindexed pages that must be crawled for the noindex to be seen (`/lp/`, `/request-service/`).
- **Structured data (`lib/schema.ts`):** a connected graph with stable `@id`s. `siteGraph()` in the layout contains the Organization/Plumber (areaServed → city places, `hasOfferCatalog` with each Service defined by `@id`, name and url, `knowsAbout`, conditional contact facts), the WebSite, and City places (→ county → state). Every page emits a `pageGraph()` WebPage (typed CollectionPage, ItemPage, AboutPage or ContactPage, adding FAQPage + Questions only for visible FAQs) with `breadcrumb`, `about` and `mainEntity`, plus Service, local Service (`isRelatedTo` the canonical one) and Article nodes. **Every `@id` referenced on a page must be defined on that page** (the audit checks this).
- **Internal linking:** hierarchy via breadcrumbs, menus and hubs; sideways via related services, nearby towns, town chips, guides, and the state link on city pages. Contextual links come from `createLinker(path)`: a topic → owning-page table, first mention only, no self-links, at most 6 per page, and `[label](/path/)` for explicit links. Target click depth is 3 or less (SteadWell has everything at 2 or less).
- **AEO:** every service and guide opens with a direct 1–3 sentence answer; FAQs answer in the first sentence and are rendered in HTML even when collapsed; one H1 and a logical H2/H3 order.
- **GEO:** "at a glance" `<dl>` blocks; explicit, factual service descriptions; consistent names across nav, headings, schema and sitemaps; `/llms.txt` generated from the indexable URL list.
- **Images:** `next/image` everywhere, `priority` only for above-the-fold heroes and the logo, `sizes` on every image, fixed aspect boxes (CLS 0), natural alt text, descriptive filenames.

## B10. Phase 10 — Analytics and attribution

Events go to `dataLayer`: `call_click`, `emergency_call_click`, `form_start`, `form_step`, `service_selected`, `location_selected`, `form_error`, `form_submit` (only after the server returns 200), `schedule_request`, `quote_request`, `cta_click`. GTM loads after the page is interactive, and only when configured. Attribution uses a 30-day first-party store, channel derivation, and device. Details are in `docs/MEASUREMENT.md`.

## B11. Phase 11 — Security and performance

- **Security:** security headers, JSON-only same-origin lead API, Zod on the server, rate limit, honeypot and timing checks, `<`/`>` stripped from text, HMAC-signed webhook, salted IP hash, no PII in logs or URLs, dev-only admin endpoints, JSON-LD escaped (`<` → `<`).
- **Performance:** every content route is static; client JavaScript is limited to the menus, form, slider, ZIP checker and tracking; fonts via `next/font`; images via `next/image`; asset cache headers. Measured on SteadWell: CLS 0, TTFB about 10ms locally, about 150KB of compressed JavaScript.

## B12. Phase 12 — QA and audit

1. `npx tsc --noEmit`, then `npx next build` (fix every error).
2. `npm start` on a spare port, then `BASE=http://localhost:3002 npm run audit:seo`. **Target: 0 errors.** It checks robots and sitemaps (lastmod, duplicates), status codes, redirect chains, soft 404s, the trailing-slash redirect, parameter canonicals, orphans, BFS click depth, noindex/canonical conflicts, title/description/H1 duplication and near-duplicates, heading skips, alt text, JSON-LD validity, `@id` integrity, rating markup, FAQ visibility, placeholders, lorem ipsum, stock phrases, `llms.txt` links, and cross-origin lead rejection.
3. **Browser checks:** measure `document.documentElement.scrollWidth` against `clientWidth` at 375, 1024, 1280 and 1440 (0 overflow). Take screenshots of the hero, menus, drawer and forms. Submit a real test lead end to end and check `.data/leads.jsonl` plus the `dataLayer` events.
4. **CWV:** use PerformanceObserver for CLS; confirm LCP on the live URL with PageSpeed Insights (a background browser tab won't report LCP).

## B13. Launch checklist

Domain → `NEXT_PUBLIC_SITE_URL`; real phone; verified license/email/hours; 24/7 flag; lead webhook; rate limiter; Google Business Profile + review links; real reviews; legal review; GTM, GA4 and Ads conversions + Consent Mode; audit at 0 errors on staging; submit the sitemap to Google and Bing; Rich Results Test; PageSpeed; set up offline conversion upload (gclid → booked jobs).

## B14. Gotchas we hit (and fixes)

| Problem | Fix |
|---|---|
| `@apply btn` fails in Tailwind v4 | Don't `@apply` custom classes; combine classes in markup |
| Mobile drawer trapped inside the header | The header's `backdrop-filter` makes a containing block; render the drawer with `createPortal` to `document.body` |
| Closed off-canvas drawer caused horizontal scroll | Wrapper `overflow-hidden` + `invisible` when closed |
| Header overflow at 1024/1280 after adding logo spacing | Hide Contact below `xl`, trim link padding, `whitespace-nowrap` on buttons |
| Quick-request button overflowing its box | `minmax(0,…)` grid columns + `min-w-0` on inputs |
| Dynamic `import()` in `next.config.ts` fails | Use a static import |
| `server-only` import | Works in Next without installing |
| Next 16 `params` / `searchParams` | They're Promises: `await params` |
| Stale `.next/types` errors after deleting a route | `rm -rf .next/types .next/dev/types` |
| Two dev servers in one project | Next refuses; reuse the running one (read the port from the log) |
| Iframes blocked in QA | Expected (`X-Frame-Options: DENY`); resize the tab and navigate instead |
| Browser-pane screenshots blank after programmatic scroll | Use wheel `scroll` actions and wait, or verify via DOM measurements |
| sed escaping lost `\d` in a regex | Check regexes after shell edits; prefer Edit/Write for code with backslashes |
| Heredoc with apostrophes failed silently | Use the Write tool for content files |
| Windows `python` opens the Store stub and hangs | Use node for scripting |
| JSON-LD dangling `@id` references (1,728 audit errors) | Define minimal nodes (`@id` + name + url) in the sitewide graph |
| Hardcoded ", NC" appeared on SC towns | `cityLabel()` everywhere; the audit catches it in titles |
| Favicon generator overwrote the owner's files | Check `public/` first; `make-icons.mjs` only fills missing files |
| Suburb pages failed the quality gate | Write more real local content; never lower the threshold |

## B15. Copywriting rules

- Short, concrete sentences. Trade terminology used correctly. Say what to do before the truck arrives.
- The first sentence of every page answers the main question. Cost sections explain the factors, not prices.
- **Banned:** "in today's fast-paced world", "look no further", "your trusted partner", "we understand that", "whether you're…", "comprehensive solutions", "world-class", "one-stop shop", "hassle-free", "state-of-the-art", "peace of mind". The audit flags the most common ones.
- Local content must be *about the place*: housing era, soil, trees, freezes, wells and septic, who issues permits. No city-name swaps.
- Don't claim anything the business hasn't confirmed.

## B16. Checklist for adapting to another trade or city

1. Phase 1 plan with the new trade, market, brand and domain check.
2. `site.ts`: name and primary market. `routes.ts`: service path segment.
3. Replace the content files (`services*`, `locations*` + `regions`, `articles*`, `problems`, `faqs`, `landingPages`, `beforeAfter`).
4. Logo → `process-logo.mjs`; favicons → `npm run icons`; palette tokens from the logo.
5. Photos (Pexels workflow), `categoryPhotos`, `CREDITS.md`.
6. Update the topic table in `lib/linker.tsx` and the `knowsAbout` / description in `lib/schema.ts`.
7. Update the organization description and eyebrows in `lib/og.ts`.
8. Legal pages (state and region).
9. QA (B12), then the launch checklist (B13).

- **Mobile width check (2026-09-27):** `MSYS_NO_PATHCONV=1 BASE=http://localhost:PORT node scripts/width-check.mjs /extra/path/` checks every sitemap URL at 320/375/390/430 for horizontal overflow. FAQ questions and the guide sidebar button now wrap (`min-w-0`, `whitespace-normal`). Result: no overflow.
