import { url } from './site';

export const LANGS = ['en', 'el'] as const;
export type Lang = (typeof LANGS)[number];

/** For `[...lang]` routes: English at the root, Greek under /el/. */
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'el' } }];
export const toLang = (param: string | undefined): Lang => (param === 'el' ? 'el' : 'en');

/** Internal link in the given language: lurl('el', '/about/') -> '/el/about/'. */
export const lurl = (lang: Lang, path: string) => url(lang === 'el' ? `/el${path}` : path);

/** Strip the /el prefix (and base) to get the language-neutral path. */
export function neutralPath(pathname: string): string {
  const base = url('');
  let p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  if (p === '/el' || p.startsWith('/el/')) p = p.slice(3) || '/';
  return p || '/';
}

const UI = {
  en: {
    siteDescription:
      "Nikos's logbook of astronomy adventures: telescope builds, code and data, shared with anyone curious to learn, try, or just enjoy the ride.",
    tagline: 'From the workbench to the stars.',
    home: 'home',
    navLog: 'Log',
    navAbout: 'About',
    navSearch: 'Search',
    redLight: 'Red light',
    redLightTitle: 'Toggle red night-vision mode',
    switchLabel: 'ΕΛ',
    switchTitle: 'Ελληνικά',
    clearSkies: 'clear skies!',
    tags: 'Tags',
    entry: 'No.',
    goal: 'Goal',
    difficulty: 'Difficulty',
    time: 'Time',
    cost: 'Cost',
    materials: 'Bill of materials',
    files: 'Files',
    onThisPage: 'On this page',
    minRead: 'min read',
    previous: 'Previous',
    next: 'Next',
    backToLog: '← Logbook',
    projectSummary: 'Project summary',
    levels: { easy: 'easy', medium: 'medium', hard: 'hard' },
  },
  el: {
    siteDescription:
      'Το ημερολόγιο των αστρονομικών περιπετειών του Νίκου: κατασκευές τηλεσκοπίων, κώδικας και δεδομένα, για όποιον θέλει να μάθει, να δοκιμάσει ή να απολαύσει.',
    tagline: 'Από τον πάγκο εργασίας στα αστέρια.',
    home: 'αρχική',
    navLog: 'Ημερολόγιο',
    navAbout: 'Σχετικά',
    navSearch: 'Αναζήτηση',
    redLight: 'Κόκκινο φως',
    redLightTitle: 'Εναλλαγή κόκκινης νυχτερινής λειτουργίας',
    switchLabel: 'EN',
    switchTitle: 'English',
    clearSkies: 'καθαρούς ουρανούς!',
    tags: 'Ετικέτες',
    entry: 'Αρ.',
    goal: 'Στόχος',
    difficulty: 'Δυσκολία',
    time: 'Χρόνος',
    cost: 'Κόστος',
    materials: 'Υλικά',
    files: 'Αρχεία',
    onThisPage: 'Σε αυτή τη σελίδα',
    minRead: 'λεπτά ανάγνωσης',
    previous: 'Προηγούμενο',
    next: 'Επόμενο',
    backToLog: '← Ημερολόγιο',
    projectSummary: 'Σύνοψη έργου',
    levels: { easy: 'εύκολο', medium: 'μέτριο', hard: 'δύσκολο' },
  },
} as const;

export const t = (lang: Lang) => UI[lang];
