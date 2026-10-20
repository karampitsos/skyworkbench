# Bench & Sky: project context for Claude Code

Astro static blog about hands-on astronomy ("doing, not just narrating"): telescope builds, space-telescope data pipelines, datasets, experiments. Owner: Nikolaos (software engineer, Athens). Free hosting, full design control, own domain later.

## Decisions already made
- Name: **Bench & Sky** (checked for existing uses, not for domain availability; domain still to be chosen and checked at a registrar).
- Stack: Astro 7 + Markdown content collection, Pagefind search, @astrojs/rss, @astrojs/sitemap. No UI framework yet (add React/Svelte with `npx astro add` when an interactive post needs it).
- Sections (src/site.ts): builds, pipelines, datasets, experiments. Post front matter has "doing" fields: goal, difficulty, time, cost, materials, files.
- Hosting: GitHub Pages, public repo github.com/karampitsos/benchandsky, live at https://karampitsos.github.io/benchandsky/. Deployed by .github/workflows/deploy.yml on push to main.
- `base: '/benchandsky'` in astro.config.mjs: always build internal links with `url('/path/')` from src/site.ts, never a bare "/path". In Markdown posts use relative links. With a custom domain: set `site` to it, remove `base`, update robots.txt.
- SEO: unique URLs, titles, descriptions, canonical, sitemap, robots.txt, RSS, JSON-LD on posts.

## Placeholders to replace
- The four sample posts in src/content/posts/ (each starts with a "Sample post" note). Their code was not run; verify before publishing.
- Contact section in src/pages/about.astro.
- Camera sensor figures in src/pages/tools/field-of-view.astro are approximate.

## Next steps discussed
1. Per-post social preview images (Open Graph), generated from the title. Currently only the plain "summary" Twitter card, no image.
2. Custom domain (optional).
3. Register with Google Search Console and Bing Webmaster Tools; submit sitemap-index.xml.
4. Possible interactive component for datasets.

## Commands
npm install, npm run dev (no search in dev), npm run build (also builds the Pagefind index), npm run preview.

## Notes
- Local default Node is 16 (too old); use nvm Node 23 (`nvm use 23`).
- Verified: `npm run build` succeeds (32 pages), RSS, sitemap, tags, JSON-LD output checked. Not yet viewed in a browser.
- Keep large datasets/images out of the repo (Zenodo, object storage, or Git LFS).
