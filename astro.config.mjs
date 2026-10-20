import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site. With a custom domain later: set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://karampitsos.github.io',
  base: '/benchandsky',
  integrations: [sitemap()],
});
