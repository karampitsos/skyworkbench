export const SITE = {
  name: 'Sky Workbench',
  tagline: 'Build it. Run it. Look up.',
  description:
    'A hands-on astronomy lab notebook: telescope builds, space-telescope data pipelines, datasets and experiments you can reproduce.',
};

export const SECTIONS = {
  builds: {
    label: 'Builds',
    blurb: 'Telescope mods, mounts and tracking rigs. Parts lists, costs, and what went wrong.',
    icon: '⚙',
  },
  pipelines: {
    label: 'Pipelines',
    blurb: 'Code that turns JWST, TESS, Gaia and Hubble data into results. Runnable and reproducible.',
    icon: '⌁',
  },
  datasets: {
    label: 'Datasets',
    blurb: 'Curated downloads with notes on how to use them.',
    icon: '▦',
  },
  experiments: {
    label: 'Experiments',
    blurb: 'I tried X. Here are the numbers.',
    icon: '◎',
  },
} as const;

export type SectionKey = keyof typeof SECTIONS;

// Prefix a root-relative path with the configured base (empty on the custom domain; e.g. /skyworkbench on a github.io project URL).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => BASE + path;
