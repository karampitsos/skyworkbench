import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postSlug } from './posts';
import { SITE } from '../site';
import { lurl, t, type Lang } from '../i18n';

export async function feed(context: APIContext, lang: Lang) {
  const posts = await getPosts(lang);
  return rss({
    title: SITE.name,
    description: t(lang).siteDescription,
    site: new URL(lurl(lang, '/'), context.site).toString(),
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: lurl(lang, `/posts/${postSlug(p)}/`),
      categories: p.data.tags,
    })),
    customData: `<language>${lang}</language>`,
  });
}
