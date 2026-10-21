// Tagline and description are per language, in src/i18n.ts.
export const SITE = {
  name: 'Sky Workbench',
};

// Prefix a root-relative path with the configured base (empty on the custom domain; e.g. /skyworkbench on a github.io project URL).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => BASE + path;
