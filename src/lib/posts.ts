import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Post = CollectionEntry<'posts'>;

/** Greek translations live in src/content/posts/el/ with the same file name as the English post. */
export const postLang = (p: Post): Lang => (p.id.startsWith('el/') ? 'el' : 'en');
/** The URL slug, shared by a post and its translation. */
export const postSlug = (p: Post) => p.id.replace(/^el\//, '');

/** All non-draft posts in one language, newest first. Drafts still show in `astro dev`. */
export async function getPosts(lang: Lang = 'en'): Promise<Post[]> {
  const all = await getCollection('posts', (p) =>
    postLang(p) === lang && (import.meta.env.PROD ? !p.data.draft : true),
  );
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id));
}

/** Reading time at ~200 words a minute, ignoring link targets and HTML tags. */
export function readingMinutes(post: Post): number {
  const text = (post.body ?? '').replace(/\]\([^)]*\)/g, ']').replace(/<[^>]+>/g, ' ');
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(d: Date, lang: Lang = 'en'): string {
  return d.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Map of tag slug -> { label, posts } */
export function groupByTag(posts: Post[]) {
  const map = new Map<string, { label: string; posts: Post[] }>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      const slug = slugifyTag(t);
      if (!map.has(slug)) map.set(slug, { label: t, posts: [] });
      map.get(slug)!.posts.push(p);
    }
  }
  return map;
}
