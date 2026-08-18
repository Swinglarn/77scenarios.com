// ---------------------------------------------------------------
//  Harvest translations that already exist in the legacy /es and /ja pages
//  into the catalog, so the rebuild keeps the work already done.
//
//  Harvesting by array index is only safe if the legacy array is actually the
//  same list in the same order as English. That is checked first, against the
//  structural fields (dim, fn) which were never translated: if those sequences
//  do not match position-for-position, the pool is skipped rather than
//  harvested into misaligned ids.
//
//  A value identical to English is not recorded as a translation.
//
//  Usage: node scripts/i18n/harvest.mjs es [--write]
// ---------------------------------------------------------------

import { read, exists, evalLiteral, loadCatalog, saveCatalog, I18N } from './lib.mjs';
import path from 'node:path';

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const lang = args.find((a) => !a.startsWith('--'));
if (!lang) { console.error('name a language'); process.exit(1); }

const legacyPath = `${lang}/index.html`;
if (!exists(legacyPath)) { console.error(`no ${legacyPath}`); process.exit(1); }

const en = read('index.html');
const legacy = read(legacyPath);
const enCat = JSON.parse(read(path.join(I18N, 'en.json')));
const cat = loadCatalog(lang);

let taken = 0, skipped = 0, sameAsEn = 0;
const notes = [];
const put = (key, value) => {
  if (typeof value !== 'string') return;
  const v = value.trim();
  if (!v) return;
  if (!(key in enCat)) return;             // not a string we track
  if (v === enCat[key]) { sameAsEn++; return; }  // untranslated in the legacy page
  cat[key] = v;
  taken++;
};

// ── scenarios, guarded by structural alignment ─────────────────
for (const pool of ['questionsNormal', 'questionsMyth', 'questionsBoth']) {
  const a = evalLiteral(en, pool), b = evalLiteral(legacy, pool);
  if (!Array.isArray(a) || !Array.isArray(b)) { notes.push(`${pool}: missing in one side`); continue; }
  if (a.length !== b.length) { notes.push(`${pool}: length ${a.length} vs ${b.length}, skipped`); skipped += a.length * 4; continue; }
  // Align on `dim` only. `fn` also lives on each scenario but is scoring
  // metadata that drifted independently in the legacy files (ja assigns
  // different function pairs to the same scenarios); English is authoritative
  // for it and the rebuild copies it from there, so a mismatch there does not
  // mean the lists are misaligned. `dim` decides which axis a scenario scores
  // and is the field worth trusting for position.
  const firstBad = a.findIndex((q, i) => q.dim !== b[i].dim);
  if (firstBad !== -1) {
    notes.push(`${pool}: dim order differs from English at index ${firstBad} (en=${a[firstBad].dim} ${lang}=${b[firstBad].dim}), skipped`);
    skipped += a.length * 4;
    continue;
  }
  const fnDrift = a.filter((q, i) => (q.fn || '') !== (b[i].fn || '')).length;
  b.forEach((q, i) => { for (const f of ['scene', 'text', 'a', 'b']) put(`q.${pool}.${i}.${f}`, q[f]); });
  notes.push(`${pool}: aligned, harvested` + (fnDrift ? `  (${fnDrift} fn tags drifted, English kept)` : ''));
}

// ── keyed maps: safe to harvest by key, no ordering assumption ──
const td = evalLiteral(legacy, 'typeData');
if (td) for (const [t, d] of Object.entries(td)) {
  put(`type.${t}.name`, d.name);
  put(`type.${t}.tagline`, d.tagline);
  put(`type.${t}.description`, d.description);
  (d.traits || []).forEach((v, i) => put(`type.${t}.traits.${i}`, v));
}
const te = evalLiteral(legacy, 'typeExtra');
if (te) for (const [t, d] of Object.entries(te)) {
  put(`extra.${t}.rarityLine`, d.rarityLine);
  put(`extra.${t}.best`, d.best);
  put(`extra.${t}.stress`, d.stress);
  (d.strengths || []).forEach((v, i) => put(`extra.${t}.strengths.${i}`, v));
  (d.blindspots || []).forEach((v, i) => put(`extra.${t}.blindspots.${i}`, v));
} else notes.push('typeExtra: absent from legacy page');

const fi = evalLiteral(legacy, 'fnInfo');
if (fi) for (const [fn, d] of Object.entries(fi)) put(`fn.${fn}`, d);
else notes.push('fnInfo: absent from legacy page');
const fp = evalLiteral(legacy, 'fnPos');
if (Array.isArray(fp)) fp.forEach((v, i) => put(`fnpos.${i}`, v));

console.log(`harvest ${lang}:`);
for (const n of notes) console.log('  ' + n);
console.log(`  harvested ${taken} strings`);
console.log(`  ${sameAsEn} were identical to English (left untranslated)`);
if (skipped) console.log(`  ${skipped} skipped for misalignment`);
const total = Object.keys(enCat).length;
const have = Object.keys(enCat).filter((k) => typeof cat[k] === "string" && cat[k].trim()).length;
console.log(`  catalog now ${have}/${total} (${Math.round(have / total * 100)}%)`);

if (WRITE) { saveCatalog(lang, cat); console.log(`  wrote i18n/${lang}.json`); }
else console.log('  (dry run, pass --write to save)');
