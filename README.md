# Sky Workbench

A hands-on astronomy lab notebook built with [Astro](https://astro.build). Static site, Markdown posts, full-text search (Pagefind), RSS, sitemap, tag pages, and a red night-vision mode.

## Run it

```bash
npm install
npm run dev          # http://localhost:4321  (search is not available in dev)
npm run build        # builds to dist/ and creates the search index
npm run preview      # serve the built site, including search
```

Needs Node 18.20+ (developed on Node 22).

## Write a post

Add a Markdown file to `src/content/posts/`. The file name becomes the URL (`my-build.md` → `/posts/my-build/`).

```md
---
title: "My build"
description: "One sentence for search results and social previews."
section: builds            # builds | pipelines | datasets | experiments
date: 2026-11-02
tags: ["Telescope", "3D printing"]
# optional "doing" summary box:
goal: "What this achieves"
difficulty: easy           # easy | medium | hard
time: "2 hours"
cost: "€25"
materials: ["PLA filament", "M5 bolts"]
files:
  - label: "STL files (Zenodo)"
    href: "https://zenodo.org/..."
draft: false               # true hides it from production builds
---

Your content here.
```

Keep large datasets and images off the repo: host them on Zenodo, object storage or Git LFS and link them in `files`.

## Before you publish

1. Set your real address in `astro.config.mjs` (`site`) and in `public/robots.txt`.
2. The name and tagline live in `src/site.ts`.

## Deploy

- **GitHub Pages:** push to a repo's `main` branch, then in *Settings → Pages* choose *GitHub Actions*. The included workflow builds and deploys. For a project site (`user.github.io/repo`), also set `base: '/repo'` in `astro.config.mjs`.
- **Cloudflare Pages / Netlify:** connect the repo, build command `npm run build`, output directory `dist`.

## Structure

```
src/content/posts/   your Markdown posts
src/pages/           routes (home, tags, posts, about, search, rss)
src/layouts/Base.astro   head tags, nav, red-mode toggle
src/styles/global.css    all styling and colour variables
src/site.ts          name, tagline
```

## Interactive components

For an interactive post you can add React or Svelte with `npx astro add react`.
