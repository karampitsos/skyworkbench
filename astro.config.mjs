import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served at the root of the custom domain. If you ever go back to a github.io project URL, add base: '/skyworkbench'.
export default defineConfig({
  site: 'https://skyworkbench.com',
  // Greek lives under /el/ (see src/i18n.ts); the sitemap gets hreflang links between the two versions.
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', el: 'el' } } })],
});
