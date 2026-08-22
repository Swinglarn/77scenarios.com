// ---------------------------------------------------------------
//  Keep AdSense off pages that do not carry enough content to justify it.
//
//  AdSense flagged the site for "low value content". The 1,047 content pages
//  are fine (character pages measure ~96% unique text, ~1,400 unique words),
//  but the ad loader was also present on client-rendered shells and utility
//  pages: /vs served six visible words to a crawler with an ad unit on it,
//  and several /ja pages served ads on 132-word untranslated stubs.
//
//  This runs after any build that regenerates pages (apply.mjs rewrites
//  es/index.html and ja/index.html from the English source, which carries the
//  loader), so it has to be idempotent and re-runnable.
//
//  Usage:
//    node scripts/ads-policy.mjs            strip the loader from the list
//    node scripts/ads-policy.mjs --check    report only
//    node scripts/ads-policy.mjs --audit    list every ad page under the floor
// ---------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const AUDIT = args.includes('--audit');

// Minimum visible words before a page may carry ads.
const WORD_FLOOR = 300;

// Pages the loader must never appear on. Shells that render client-side,
// utility pages, and the language stubs that are not translated yet.
const NO_ADS = [
  'compatibility.html',   // hub renders client-side: 178
  'forum.html',           // 2 threads, 1 reply
  'contact.html',         // utility
  'functions.html',       // 247
  ...['es', 'ja', 'pt'].flatMap((l) =>
    ['index', 'types', 'letters', 'cognitive-functions'].map((p) => `${l}/${p}.html`))
];

// Templates the prerenderer renders from. Stripping the loader from one of
// these silently removes ads from every page baked out of it: vs.html alone
// feeds 134 /vs/* pages. The thin-hub problem for /vs is fixed by giving the
// hub real content, not by removing its ads.
const PRERENDER_SOURCES = new Set([
  'vs.html', 'type.html', 'letter.html', 'compatibility-pair.html', 'archive.html'
]);

const LOADER = /[ \t]*<script[^>]*adsbygoogle\.js[^>]*><\/script>[ \t]*\r?\n?/gi;

const visibleWords = (html) => {
  const t = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  return (t.match(/\S+/g) || []).length;
};

let stripped = 0, alreadyClean = 0, missing = 0;
for (const rel of NO_ADS) {
  if (PRERENDER_SOURCES.has(rel)) {
    console.log(`  REFUSED  ${rel} is a prerender source; stripping it would unpublish ads on every page built from it`);
    continue;
  }
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { missing++; console.log(`  missing  ${rel}`); continue; }
  const before = fs.readFileSync(file, 'utf8');
  if (!/adsbygoogle\.js/i.test(before)) { alreadyClean++; continue; }
  const after = before.replace(LOADER, '');
  if (/adsbygoogle\.js/i.test(after)) { console.log(`  ! could not strip ${rel}`); continue; }
  if (!CHECK) fs.writeFileSync(file, after, 'utf8');
  stripped++;
  console.log(`  ${CHECK ? 'would strip' : 'stripped  '} ${rel.padEnd(30)} (${visibleWords(before)} visible words)`);
}
console.log(`\n${CHECK ? 'would strip' : 'stripped'} ${stripped}, already clean ${alreadyClean}, missing ${missing}`);

if (AUDIT) {
  // Anything still serving ads below the floor is a candidate for the list.
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.name === 'node_modules' || d.name.startsWith('.')) return [];
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : (d.name.endsWith('.html') ? [p] : []);
  });
  const thin = [];
  for (const f of walk(ROOT)) {
    const h = fs.readFileSync(f, 'utf8');
    if (!/adsbygoogle\.js/i.test(h)) continue;
    const w = visibleWords(h);
    if (w < WORD_FLOOR) thin.push([path.relative(ROOT, f).split(path.sep).join(String.fromCharCode(47)), w]);
  }
  console.log(`\nstill serving ads under ${WORD_FLOOR} visible words: ${thin.length}`);
  for (const [f, w] of thin.sort((a, b) => a[1] - b[1]).slice(0, 40)) {
    console.log(`  ${String(w).padStart(5)}  ${f}`);
  }
}
