// ---------------------------------------------------------------
//  Add noindex to the untranslated language-variant pages.
//
//  The /ja, /pt and /es routes currently serve English (or near
//  duplicate) content and were flagged as thin/low value. They are
//  removed from sitemap.xml (the generator never emits them) and get
//  a noindex robots tag here until they are properly translated.
//  The pages are kept on disk, not deleted.
// ---------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index', 'about', 'archive', 'cognitive-functions', 'compatibility',
  'contact', 'forum', 'functions', 'letters', 'privacy', 'terms', 'types', 'vs'];
const LANGS = ['es', 'ja', 'pt'];

let changed = 0, inserted = 0, already = 0, missing = 0;
for (const lang of LANGS) {
  for (const page of PAGES) {
    const file = path.join(ROOT, lang, `${page}.html`);
    if (!fs.existsSync(file)) { missing++; console.log(`  MISSING ${lang}/${page}.html`); continue; }
    let html = fs.readFileSync(file, 'utf8');
    if (/<meta[^>]*name=["']robots["'][^>]*content=["']noindex/i.test(html)) { already++; continue; }
    if (/<meta[^>]*name=["']robots["'][^>]*>/i.test(html)) {
      html = html.replace(/<meta[^>]*name=["']robots["'][^>]*>/i,
        '<meta name="robots" content="noindex, follow">');
      changed++;
    } else {
      // Insert right after the charset meta, or failing that after <head>.
      if (/<meta[^>]*charset=[^>]*>/i.test(html)) {
        html = html.replace(/(<meta[^>]*charset=[^>]*>)/i,
          '$1\n<meta name="robots" content="noindex, follow">');
      } else {
        html = html.replace(/<head[^>]*>/i, '$&\n<meta name="robots" content="noindex, follow">');
      }
      inserted++;
    }
    fs.writeFileSync(file, html);
  }
}
console.log(`noindex: replaced=${changed} inserted=${inserted} already=${already} missing=${missing}`);
