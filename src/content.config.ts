import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Not shown on the site for now; kept so posts can be grouped again later.
    section: z.enum(['builds', 'pipelines', 'datasets', 'experiments']).optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // "Doing" metadata: shown in a summary box on the post.
    goal: z.string().optional(),
    cost: z.string().optional(),
    time: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    materials: z.array(z.string()).default([]),
    files: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

export const collections = { posts };
