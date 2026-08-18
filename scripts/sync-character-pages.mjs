// ---------------------------------------------------------------
//  77scenarios - character page sync
//
//  The English /character/<slug>.html files are fully static: their
//  text was baked in once and they do not read the data files at
//  runtime (only /es, /ja and /pt render from the templates). So
//  editing data/characters-en.js or data/char-content-en.js changes
//  nothing on the live English pages until this script runs.
//
//  It rewrites, per page, the five slots that are character-specific:
//
//    The Verdict        <- people[].desc
//    Who They Are       <- charContent[slug].who      (+ whoHeading)
//    The Journey        <- charContent[slug].journey
//    Letter by Letter   <- charContent[slug].letters  (unhides section)
//    Why Not Another Type? <- charContent[slug].mistype
//
//  plus the SEO block: <title>, og:title, meta description, og:description
//  and the Article schema's headline + description.
//
//  Everything else on the page (hero, function stack, type profile,
//  related characters) is left exactly as it is.
//
//  Usage:
//    node scripts/sync-character-pages.mjs                 all slugs with data
//    node scripts/sync-character-pages.mjs marty-mcfly ... named slugs only
//    node scripts/sync-character-pages.mjs --check         report, write nothing
// ---------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const only = args.filter((a) => !a.startsWith('--'));

// Canonical slug. Must match slug() in archive.html and fold()+slugSrch() in
// nav.js: accents are stripped, not turned into dashes, so Théoden King is
// theoden-king and not th-oden-king (which is only a redirect stub).
const slugify = (n) =>
  n.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0142]/g, 'l').replace(/[\u00f8]/g, 'o').replace(/[\u00e6]/g, 'ae')
    .replace(/[\u0111]/g, 'd').replace(/[\u00df]/g, 'ss')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const people = new Function(read('data/characters-en.js') + '\nreturn people;')().filter(Boolean);
const charContent = new Function(read('data/char-content-en.js') + '\nreturn charContent;')();

const bySlug = new Map();
for (const p of people) if (!bySlug.has(slugify(p.name))) bySlug.set(slugify(p.name), p);

const TYPES = ['INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP',
               'ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP'];

// Trim to whole sentences under `max`; failing that, to the last clause
// boundary; only then to a word. The build this replaces did a flat
// slice(0,150), which cut mid-word on all 777 pages ("...detachment t…") -
// a snippet that reads as broken, which is an invitation for Google to throw
// the description away and compose its own from the body copy.
function metaDesc(desc, max = 155) {
  const t = String(desc).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  let out = '';
  for (const part of t.match(/[^.!?]+[.!?]+(\s|$)/g) || []) {
    if ((out + part).trim().length > max) break;
    out += part;
  }
  out = out.trim();
  if (out.length >= max * 0.55) return out;
  const head = t.slice(0, max - 1);
  const clause = Math.max(head.lastIndexOf(', '), head.lastIndexOf('; '),
                          head.lastIndexOf(' - '), head.lastIndexOf(': '));
  const at = clause >= max * 0.5 ? clause : head.lastIndexOf(' ');
  return head.slice(0, at).replace(/[,;:\-\s]+$/, '') + '…';
}

// "Tony Stark / Iron Man" -> "Tony Stark", to buy title budget when needed.
const shortName = (n) => n.split(' / ')[0].trim();

// The type the character is most often mistyped as. charContent[].mistype
// phrases this a dozen different ways ("the common alternative is X", "is
// sometimes typed X", "the most common argument against Y"), so rather than
// matching the sentence, take the first four-letter type in the passage that
// is not the character's own.
function altType(slug, own) {
  const m = charContent[slug] && charContent[slug].mistype;
  if (!m) return null;
  const found = (m.replace(/<[^>]+>/g, '').match(/\b[EI][NS][TF][JP]\b/g) || [])
    .filter((x) => TYPES.includes(x) && x !== own);
  return found[0] || null;
}

// The old title, "<Name> MBTI Personality Type (<TYPE>) · 77 Scenarios",
// answered the query outright, so the result had nothing left to offer a
// searcher who had already read it. These keep the type - dropping it would
// cost relevance on "<name> <type>" queries - but pair it with the reason to
// open the page. First variant that fits 60 chars wins.
function buildTitle(p, slug) {
  const alt = altType(slug, p.type);
  const full = p.name, short = shortName(p.name);
  const c = [];
  if (alt) {
    c.push(`${full} MBTI: ${p.type}, Not ${alt} · 77 Scenarios`);
    c.push(`${short} MBTI: ${p.type}, Not ${alt} · 77 Scenarios`);
    c.push(`${short} MBTI: ${p.type}, Not ${alt}`);
  }
  c.push(`${full} MBTI: The Case for ${p.type} · 77 Scenarios`);
  c.push(`${short} MBTI: The Case for ${p.type} · 77 Scenarios`);
  c.push(`${short} MBTI: The Case for ${p.type}`);
  c.push(`${short} MBTI Type: ${p.type}`);
  return c.find((x) => x.length <= 60) || c[c.length - 1];
}
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// desc is plain text, so it has to be escaped before going into the page.
// charContent values are HTML fragments and must NOT be escaped.
const text = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// charContent values ARE markup, so tags and real entities must survive - but a
// bare "&" (R&B, Marks & Spencer) is invalid HTML. Escape only ampersands that
// do not already begin a character reference.
const frag = (s) => s.replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]{1,31}|#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6});)/g, '&amp;');

// Replace the body of a section that is keyed by an id'd <h2>. The body runs
// from the end of that heading to the blank-line + closing </div> that ends
// the section block.
function replaceSection(html, headingId, heading, innerId, inner) {
  const re = new RegExp('(<h2 id="' + headingId + '">)([\\s\\S]*?)(</h2>)([\\s\\S]*?)(\\n    </div>)');
  if (!re.test(html)) return { html, ok: false };
  return {
    html: html.replace(re, (m, open, oldHeading, close, _body, tail) =>
      open + (heading == null ? oldHeading : heading) + close + '<div id="' + innerId + '">' + inner + '</div>' + tail),
    ok: true
  };
}

let written = 0, skipped = 0;
const problems = [];
// Default to the slugs you name. A full pass rewrites the section wrappers on
// every page it touches, which is a ~590 file diff for no content change, so
// it has to be asked for explicitly.
if (!only.length && !args.includes('--all')) {
  console.error('name the slugs to sync, or pass --all to rewrite every page with data.');
  process.exit(1);
}
// Driven off the character data, not charContent: title and description come
// from people[], so every character with a page needs a pass, including the
// ~50 that have no charContent sections yet.
const slugs = only.length ? only : [...bySlug.keys()];

for (const slug of slugs) {
  const p = bySlug.get(slug);
  const cc = charContent[slug] || {};
  const file = path.join(ROOT, 'character', slug + '.html');
  if (!p) { problems.push(slug + ': no character in characters-en.js'); continue; }
  if (!fs.existsSync(file)) { problems.push(slug + ': no character/' + slug + '.html'); continue; }

  const before = fs.readFileSync(file, 'utf8');
  let html = before;
  const done = [];

  // ── The Verdict + meta descriptions ──
  const verdict = /(<div class="verdict-label">The Verdict<\/div>\s*)<p>[\s\S]*?<\/p>/;
  if (verdict.test(html)) {
    html = html.replace(verdict, (m, lead) => lead + '<p>' + text(p.desc) + '</p>');
    done.push('verdict');
  } else problems.push(slug + ': verdict block not found');

  // ── canonical / og:url / og:image ──
  // Accented names were slugged with an older rule that turned the accent into
  // a dash, so 11 pages declared a canonical that 301s straight back to them
  // and pointed og:image at a file that does not exist.
  {
    const url = 'https://77scenarios.com/character/' + slug;
    const img = 'https://77scenarios.com/images/characters/' + slug + '.webp';
    const subs = [
      [/(<link id="canonical-url" rel="canonical" href=")[^"]*(")/, url],
      [/(<meta id="og-url" property="og:url" content=")[^"]*(")/, url],
      [/(<meta property="og:image" content=")[^"]*(")/, img],
      [/(<meta name="twitter:image" content=")[^"]*(")/, img]
    ];
    let fixed = false;
    for (const [re, val] of subs) {
      const m = html.match(re);
      if (m && m[0] !== m[1] + val + m[2]) { html = html.replace(re, '$1' + val + '$2'); fixed = true; }
    }
    if (fixed) done.push('urls');
  }

  const md = attr(metaDesc(p.desc));
  for (const id of ['page-desc', 'og-desc']) {
    const re = new RegExp('(<meta id="' + id + '"[^>]*content=")[^"]*(")');
    if (re.test(html)) html = html.replace(re, '$1' + md + '$2');
    else problems.push(slug + ': meta ' + id + ' not found');
  }
  done.push('meta');

  // ── <title> + og:title ──
  const ttl = attr(buildTitle(p, slug));
  {
    const tre = /(<title id="page-title">)[^<]*(<\/title>)/;
    if (tre.test(html)) html = html.replace(tre, '$1' + ttl + '$2');
    else problems.push(slug + ': title not found');
    const ore = /(<meta id="og-title"[^>]*content=")[^"]*(")/;
    if (ore.test(html)) html = html.replace(ore, '$1' + ttl + '$2');
    else problems.push(slug + ': meta og-title not found');
    done.push('title');
  }

  // ── Article schema: headline + description ──
  // The Person node above it also has a "description" (the ctx string), so
  // this has to be anchored on the Article node rather than replaced globally.
  {
    const jsonStr = (s) => JSON.stringify(s).slice(1, -1);
    // The value matchers must span \" - eight descriptions quote the character
    // ("Why so serious?"), and a plain [^"]* stops dead on the escaped quote
    // and leaves the tail of the old value behind, which is invalid JSON.
    const q = '(?:[^"\\\\]|\\\\.)*';
    const re = new RegExp('("@type":"Article","@id":"[^"]*","headline":")' + q +
                          '(","description":")' + q + '(")');
    if (re.test(html)) {
      html = html.replace(re, '$1' + jsonStr(`${p.name} - ${p.type} Personality Type Analysis`) +
                               '$2' + jsonStr(metaDesc(p.desc)) + '$3');
      done.push('schema');
    } else problems.push(slug + ': Article schema not found');
  }

  // ── Who They Are ──
  if (cc.who) {
    const re = /(<div class="section-label">Who They Are<\/div>\s*<h2>)([\s\S]*?)(<\/h2>)([\s\S]*?)(\n    <\/div>)/;
    if (re.test(html)) {
      html = html.replace(re, (m, open, oldH, close, _body, tail) =>
        open + (cc.whoHeading || oldH) + close + '<div id="who-they-are-text">' + frag(cc.who) + '</div>' + tail);
      done.push('who');
    } else problems.push(slug + ': who block not found');
  }

  // ── The Journey ──
  if (cc.journey) {
    const r = replaceSection(html, 'journey-heading', null, 'journey-text', frag(cc.journey));
    if (r.ok) { html = r.html; done.push('journey'); } else problems.push(slug + ': journey block not found');
  }

  // ── Why Not Another Type? ──
  if (cc.mistype) {
    const r = replaceSection(html, 'mistype-heading', null, 'mistype-text', frag(cc.mistype));
    if (r.ok) { html = r.html; done.push('mistype'); } else problems.push(slug + ': mistype block not found');
  }

  // ── Letter by Letter (hidden unless there is content) ──
  if (cc.letters) {
    const heading = p.name + ': ' + p.type + ' Letter by Letter';
    html = html.replace(/(id="letters-section" style=")[^"]*(")/, '$1$2');
    const r = replaceSection(html, 'letters-heading', heading, 'letters-text', frag(cc.letters));
    if (r.ok) { html = r.html; done.push('letters'); } else problems.push(slug + ': letters block not found');
  }

  if (html === before) { skipped++; continue; }
  if (!CHECK) fs.writeFileSync(file, html, 'utf8');
  written++;
  if (only.length || slugs.length <= 40) console.log((CHECK ? 'would update ' : 'updated ') + slug + '  [' + done.join(' ') + ']');
}

console.log('\n' + (CHECK ? 'would write ' : 'wrote ') + written + ' page(s), ' + skipped + ' already current');

// archive.html carries its own inlined copy of the character array. Nothing
// renders its desc field - the cards are plain links and nav.js only scrapes
// name/ctx/type off it - and its copy is a whole generation behind the data
// file for ~595 characters. So keep the named slugs in step and leave the rest
// alone rather than committing a 595-entry rewrite of dead text.
{
  const archFile = path.join(ROOT, 'archive.html');
  let arch = fs.readFileSync(archFile, 'utf8');
  let patched = 0;
  for (const slug of slugs) {
    const p = bySlug.get(slug);
    if (!p) continue;
    const at = arch.indexOf('{name:`' + p.name + '`');
    if (at < 0) { problems.push(slug + ': not found in archive.html'); continue; }
    const vStart = arch.indexOf('desc:`', at) + 'desc:`'.length;
    const vEnd = arch.indexOf('`', vStart);
    if (arch.slice(vStart, vEnd) === p.desc) continue;
    arch = arch.slice(0, vStart) + p.desc + arch.slice(vEnd);
    patched++;
  }
  if (patched && !CHECK) fs.writeFileSync(archFile, arch, 'utf8');
  console.log((CHECK ? 'would patch ' : 'patched ') + patched + ' description(s) in archive.html');
}
if (problems.length) {
  console.log('\nproblems (' + problems.length + '):');
  for (const p of problems.slice(0, 40)) console.log('  ' + p);
  process.exitCode = 1;
}
