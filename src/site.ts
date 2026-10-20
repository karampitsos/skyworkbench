export const SITE = {
  name: 'Sky Workbench',
  tagline: 'Build it. Run it. Look up.',
  description:
    'A hands-on astronomy build log: telescope and mount upgrades, the code that drives them, and the data they collect. Parts lists, costs and what went wrong.',
};

// Prefix a root-relative path with the configured base (empty on the custom domain; e.g. /skyworkbench on a github.io project URL).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => BASE + path;
