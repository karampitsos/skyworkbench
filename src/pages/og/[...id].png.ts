import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, formatDate, entryNumbers } from '../../lib/posts';
import { renderOg, type OgCard } from '../../lib/og';
import { SITE } from '../../site';

// The image() metadata has no path on disk, so read the cover path from the post's front matter.
function coverPath(filePath?: string): string | undefined {
  if (!filePath) return undefined;
  const m = readFileSync(filePath, 'utf8').match(/^cover:\s*["']?([^"'\n]+?)["']?\s*$/m);
  return m ? resolve(dirname(filePath), m[1]) : undefined;
}

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const numbers = entryNumbers(posts);
  const cards: { params: { id: string }; props: { card: OgCard } }[] = posts.map((p) => ({
    params: { id: p.id },
    props: { card: { title: p.data.title, eyebrow: `${numbers.get(p.id)} · ${formatDate(p.data.date)}`, description: p.data.description, cover: p.data.cover ? coverPath(p.filePath) : undefined } },
  }));
  cards.push({ params: { id: 'default' }, props: { card: { title: SITE.tagline, description: 'Telescope builds, space-telescope data pipelines, datasets and experiments.' } } });
  return cards;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props.card as OgCard), { headers: { 'Content-Type': 'image/png' } });
