import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const font = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

// satori reads static .woff files only (not woff2 or variable fonts), so headings use Source Serif 4 here.
const fonts = [
  { name: 'Serif', data: font('source-serif-4', 'source-serif-4-latin-700-normal.woff'), weight: 700 as const },
  { name: 'Serif', data: font('source-serif-4', 'source-serif-4-latin-400-normal.woff'), weight: 400 as const },
  { name: 'Hand', data: font('caveat', 'caveat-latin-700-normal.woff'), weight: 700 as const },
];

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});

export interface OgCard {
  title: string;
  eyebrow?: string; // e.g. "No. 1 · 20 Oct 2026"
  description?: string;
}

/** 1200×630 PNG: cream paper sheet on tan, walnut bar with the site name. */
export async function renderOg({ title, eyebrow, description }: OgCard): Promise<Buffer> {
  const size = title.length > 60 ? 54 : title.length > 40 ? 64 : 76;
  const tree = h('div', { width: 1200, height: 630, flexDirection: 'column', background: '#d8bd94' }, [
    h('div', { height: 96, background: '#2a1a0e', alignItems: 'center', padding: '0 64px', color: '#f6ecd9', fontFamily: 'Serif', fontWeight: 700, fontSize: 38 }, [
      h('div', {}, 'Sky '),
      h('div', { fontFamily: 'Hand', color: '#f0b45a', fontSize: 46, marginLeft: 10 }, 'Workbench'),
    ]),
    h('div', { flex: 1, padding: '44px 64px 56px' }, [
      h('div', { flex: 1, flexDirection: 'column', justifyContent: 'center', background: '#faf3e3', padding: '0 64px', boxShadow: '0 10px 30px rgba(42,26,14,.35)' }, [
        eyebrow ? h('div', { fontFamily: 'Hand', fontWeight: 700, fontSize: 40, color: '#a8472a', marginBottom: 14 }, eyebrow) : null,
        h('div', { fontFamily: 'Serif', fontWeight: 700, fontSize: size, lineHeight: 1.12, color: '#2a1a0e' }, title),
        description
          ? h('div', { fontFamily: 'Serif', fontWeight: 400, fontSize: 30, lineHeight: 1.35, color: '#5b4632', marginTop: 22 }, description.length > 120 ? description.slice(0, 117).trimEnd() + '…' : description)
          : null,
      ].filter(Boolean)),
    ]),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
