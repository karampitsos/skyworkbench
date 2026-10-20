# Sky Workbench: project context for Claude Code

Astro static blog about hands-on astronomy ("doing, not just narrating"): telescope builds, space-telescope data pipelines, datasets, experiments. Owner: Nikolaos (software engineer, Athens). Free hosting, full design control, own domain.

## Decisions already made
- Name: **Sky Workbench** (renamed from Bench & Sky on 2026-10-20 because benchandsky.com was taken). Domain skyworkbench.com bought at Cloudflare Registrar on 2026-10-20 (DNS at Cloudflare, records DNS-only, verified on GitHub). Only name clash found: ACI Sky Workbench (real-estate appraisal software, unrelated).
- Stack: Astro 7 + Markdown content collection, Pagefind search, @astrojs/rss, @astrojs/sitemap. No UI framework yet (add React/Svelte with `npx astro add` when an interactive post needs it).
- No categories for now (decided 2026-10-20): one chronological "drawing register" on the homepage; section pages removed. `section` stays in the schema as optional so grouping can return. Post front matter has "doing" fields: goal, difficulty, time, cost, materials, files.
- Design (2026-10-20, replaced a short-lived blueprint style): warm workbench. Wood-grain table background (src/assets/textures/wood.svg, feTurbulence) under a warm lamp; content on cream paper sheets (`.paper` swaps tokens to dark ink). Fonts self-hosted via @fontsource: Fraunces (headings), Source Serif 4 (body), Caveat (handwriting), IBM Plex Mono (code). Homepage: handwritten FOV derivation note + mirror/cloth/pencil; posts listed in a ruled "Logbook", numbered No. 1… by publish order (entryNumbers in src/lib/posts.ts). Red night mode kept. No personal location on the site.
- Hosting: GitHub Pages, public repo github.com/karampitsos/skyworkbench, live at https://skyworkbench.com (custom domain set in repo Pages settings; github.io URL redirects). Deployed by .github/workflows/deploy.yml on push to main.
- No `base` now (site at domain root), but keep building internal links with `url('/path/')` from src/site.ts so a base can be reintroduced. In Markdown posts use relative links.
- SEO: unique URLs, titles, descriptions, canonical, sitemap, robots.txt, RSS, JSON-LD on posts.

## Placeholders to replace
- Camera sensor figures in src/pages/tools/field-of-view.astro are approximate.

## Next steps discussed
0. First real post: build-log series "Bresser EQ-3 to GoTo". Part 1 (src/content/posts/eq3-goto-part-1.md, draft) written from Nikolaos's docx; needs photos. Part 2 = firmware from private repo karampitsos/franke (Arduino UNO R4 WiFi + CNC Shield V3, AccelStepper, LX200 subset, LST/hour-angle model; used with Ekos via LX200 GPS driver, GoTo + guiding tested). Never publish the Grobotronics order PDFs or Drive links (contain home address/phone).
1. Per-post social preview images (Open Graph), generated from the title. Currently only the plain "summary" Twitter card, no image.
2. Register with Google Search Console and Bing Webmaster Tools; submit sitemap-index.xml.
3. Possible interactive component for datasets.

## Commands
npm install, npm run dev (no search in dev), npm run build (also builds the Pagefind index), npm run preview.

## Notes
- Local default Node is 16 (too old); use nvm Node 23 (`nvm use 23`).
- Verified: `npm run build` succeeds, RSS, sitemap, tags, JSON-LD output checked. Not yet viewed in a browser.
- Keep large datasets/images out of the repo (Zenodo, object storage, or Git LFS).
