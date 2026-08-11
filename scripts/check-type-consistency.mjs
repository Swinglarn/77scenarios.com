// ---------------------------------------------------------------
//  77scenarios - type consistency check
//
//  A character page declares its type in the hero badge, the title,
//  the meta keywords, the cognitive-function cards, both section
//  headings and the related-characters list. All of that is baked
//  into the static HTML from people[].type.
//
//  The prose in data/char-content-en.js is written separately, and
//  at one point 47 pages had a journey section that opened by
//  asserting a DIFFERENT type than the page declared - so a reader
//  saw "Churchill is ENTJ" in the verdict and "Winston Churchill's
//  ENTP profile is..." three paragraphs later.
//
//  This catches that. Run it after editing char-content-en.js.
//
//  Usage:
//    node scripts/check-type-consistency.mjs
//    node scripts/check-type-consistency.mjs --verbose   also list near-misses
//
//  Exits 1 if any page contradicts itself, so it can gate a commit.
// ---------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERBOSE = process.argv.includes('--verbose');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Canonical slug - must match slug() in archive.html, fold()+slugSrch()
// in nav.js and slugify() in sync-character-pages.mjs.
const slugify = (n) =>
  n.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0142]/g, 'l').replace(/[\u00f8]/g, 'o').replace(/[\u00e6]/g, 'ae')
    .replace(/[\u0111]/g, 'd').replace(/[\u00df]/g, 'ss')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const people = new Function(read('data/characters-en.js') + '\nreturn people;')().filter(Boolean);
const charContent = new Function(read('data/char-content-en.js') + '\nreturn charContent;')();

const bySlug = new Map();
for (const p of people) if (!bySlug.has(slugify(p.name))) bySlug.set(slugify(p.name), p);

const TYPES = 'INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP';
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const hard = [];   // journey asserts a different type - always a bug
const soft = [];   // a rival type appears in the journey at all - usually fine

for (const [slug, entry] of Object.entries(charContent)) {
  const p = bySlug.get(slug);
  if (!p) { soft.push([slug, 'no character in characters-en.js']); continue; }
  if (!entry.journey) continue;
  const text = strip(entry.journey);

  // "<Name>'s XXXX profile" is the template's own assertion of type.
  const claim = text.match(new RegExp("'s (" + TYPES + ') profile'));
  if (claim && claim[1] !== p.type) hard.push({ name: p.name, slug, page: p.type, says: claim[1] });

  if (VERBOSE) {
    const others = [...new Set(text.match(new RegExp('\\b(?:' + TYPES + ')\\b', 'g')) || [])]
      .filter((t) => t !== p.type);
    if (others.length) soft.push([p.name, 'journey mentions ' + others.join(', ')]);
  }
}

if (hard.length) {
  console.error('FAIL - ' + hard.length + ' page(s) contradict their own declared type:\n');
  for (const h of hard) console.error('  ' + h.name.padEnd(28) + ' page says ' + h.page + ', journey says ' + h.says);
  console.error('\nFix by rewriting the prose to the declared type. Changing people[].type instead');
  console.error('would leave the baked headings, function cards and related lists wrong.');
  process.exit(1);
}

console.log('OK - all ' + Object.keys(charContent).length + ' content entries agree with their declared type.');
if (VERBOSE && soft.length) {
  console.log('\nnear-misses (rival types named in a journey - usually a legitimate contrast):');
  for (const [n, m] of soft) console.log('  ' + n + ': ' + m);
}
