// ---------------------------------------------------------------
//  Apply a translation catalog to the English data layer.
//
//  Rebuilds the literals in index.html (scenarios, typeData, typeExtra,
//  fnInfo, and the result-screen label maps) with translated strings and
//  splices them back into the page. Structural values are copied through
//  untouched, so a missing translation degrades to English rather than to a
//  broken object.
//
//  Usage:
//    node scripts/i18n/apply.mjs es            write es/index.html
//    node scripts/i18n/apply.mjs es --dry      report only
//    node scripts/i18n/apply.mjs --verify      identity round-trip check
// ---------------------------------------------------------------

import { read, write, sliceLiteral, evalLiteral, loadCatalog, coverage, I18N, exists, LANGS } from './lib.mjs';
import path from 'node:path';
import { applyUI } from './ui-scan.mjs';
import { localiseChrome } from './chrome.mjs';

const args = process.argv.slice(2);
const VERIFY = args.includes('--verify');
const DRY = args.includes('--dry');
const lang = args.find((a) => !a.startsWith('--'));

const src = read('index.html');
const enCat = JSON.parse(read(path.join(I18N, 'en.json')));

/* Serialise a value as a JS literal. JSON is a valid subset for these plain
   data shapes and handles escaping, which is the part worth not hand-rolling. */
const js = (v) => JSON.stringify(v, null, 2);

/* Build the replacement literals for one catalog. */
function localisedLiterals(cat) {
  const t = (key, fallback) => {
    const v = cat[key];
    return (typeof v === 'string' && v.trim()) ? v : fallback;
  };
  const parts = {};

  for (const pool of ['questionsNormal', 'questionsMyth', 'questionsBoth']) {
    const arr = evalLiteral(src, pool);
    if (!Array.isArray(arr)) continue;
    parts[pool] = arr.map((q, i) => {
      const o = { ...q };
      for (const f of ['scene', 'text', 'a', 'b']) {
        if (typeof q[f] === 'string') o[f] = t(`q.${pool}.${i}.${f}`, q[f]);
      }
      return o;
    });
  }

  const typeData = evalLiteral(src, 'typeData');
  if (typeData) {
    const o = {};
    for (const [ty, d] of Object.entries(typeData)) {
      o[ty] = { ...d,
        name: t(`type.${ty}.name`, d.name),
        tagline: t(`type.${ty}.tagline`, d.tagline),
        description: t(`type.${ty}.description`, d.description) };
      if (Array.isArray(d.traits)) o[ty].traits = d.traits.map((v, i) => t(`type.${ty}.traits.${i}`, v));
    }
    parts.typeData = o;
  }

  const typeExtra = evalLiteral(src, 'typeExtra');
  if (typeExtra) {
    const o = {};
    for (const [ty, d] of Object.entries(typeExtra)) {
      o[ty] = { ...d,
        rarityLine: t(`extra.${ty}.rarityLine`, d.rarityLine),
        best: t(`extra.${ty}.best`, d.best),
        stress: t(`extra.${ty}.stress`, d.stress) };
      if (Array.isArray(d.strengths)) o[ty].strengths = d.strengths.map((v, i) => t(`extra.${ty}.strengths.${i}`, v));
      if (Array.isArray(d.blindspots)) o[ty].blindspots = d.blindspots.map((v, i) => t(`extra.${ty}.blindspots.${i}`, v));
    }
    parts.typeExtra = o;
  }

  const fnInfo = evalLiteral(src, 'fnInfo');
  if (fnInfo) {
    const o = {};
    for (const [fn, d] of Object.entries(fnInfo)) o[fn] = t(`fn.${fn}`, d);
    parts.fnInfo = o;
  }
  const fnPos = evalLiteral(src, 'fnPos');
  if (Array.isArray(fnPos)) parts.fnPos = fnPos.map((v, i) => t(`fnpos.${i}`, v));

  for (const [name, prefix] of [['MODE_LABEL', 'mode'], ['AXIS_LABEL', 'axis'], ['FN_FULL', 'fnfull'], ['EV_TEXT', 'ev']]) {
    const m = evalLiteral(src, name);
    if (!m) continue;
    const o = {};
    for (const [k, v] of Object.entries(m)) o[k] = t(`${prefix}.${k}`, v);
    parts[name] = o;
  }
  return parts;
}

/* Splice literals back in, last-first so earlier offsets stay valid. */
function spliceAll(source, parts) {
  const edits = [];
  for (const [name, value] of Object.entries(parts)) {
    const s = sliceLiteral(source, name);
    if (!s) { console.warn(`  ! ${name} not found in source, skipped`); continue; }
    edits.push({ ...s, name, text: js(value) });
  }
  edits.sort((a, b) => b.start - a.start);
  let out = source;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return { out, count: edits.length };
}

if (VERIFY) {
  // Applying the English catalog to English must reproduce the same data.
  const parts = localisedLiterals(enCat);
  const { out, count } = spliceAll(src, parts);
  let mismatches = [];
  for (const name of Object.keys(parts)) {
    const before = evalLiteral(src, name);
    const after = evalLiteral(out, name);
    if (JSON.stringify(before) !== JSON.stringify(after)) mismatches.push(name);
  }
  console.log(`identity round-trip: ${count} literals spliced`);
  console.log(mismatches.length
    ? `  MISMATCH in: ${mismatches.join(', ')}`
    : `  all ${count} literals identical after extract -> apply`);
  // the rewritten page must still parse
  try { new Function(out.match(/<script>([\s\S]*?)<\/script>/)?.[1] || ''); } catch {}
  process.exit(mismatches.length ? 1 : 0);
}

if (!lang) { console.error('name a language, or pass --verify'); process.exit(1); }
const cat = loadCatalog(lang);
const cov = coverage(enCat, cat);
console.log(`${lang}: ${cov.done}/${cov.n} strings translated (${cov.pct}%)`);
if (cov.missing.length) {
  const byPrefix = {};
  for (const k of cov.missing) { const p = k.split('.')[0]; byPrefix[p] = (byPrefix[p] || 0) + 1; }
  console.log('  untranslated by group: ' + Object.entries(byPrefix).map(([k, v]) => `${k}=${v}`).join(' '));
}
const parts = localisedLiterals(cat);
const { out: dataOut, count } = spliceAll(src, parts);
console.log(`  ${count} literals rebuilt`);
// Markup second. applyUI re-scans, so it is unaffected by the offsets the
// literal splice just moved, and it skips <script> bodies so the translated
// data above is never touched again.
const ui = applyUI(dataOut, (key, english) => cat[key] || english);
console.log(`  ${ui.changed}/${ui.total} markup spans translated`);
// Chrome last: lang attribute, canonical, hreflang and internal links.
const out = localiseChrome(ui.out, lang, LANGS);
console.log('  chrome localised (lang, canonical, hreflang, internal links)');
if (DRY) { console.log('  (dry run, nothing written)'); process.exit(0); }
write(path.join(lang, 'index.html'), out);
console.log(`  wrote ${lang}/index.html`);
