import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, formatDate } from '../../lib/posts';
import { renderOg, type OgCard } from '../../lib/og';
import { LANGS, t } from '../../i18n';

// The image() metadata has no path on disk, so read the cover path from the post's front matter.
function coverPath(filePath?: string): string | undefined {
  if (!filePath) return undefined;
  const m = readFileSync(filePath, 'utf8').match(/^cover:\s*["']?([^"'\n]+?)["']?\s*$/m);
  return m ? resolve(dirname(filePath), m[1]) : undefined;
}

const DEFAULT_DESCRIPTION = {
  en: 'Telescope builds, space-telescope data pipelines, datasets and experiments.',
  el: 'Κατασκευές τηλεσκοπίων, επεξεργασία δεδομένων διαστημικών τηλεσκοπίων, σύνολα δεδομένων και πειράματα.',
};

// Greek cards live under /og/el/: post ids of Greek posts already start with "el/".
export const getStaticPaths = (async () => {
  const cards: { params: { id: string }; props: { card: OgCard } }[] = [];
  for (const lang of LANGS) {
    const T = t(lang);
    const posts = await getPosts(lang);
    for (const p of posts) {
      cards.push({
        params: { id: p.id },
        props: { card: { title: p.data.title, eyebrow: formatDate(p.data.date, lang), description: p.data.description, cover: p.data.cover ? coverPath(p.filePath) : undefined } },
      });
    }
    cards.push({ params: { id: lang === 'el' ? 'el/default' : 'default' }, props: { card: { title: T.tagline, description: DEFAULT_DESCRIPTION[lang] } } });
  }
  return cards;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props.card as OgCard), { headers: { 'Content-Type': 'image/png' } });
