import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** All non-draft posts, newest first. Drafts still show in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Logbook entry numbers in publication order: the first post is "No. 1". */
export function entryNumbers(posts: Post[]): Map<string, string> {
  const ordered = [...posts].sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf() || a.id.localeCompare(b.id));
  return new Map(ordered.map((p, i) => [p.id, `No. ${i + 1}`]));
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
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
