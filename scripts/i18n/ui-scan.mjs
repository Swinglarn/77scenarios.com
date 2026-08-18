// ---------------------------------------------------------------
//  Find the translatable spans in a page's markup.
//
//  Extraction and generation both call this, so they agree by construction:
//  a span is identified by its byte offset in the English source rather than
//  by a DOM path or an index that shifts whenever the markup is edited.
//  Ids are content-addressed, so re-wording an English string produces a new
//  id and the string shows up as untranslated rather than silently keeping a
//  translation of the old wording.
// ---------------------------------------------------------------

import crypto from 'node:crypto';

const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'label'];

// Attributes whose value is prose even though the tag is metadata.
const META_CONTENT = /<meta\s+[^>]*?(?:name|property)="(description|og:title|og:description|og:site_name|twitter:title|twitter:description|apple-mobile-web-app-title)"[^>]*?>/gi;

export const idFor = (text) =>
  'ui.' + crypto.createHash('sha1').update(text).digest('hex').slice(0, 10);

/* Is this worth sending to a translator? */
export function isTranslatable(s) {
  const t = s.trim();
  if (t.length < 2) return false;
  if (!/[A-Za-z]/.test(t)) return false;              // digits, punctuation, glyphs
  if (/^&[a-z]+;$/i.test(t)) return false;            // a bare entity
  if (/^(https?:|mailto:|\/|#|\{|\})/.test(t)) return false;
  if (/^[A-Za-z0-9_.-]+\.(js|css|png|jpg|svg|webp|ico|mp4|json|xml|html)$/i.test(t)) return false;
  if (/^[{}()[\];,:|/\@$%^*+=<>~`"'-]+$/.test(t)) return false;
  // template placeholders and bare expressions
  if (/^\$\{[\s\S]*\}$/.test(t)) return false;
  // a lone MBTI code or function code carries no language
  if (/^(INFJ|INFP|INTJ|INTP|ISFJ|ISFP|ISTJ|ISTP|ENFJ|ENFP|ENTJ|ENTP|ESFJ|ESFP|ESTJ|ESTP|Se|Si|Ne|Ni|Te|Ti|Fe|Fi)$/.test(t)) return false;
  return true;
}

/* Byte ranges of <script> and <style> bodies: their contents are code, and
   the data literals inside index.html are handled separately by apply.mjs. */
function codeRanges(html) {
  const out = [];
  const re = /<(script|style)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
  let m;
  while ((m = re.exec(html))) out.push([m.index, m.index + m[0].length]);
  return out;
}

export function scanUI(html) {
  const skip = codeRanges(html);
  const inCode = (i) => {
    for (const [a, b] of skip) if (i >= a && i < b) return true;
    return false;
  };
  const spans = [];
  const push = (start, text, kind) => {
    if (!isTranslatable(text)) return;
    spans.push({ start, end: start + text.length, text, kind, key: idFor(text) });
  };

  // ── text nodes ──
  // Narrowed to the trimmed run so surrounding whitespace and indentation are
  // never part of the translated value.
  const textRe = />([^<>]+)</g;
  let m;
  while ((m = textRe.exec(html))) {
    const inner = m[1];
    const at = m.index + 1;
    if (inCode(at)) continue;
    const lead = inner.length - inner.trimStart().length;
    push(at + lead, inner.trim(), 'text');
  }

  // ── translatable attributes ──
  const attrRe = /\b(placeholder|title|aria-label|alt|label)="([^"]*)"/g;
  while ((m = attrRe.exec(html))) {
    const at = m.index + m[1].length + 2;
    if (inCode(at)) continue;
    push(at, m[2], 'attr:' + m[1]);
  }

  // ── <title> ──
  const titleRe = /<title[^>]*>([^<]*)<\/title>/gi;
  while ((m = titleRe.exec(html))) {
    const at = m.index + m[0].indexOf('>') + 1;
    const lead = m[1].length - m[1].trimStart().length;
    push(at + lead, m[1].trim(), 'title');
  }

  // ── prose-bearing meta tags ──
  while ((m = META_CONTENT.exec(html))) {
    const tag = m[0];
    const c = tag.match(/\bcontent="([^"]*)"/);
    if (!c) continue;
    const at = m.index + tag.indexOf(c[0]) + 'content="'.length;
    push(at, c[1], 'meta:' + m[1]);
  }

  // de-duplicate identical spans (a tag can match two patterns) and sort
  const seen = new Set();
  return spans
    .filter((s) => { const k = s.start + ':' + s.end; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => a.start - b.start);
}

/* Replace every span using `lookup(key, englishText)`. Applied last-first so
   earlier offsets stay valid. */
export function applyUI(html, lookup) {
  const spans = scanUI(html).sort((a, b) => b.start - a.start);
  let out = html, changed = 0;
  for (const s of spans) {
    const v = lookup(s.key, s.text);
    if (typeof v !== 'string' || !v || v === s.text) continue;
    out = out.slice(0, s.start) + v + out.slice(s.end);
    changed++;
  }
  return { out, changed, total: spans.length };
}
