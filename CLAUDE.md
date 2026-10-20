# Bench & Sky: project context for Claude Code

Astro static blog about hands-on astronomy ("doing, not just narrating"): telescope builds, space-telescope data pipelines, datasets, experiments. Owner: Nikolaos (software engineer, Athens). Free hosting, full design control, own domain later.

## Decisions already made
- Name: **Bench & Sky** (checked for existing uses, not for domain availability; domain still to be chosen and checked at a registrar).
- Stack: Astro 7 + Markdown content collection, Pagefind search, @astrojs/rss, @astrojs/sitemap. No UI framework yet (add React/Svelte with `npx astro add` when an interactive post needs it).
- Sections (src/site.ts): builds, pipelines, datasets, experiments. Post front matter has "doing" fields: goal, difficulty, time, cost, materials, files.
- Hosting: leaning GitHub Pages (workflow in .github/workflows/deploy.yml) or Cloudflare Pages. GitHub Pages with a private repo needs a paid plan (Pro+), and the published site is still public. Cloudflare Pages / Netlify deploy private repos for free. Not decided.
- SEO: unique URLs, titles, descriptions, canonical, sitemap, robots.txt, RSS, JSON-LD on posts.

## Placeholders to replace
- `site` in astro.config.mjs and the Sitemap line in public/robots.txt (currently https://benchandsky.dev, unchecked).
- The four sample posts in src/content/posts/ (each starts with a "Sample post" note). Their code was not run; verify before publishing.
- Contact section in src/pages/about.astro.
- Camera sensor figures in src/pages/tools/field-of-view.astro are approximate.

## Next steps discussed
1. Per-post social preview images (Open Graph), generated from the title. Currently only the plain "summary" Twitter card, no image.
2. Pick the host, create the repo, deploy.
3. Register with Google Search Console and Bing Webmaster Tools; submit sitemap-index.xml.
4. Possible interactive component for datasets.

## Commands
npm install, npm run dev (no search in dev), npm run build (also builds the Pagefind index), npm run preview.

## Notes
- Verified: `npm run build` succeeds (32 pages), RSS, sitemap, tags, JSON-LD output checked. Not yet viewed in a browser.
- Keep large datasets/images out of the repo (Zenodo, object storage, or Git LFS).
