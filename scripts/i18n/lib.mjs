// ---------------------------------------------------------------
//  Shared helpers for the i18n pipeline.
//
//  The translated sites drifted because each /es, /ja and /pt page was a
//  hand-edited copy of an English page at some point in the past. Three copies
//  of 200KB of markup and data cannot be kept in step by hand, and they were
//  not: the language builds never received typeExtra, renderTypeDetail or the
//  result-detail sections at all, and their character content is English.
//
//  So the language sites are generated instead: English is the only source,
//  and every translatable string lives in a catalog keyed by a stable id.
//  Re-running the build after an English change reapplies the catalog, and
//  anything newly added simply shows up as untranslated rather than silently
//  diverging.
// ---------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const I18N = path.join(ROOT, 'i18n');
export const LANGS = ['es', 'ja'];

export const read = (p) => fs.readFileSync(path.isAbsolute(p) ? p : path.join(ROOT, p), 'utf8');
export const write = (p, s) => {
  const full = path.isAbsolute(p) ? p : path.join(ROOT, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, s, 'utf8');
};
export const exists = (p) => fs.existsSync(path.isAbsolute(p) ? p : path.join(ROOT, p));

/* Slice a balanced [...] or {...} literal that follows `const <name> =`.
   Quote- and comment-aware, because the scenario text is full of braces,
   apostrophes and escaped quotes that a naive brace count trips over. */
export function sliceLiteral(src, name) {
  const decl = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*');
  const m = src.match(decl);
  if (!m) return null;
  const start = m.index + m[0].length;
  const open = src[start];
  if (open !== '[' && open !== '{') return null;
  const close = open === '[' ? ']' : '}';

  let depth = 0, i = start, q = null, esc = false, line = false, block = false;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (q) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) { i++; break; } }
  }
  return { start, end: i, text: src.slice(start, i) };
}

/* Evaluate one of those literals into real data. */
export function evalLiteral(src, name) {
  const s = sliceLiteral(src, name);
  if (!s) return null;
  try { return new Function('return (' + s.text + ');')(); }
  catch (e) { throw new Error(`could not evaluate ${name}: ${e.message}`); }
}

export const loadCatalog = (lang) => {
  const p = path.join(I18N, `${lang}.json`);
  return exists(p) ? JSON.parse(read(p)) : {};
};
export const saveCatalog = (lang, obj) => {
  const keys = Object.keys(obj).sort();
  const out = {};
  for (const k of keys) out[k] = obj[k];
  write(path.join(I18N, `${lang}.json`), JSON.stringify(out, null, 2) + '\n');
};

/* Stats for a catalog against the English source list.
   Presence in the catalog counts as translated, rather than "differs from
   English": some correct translations are identical to the source (Spanish
   "Inferior", proper nouns, MBTI codes), and comparing against English marks
   those missing forever. Harvest still refuses to *record* an identical value,
   because there it is a guess about a legacy page rather than a decision. */
export function coverage(source, cat) {
  let done = 0, missing = [];
  for (const k of Object.keys(source)) {
    const v = cat[k];
    if (typeof v === 'string' && v.trim()) done++;
    else missing.push(k);
  }
  const n = Object.keys(source).length;
  return { n, done, missing, pct: n ? Math.round((done / n) * 100) : 100 };
}
