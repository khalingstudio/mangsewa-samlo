// Builds web/data.json from the app's content (published bhajans + approved quotes).
// Run from anywhere:  node build-data.mjs      (re-run whenever the bhajan text changes)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const book = join(here, '..', 'Kirat Bhajan Book');
const dir = join(book, 'content', 'bhajans');

const bhajans = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
  .filter((r) => r.status?.publish === 'published')
  .map((r) => ({
    id: r.id,
    n: r.number,
    t: { ne: r.title.ne, en: r.title.en },
    by: { shabda: r.credits?.shabda ?? { ne: null, en: null }, sangeet: r.credits?.sangeet ?? { ne: null, en: null } },
    v: r.verses.map((v) => ({ ne: v.lines_ne, en: v.lines_en })),
  }));

const q = JSON.parse(readFileSync(join(book, 'content', 'quotes.json'), 'utf8')).quotes.filter((x) => x.status === 'approved')
  .map((x) => ({ ne: x.text_ne, en: x.text_en, by: { ne: x.attribution_ne, en: x.attribution_en } }));

mkdirSync(join(here, 'docs'), { recursive: true });
writeFileSync(join(here, 'docs', 'data.json'), JSON.stringify({ built: new Date().toISOString().slice(0, 10), bhajans, quotes: q }));
copyFileSync(join(book, 'app', 'assets', 'logo-256.png'), join(here, 'docs', 'logo.png'));
copyFileSync(join(book, 'app', 'assets', 'favicon.png'), join(here, 'docs', 'favicon.png'));
console.log(`web/data.json: ${bhajans.length} bhajans, ${q.length} quotes`);

// About / Help / Privacy text
const { pages } = await import('./pages.mjs');
writeFileSync(join(here, 'docs', 'pages.json'), JSON.stringify(pages));
console.log('web/pages.json written');
