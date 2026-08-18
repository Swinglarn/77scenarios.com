// ---------------------------------------------------------------
//  Check a catalog for the ways machine translation quietly goes wrong.
//
//  Wrong-script contamination is the one worth automating: a Japanese batch
//  can come back with a Russian or Korean fragment spliced mid-sentence, and
//  it reads as plausible Japanese to anyone not looking closely. It is
//  invisible in a diff full of CJK and it ships.
//
//  Usage: node scripts/i18n/lint.mjs ja [--verbose]
// ---------------------------------------------------------------

import { read, loadCatalog, I18N } from './lib.mjs';
import path from 'node:path';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const langs = args.filter((a) => !a.startsWith('--'));
if (!langs.length) { console.error('name at least one language'); process.exit(1); }

const en = JSON.parse(read(path.join(I18N, 'en.json')));

const CYRILLIC = /[Ѐ-ӿ]/;
const HANGUL = /[가-힯ᄀ-ᇿ]/;
const CJK = /[぀-ヿ一-鿿]/;
// Latin runs that are legitimately expected inside a translation
// {n}, {dim}, {name} and friends are substituted at render time. They are
// not words, and a translation that loses one renders a broken sentence.
const PLACEHOLDER = /[{]([A-Za-z0-9_]+)[}]/g;
const placeholders = (t) => (String(t).match(PLACEHOLDER) || []).sort().join(',');

const ALLOWED_LATIN = /^(INFJ|INFP|INTJ|INTP|ISFJ|ISFP|ISTJ|ISTP|ENFJ|ENFP|ENTJ|ENTP|ESFJ|ESFP|ESTJ|ESTP|MBTI|Se|Si|Ne|Ni|Te|Ti|Fe|Fi|Scenarios|Seventy|Seven)$/;

/* Strings that are deliberately not localised: the brand, an address, a URL.
   Flagging these every run trains you to ignore the linter, which is worse
   than not having one. */
function isBrandOrTechnical(english) {
  const t = String(english).trim();
  if (/@|&#64;/.test(t)) return true;            // an email address
  if (/^https?:|^www[.]/i.test(t)) return true;  // a URL
  if (/^77 Scenarios$/.test(t)) return true;     // the brand, left in Latin
  return false;
}

const RULES = {
  es: {
    forbid: [['Cyrillic', CYRILLIC], ['Hangul', HANGUL], ['CJK', CJK]],
    latinOk: true
  },
  ja: {
    forbid: [['Cyrillic', CYRILLIC], ['Hangul', HANGUL]],
    latinOk: false,
    // a Japanese string with no CJK at all is almost certainly untranslated
    wantScript: CJK
  }
};

let totalIssues = 0;
for (const lang of langs) {
  const cat = loadCatalog(lang);
  const rule = RULES[lang] || { forbid: [], latinOk: true };
  const issues = [];

  for (const [k, v] of Object.entries(cat)) {
    if (!(k in en)) { issues.push(['orphan-id', k, 'not present in en.json']); continue; }
    if (typeof v !== 'string' || !v.trim()) { issues.push(['empty', k, '']); continue; }
    if (isBrandOrTechnical(en[k])) continue;

    for (const [name, re] of rule.forbid) {
      if (re.test(v)) issues.push(['script:' + name, k, v.match(new RegExp(re.source + '+', 'g')).join(' ')]);
    }
    if (!rule.latinOk) {
      const stray = (v.replace(PLACEHOLDER, ' ').match(/[A-Za-z]{2,}/g) || []).filter((w) => !ALLOWED_LATIN.test(w));
      if (stray.length) issues.push(['latin', k, stray.join(' ')]);
    }
    if (rule.wantScript && !rule.wantScript.test(v)) issues.push(['no-target-script', k, v.slice(0, 40)]);
    if (v.trim() === en[k] && en[k].length > 24) issues.push(['same-as-english', k, v.slice(0, 40)]);
    if (placeholders(en[k]) !== placeholders(v)) {
      issues.push(['placeholder-mismatch', k, `en has ${placeholders(en[k]) || 'none'}, translation has ${placeholders(v) || 'none'}`]);
    }
  }

  const byKind = {};
  for (const [kind] of issues) byKind[kind] = (byKind[kind] || 0) + 1;
  const n = Object.keys(cat).length;
  console.log(`${lang}: ${n} strings, ${issues.length} issue(s)`);
  for (const [kind, count] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${kind.padEnd(20)} ${count}`);
  }
  if (issues.length && (VERBOSE || issues.length <= 12)) {
    for (const [kind, k, detail] of issues) console.log(`    [${kind}] ${k}  ${detail}`);
  } else if (issues.length) {
    console.log('    (pass --verbose to list them)');
  }
  totalIssues += issues.length;
}
process.exit(totalIssues ? 1 : 0);
