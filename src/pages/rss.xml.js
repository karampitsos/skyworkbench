import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import { SITE, url } from '../site';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: new URL(url('/'), context.site).toString(),
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: url(`/posts/${p.id}/`),
      categories: [p.data.section, ...p.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
