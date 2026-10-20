# Sky Workbench: project context for Claude Code

Astro static blog about hands-on astronomy ("doing, not just narrating"): telescope builds, space-telescope data pipelines, datasets, experiments. Owner: Nikolaos (software engineer, Athens). Free hosting, full design control, own domain.

## Decisions already made
- Name: **Sky Workbench** (renamed from Bench & Sky on 2026-10-20 because benchandsky.com was taken). Domain skyworkbench.com bought at Cloudflare Registrar on 2026-10-20 (DNS at Cloudflare, records DNS-only, verified on GitHub). Only name clash found: ACI Sky Workbench (real-estate appraisal software, unrelated).
- Stack: Astro 7 + Markdown content collection, Pagefind search, @astrojs/rss, @astrojs/sitemap. No UI framework yet (add React/Svelte with `npx astro add` when an interactive post needs it).
- No categories for now (decided 2026-10-20): one chronological "drawing register" on the homepage; section pages removed. `section` stays in the schema as optional so grouping can return. Post front matter has "doing" fields: goal, difficulty, time, cost, materials, files.
- Design (2026-10-20, replaced a short-lived blueprint style): warm workbench. Sketchbook background (2026-10-20, replaced wood): warm tan paper (#d8bd94) with a large sparse tile of faint pencil doodles (src/assets/textures/doodles.svg: gear, pulleys+belt, orbit, Saturn, telescope, reticle, constellation, Moon, galaxy, stars) plus paper-noise.webp fiber texture, under a warm lamp glow; dark ink text directly on it; header/footer are dark walnut bars with cream text; content on cream paper sheets (`.paper` swaps tokens to dark ink). Fonts self-hosted via @fontsource: Fraunces (headings), Source Serif 4 (body), Caveat (handwriting), IBM Plex Mono (code). Homepage: handwritten FOV derivation note (decorative; mirror/cloth/pencil props removed 2026-10-20; the FOV calculator tool and /tools/ section were removed 2026-10-20); posts listed in a ruled "Logbook", numbered No. 1… by publish order (entryNumbers in src/lib/posts.ts). Red night mode kept. No personal location on the site.
- Hosting: GitHub Pages, public repo github.com/karampitsos/skyworkbench, live at https://skyworkbench.com (custom domain set in repo Pages settings; github.io URL redirects). Deployed by .github/workflows/deploy.yml on push to main.
- No `base` now (site at domain root), but keep building internal links with `url('/path/')` from src/site.ts so a base can be reintroduced. In Markdown posts use relative links.
- SEO: unique URLs, titles, descriptions, canonical, sitemap, robots.txt, RSS, JSON-LD on posts.

## Next steps discussed
0. First real post: build-log series "Bresser EQ-3 to GoTo". Part 1 (src/content/posts/eq3-goto-part-1.md) PUBLISHED 2026-10-20 as No. 1. Media: src/assets/posts/eq3-goto/ (photos, metadata stripped), public/media/eq3-goto/ (first-spin video, trimmed/cropped, no audio). Final drivers are TMC2209 V1.2 UART (2 × €6.90) run in STEP/DIR mode. Unused for Part 2: Bubble Nebula?, NGC 6946?, globular (M13/M92?) images in ~/Downloads, objects unconfirmed; subs ≤15 s stacked in Siril. Possible separate post: cleaning the primary mirror (photo IMG_20251125_164657). Part 1 links to Part 2. Galaxy (NGC 6946?) and globular (M13/M92?) images still unidentified and unused; Bubble Nebula confirmed and used in Part 2. Camera: ZWO ASI662MC on a Bresser Newtonian; first-light images were tracking only (no guiding). Firmware written with Claude Code; calibration tuned in the field via GoTos. Part 2 (src/content/posts/eq3-goto-part-2.md) PUBLISHED 2026-10-20 as No. 2 = firmware from repo karampitsos/eq3-goto-firmware (was private 'franke'; made public with README + MIT on 2026-10-20) (Arduino UNO R4 WiFi + CNC Shield V3, AccelStepper, LX200 subset, LST/hour-angle model; used with Ekos via LX200 GPS driver, GoTo + guiding tested). Never publish the Grobotronics order PDFs or Drive links (contain home address/phone).
1. Per-post social preview images (Open Graph), generated from the title. Currently only the plain "summary" Twitter card, no image.
2. Register with Google Search Console and Bing Webmaster Tools; submit sitemap-index.xml.
3. Possible interactive component for datasets.

## Commands
npm install, npm run dev (no search in dev), npm run build (also builds the Pagefind index), npm run preview.

## Notes
- Mobile scroll performance (fixed 2026-10-20): no `background-attachment: fixed`, no `backdrop-filter`, no live SVG filters (feTurbulence) in CSS backgrounds. The paper texture is a pre-rendered tile, src/assets/textures/paper-noise.webp.
- Local default Node is 16 (too old); use nvm Node 23 (`nvm use 23`).
- Verified: `npm run build` succeeds, RSS, sitemap, tags, JSON-LD output checked. Not yet viewed in a browser.
- Keep large datasets/images out of the repo (Zenodo, object storage, or Git LFS).
