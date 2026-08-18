// ---------------------------------------------------------------
//  Generate country-name translations from ICU rather than by hand.
//
//  ~195 of the UI strings are the nationality dropdown. Hand-translating a
//  closed, standardised list twice invites silent errors, so the names come
//  from Intl.DisplayNames instead. Anything ICU does not match under the
//  site's exact English spelling is reported rather than guessed at.
//
//  Usage: node scripts/i18n/countries.mjs es > batch.json
// ---------------------------------------------------------------

import { read, I18N } from './lib.mjs';
import path from 'node:path';
import { idFor } from './ui-scan.mjs';

const lang = process.argv[2];
if (!lang) { console.error('name a language'); process.exit(1); }

const en = JSON.parse(read(path.join(I18N, 'en.json')));
const enNames = new Intl.DisplayNames(['en'], { type: 'region' });
const target = new Intl.DisplayNames([lang], { type: 'region' });

// every ISO 3166-1 alpha-2 code
const codes = [];
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  codes.push(String.fromCharCode(a) + String.fromCharCode(b));
}

// english display name -> code
const byEnglish = new Map();
for (const c of codes) {
  let n; try { n = enNames.of(c); } catch { continue; }
  if (!n || n === c) continue;
  byEnglish.set(n, c);
}

// The site's spellings that differ from ICU's English form.
const ALIASES = {
  'Cabo Verde': 'CV', 'Cape Verde': 'CV',
  'Czech Republic': 'CZ', 'Czechia': 'CZ',
  'Congo (Democratic Republic)': 'CD', 'Congo (Republic)': 'CG',
  'Myanmar (Burma)': 'MM', 'Burma': 'MM',
  'East Timor': 'TL', 'Timor-Leste': 'TL',
  'Ivory Coast': 'CI', "Côte d'Ivoire": 'CI',
  'North Macedonia': 'MK', 'Vatican City': 'VA',
  'Palestine': 'PS', 'South Korea': 'KR', 'North Korea': 'KP',
  'Russia': 'RU', 'Syria': 'SY', 'Laos': 'LA', 'Vietnam': 'VN',
  'United States': 'US', 'United Kingdom': 'GB',
  'Netherlands': 'NL', 'Turkey': 'TR', 'Türkiye': 'TR',
  'Sao Tome and Principe': 'ST', 'São Tomé and Príncipe': 'ST',
  'Micronesia': 'FM', 'Brunei': 'BN', 'Bolivia': 'BO',
  'Tanzania': 'TZ', 'Moldova': 'MD', 'Eswatini': 'SZ',
  'Saint Kitts and Nevis': 'KN', 'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  'Trinidad and Tobago': 'TT', 'Antigua and Barbuda': 'AG',
  'Bosnia and Herzegovina': 'BA', 'Papua New Guinea': 'PG',
  'Marshall Islands': 'MH', 'Solomon Islands': 'SB',
  'United Arab Emirates': 'AE', 'Central African Republic': 'CF',
  'Dominican Republic': 'DO', 'Equatorial Guinea': 'GQ',
  'Guinea-Bissau': 'GW', 'Sierra Leone': 'SL', 'South Sudan': 'SS',
  'South Africa': 'ZA', 'Sri Lanka': 'LK', 'New Zealand': 'NZ',
  'Costa Rica': 'CR', 'El Salvador': 'SV', 'Burkina Faso': 'BF',
  'San Marino': 'SM', 'Saudi Arabia': 'SA'
};

const out = {};
const unmatched = [];
let matched = 0;
for (const [key, value] of Object.entries(en)) {
  if (!key.startsWith('ui.')) continue;
  const code = byEnglish.get(value) || ALIASES[value];
  if (!code) continue;                    // not a country string
  let name; try { name = target.of(code); } catch { name = null; }
  if (!name || name === code) { unmatched.push(value); continue; }
  if (idFor(value) !== key) continue;     // id must belong to this text
  out[key] = name;
  matched++;
}

console.error(`${lang}: ${matched} country names from ICU`);
if (unmatched.length) console.error(`  unresolved: ${unmatched.join(', ')}`);
console.log(JSON.stringify(out, null, 2));
