// ---------------------------------------------------------------
//  Extract every translatable string out of the English source into
//  i18n/en.json, keyed by a stable id.
//
//  Ids are content-addressed by position, not by text, so re-wording an
//  English string keeps its id and the translation is flagged stale rather
//  than lost. Structural values (dim, fn, stack, compat, type codes) are
//  never emitted: they are data, not copy.
//
//  Usage: node scripts/i18n/extract.mjs [--report]
// ---------------------------------------------------------------

import { ROOT, I18N, read, write, evalLiteral } from './lib.mjs';
import path from 'node:path';
import { scanUI } from './ui-scan.mjs';

const src = read('index.html');
const out = {};
const add = (key, value) => {
  if (typeof value !== 'string') return;
  const v = value.trim();
  if (!v) return;
  if (out[key] !== undefined && out[key] !== v) {
    console.warn(`  ! id collision on ${key}`);
  }
  out[key] = v;
};

// ── scenarios ──────────────────────────────────────────────────
// Keyed by pool + index. The pools are fixed-length authored lists, so index
// is stable; `scene` is not unique enough to key on (several share a title).
let scenarioCount = 0;
for (const pool of ['questionsNormal', 'questionsMyth', 'questionsBoth']) {
  const arr = evalLiteral(src, pool);
  if (!Array.isArray(arr)) { console.warn(`  ! ${pool} not found`); continue; }
  arr.forEach((q, i) => {
    for (const field of ['scene', 'text', 'a', 'b']) {
      add(`q.${pool}.${i}.${field}`, q[field]);
    }
    scenarioCount++;
  });
}

// ── type data ──────────────────────────────────────────────────
const typeData = evalLiteral(src, 'typeData') || {};
for (const [t, d] of Object.entries(typeData)) {
  add(`type.${t}.name`, d.name);
  add(`type.${t}.tagline`, d.tagline);
  add(`type.${t}.description`, d.description);
  (d.traits || []).forEach((v, i) => add(`type.${t}.traits.${i}`, v));
}

// ── type extra ─────────────────────────────────────────────────
// stack and compat are type codes and must not be translated. `rarity` is a
// numeric range with a percent sign and is left alone too.
const typeExtra = evalLiteral(src, 'typeExtra') || {};
for (const [t, d] of Object.entries(typeExtra)) {
  add(`extra.${t}.rarityLine`, d.rarityLine);
  add(`extra.${t}.best`, d.best);
  add(`extra.${t}.stress`, d.stress);
  (d.strengths || []).forEach((v, i) => add(`extra.${t}.strengths.${i}`, v));
  (d.blindspots || []).forEach((v, i) => add(`extra.${t}.blindspots.${i}`, v));
}

// ── cognitive functions ────────────────────────────────────────
const fnInfo = evalLiteral(src, 'fnInfo') || {};
for (const [fn, desc] of Object.entries(fnInfo)) add(`fn.${fn}`, desc);
const fnPos = evalLiteral(src, 'fnPos') || [];
fnPos.forEach((v, i) => add(`fnpos.${i}`, v));

// ── result-screen copy added alongside the evidence block ──────
const MODE_LABEL = evalLiteral(src, 'MODE_LABEL') || {};
for (const [k, v] of Object.entries(MODE_LABEL)) add(`mode.${k}`, v);
const AXIS_LABEL = evalLiteral(src, 'AXIS_LABEL') || {};
for (const [k, v] of Object.entries(AXIS_LABEL)) add(`axis.${k}`, v);
const FN_FULL = evalLiteral(src, 'FN_FULL') || {};
for (const [k, v] of Object.entries(FN_FULL)) add(`fnfull.${k}`, v);
const EV_TEXT = evalLiteral(src, 'EV_TEXT') || {};
for (const [k, v] of Object.entries(EV_TEXT)) add(`ev.${k}`, v);

// ── UI markup ──
// Text nodes, translatable attributes, <title> and the prose-bearing meta
// tags. Content-addressed ids, so identical copy anywhere on the site shares
// one translation.
let uiCount = 0;
for (const s of scanUI(src)) { add(s.key, s.text); uiCount++; }
console.log(`  ui markup: ${uiCount} spans`);

write(path.join(I18N, 'en.json'), JSON.stringify(out, null, 2) + '\n');

const byPrefix = {};
for (const k of Object.keys(out)) {
  const p = k.split('.')[0];
  byPrefix[p] = (byPrefix[p] || 0) + 1;
}
const words = (s) => (s.match(/\S+/g) || []).length;
const totalWords = Object.values(out).reduce((a, s) => a + words(s), 0);

console.log(`extracted ${Object.keys(out).length} strings (${totalWords.toLocaleString()} words) from index.html`);
for (const [p, n] of Object.entries(byPrefix).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${p.padEnd(10)} ${String(n).padStart(5)}`);
}
console.log(`\nwrote i18n/en.json`);

if (process.argv.includes('--report')) {
  const longest = Object.entries(out).sort((a, b) => words(b[1]) - words(a[1])).slice(0, 5);
  console.log('\nlongest strings:');
  for (const [k, v] of longest) console.log(`  ${String(words(v)).padStart(4)}w  ${k}  ${v.slice(0, 70)}...`);
}
