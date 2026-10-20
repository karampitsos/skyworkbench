export const SITE = {
  name: 'Sky Workbench',
  tagline: 'Hacking the sky, one arcsecond at a time.',
  description:
    'Hands-on astronomy for people who would rather build the thing than read about it: reproducible projects with the goal, what it took, what happened, and the files to try it yourself.',
};

// Prefix a root-relative path with the configured base (empty on the custom domain; e.g. /skyworkbench on a github.io project URL).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => BASE + path;
