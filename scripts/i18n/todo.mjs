// ---------------------------------------------------------------
//  Print the strings a language still needs, as a JSON skeleton ready to be
//  filled in and fed back through merge.mjs.
//
//  Usage:
//    node scripts/i18n/todo.mjs ja                 all missing, grouped
//    node scripts/i18n/todo.mjs ja extra           only ids starting "extra."
//    node scripts/i18n/todo.mjs ja q.questionsMyth --json > out.json
// ---------------------------------------------------------------

import { read, loadCatalog, I18N } from './lib.mjs';
import path from 'node:path';

const args = process.argv.slice(2);
const JSONOUT = args.includes('--json');
const [lang, prefix] = args.filter((a) => !a.startsWith('--'));
if (!lang) { console.error('name a language'); process.exit(1); }

const en = JSON.parse(read(path.join(I18N, 'en.json')));
const cat = loadCatalog(lang);

const missing = Object.keys(en)
  .filter((k) => !(typeof cat[k] === "string" && cat[k].trim()))
  .filter((k) => !prefix || k.startsWith(prefix));

if (JSONOUT) {
  const o = {};
  for (const k of missing) o[k] = en[k];
  console.log(JSON.stringify(o, null, 2));
  process.exit(0);
}

const words = (s) => (s.match(/\S+/g) || []).length;
const byGroup = {};
for (const k of missing) {
  const g = k.split('.').slice(0, 2).join('.');
  byGroup[g] = byGroup[g] || { n: 0, w: 0 };
  byGroup[g].n++;
  byGroup[g].w += words(en[k]);
}
console.log(`${lang}: ${missing.length} strings still needed${prefix ? ` under "${prefix}"` : ''}\n`);
for (const [g, s] of Object.entries(byGroup).sort((a, b) => b[1].w - a[1].w)) {
  console.log(`  ${g.padEnd(26)} ${String(s.n).padStart(4)} strings  ${String(s.w).padStart(6)} words`);
}
const tw = Object.values(byGroup).reduce((a, s) => a + s.w, 0);
console.log(`  ${''.padEnd(26)} ${String(missing.length).padStart(4)} total    ${String(tw).padStart(6)} words`);
