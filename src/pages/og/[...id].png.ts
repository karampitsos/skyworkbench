import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, formatDate, entryNumbers } from '../../lib/posts';
import { renderOg, type OgCard } from '../../lib/og';
import { SITE } from '../../site';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const numbers = entryNumbers(posts);
  const cards: { params: { id: string }; props: { card: OgCard } }[] = posts.map((p) => ({
    params: { id: p.id },
    props: { card: { title: p.data.title, eyebrow: `${numbers.get(p.id)} · ${formatDate(p.data.date)}`, description: p.data.description } },
  }));
  cards.push({ params: { id: 'default' }, props: { card: { title: SITE.tagline, description: 'Telescope builds, space-telescope data pipelines, datasets and experiments.' } } });
  return cards;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props.card as OgCard), { headers: { 'Content-Type': 'image/png' } });
