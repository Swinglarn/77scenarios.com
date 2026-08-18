// ---------------------------------------------------------------
//  Merge a {id: translation} JSON file into a language catalog.
//
//  Refuses ids that are not in the English source (a typo in an id would
//  otherwise sit in the catalog forever doing nothing) and reports any value
//  left identical to English, which usually means the batch was pasted back
//  without being translated.
//
//  Usage: node scripts/i18n/merge.mjs ja path/to/batch.json [--write]
// ---------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { read, loadCatalog, saveCatalog, I18N } from './lib.mjs';

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const [lang, file] = args.filter((a) => !a.startsWith('--'));
if (!lang || !file) { console.error('usage: merge.mjs <lang> <batch.json> [--write]'); process.exit(1); }

const en = JSON.parse(read(path.join(I18N, 'en.json')));
const cat = loadCatalog(lang);
const batch = JSON.parse(fs.readFileSync(file, 'utf8'));

let added = 0, updated = 0, unknown = [], sameAsEn = [], empty = 0;
for (const [k, v] of Object.entries(batch)) {
  if (!(k in en)) { unknown.push(k); continue; }
  if (typeof v !== 'string' || !v.trim()) { empty++; continue; }
  // An identical value is recorded here, unlike in harvest: this input is an
  // explicit decision, and some translations genuinely match the source.
  if (v.trim() === en[k]) sameAsEn.push(k);
  if (cat[k] === undefined) added++; else if (cat[k] !== v.trim()) updated++;
  cat[k] = v.trim();
}

console.log(`merge ${file} -> ${lang}`);
console.log(`  ${added} new, ${updated} updated`);
if (empty) console.log(`  ${empty} empty values skipped`);
if (sameAsEn.length) console.log(`  ${sameAsEn.length} identical to English, kept as intentional: ${sameAsEn.slice(0, 5).join(', ')}${sameAsEn.length > 5 ? '…' : ''}`);
if (unknown.length) console.log(`  ! ${unknown.length} unknown ids ignored: ${unknown.slice(0, 5).join(', ')}${unknown.length > 5 ? '…' : ''}`);

const total = Object.keys(en).length;
const have = Object.keys(en).filter((k) => typeof cat[k] === 'string' && cat[k].trim()).length;
console.log(`  catalog now ${have}/${total} (${Math.round(have / total * 100)}%)`);

if (WRITE) { saveCatalog(lang, cat); console.log(`  wrote i18n/${lang}.json`); }
else console.log('  (dry run, pass --write to save)');
