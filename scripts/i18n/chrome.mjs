// ---------------------------------------------------------------
//  Localise the page chrome: the parts that are neither copy nor data.
//
//  lang attribute, canonical, og:url, the hreflang set, and the internal
//  links, which otherwise send a Spanish reader from /es straight back into
//  the English site.
// ---------------------------------------------------------------

const BASE = 'https://77scenarios.com';

// Routes that exist under every language prefix.
const SITE_ROUTES = [
  'types', 'letters', 'vs', 'compatibility', 'archive', 'functions',
  'cognitive-functions', 'about', 'contact', 'forum', 'privacy', 'terms',
  'character', 'login', 'signup', 'profile', 'settings', 'rarity'
];

export function localiseChrome(html, lang, langs) {
  let out = html;

  // <html lang="en">
  out = out.replace(/(<html[^>]*\blang=")[^"]*(")/i, '$1' + lang + '$2');

  // canonical and og:url point at the language home
  const home = BASE + '/' + lang + '/';
  out = out.replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/i, '$1' + home + '$2');
  out = out.replace(/(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/i, '$1' + home + '$2');

  // Rebuild the hreflang set: English at the root, one entry per language
  // that actually exists, and x-default back to English.
  const alts = [`<link rel="alternate" hreflang="en" href="${BASE}/">`]
    .concat(langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}/${l}/">`))
    .concat([`<link rel="alternate" hreflang="x-default" href="${BASE}/">`]);
  const altRe = /[ \t]*<link[^>]*rel="alternate"[^>]*hreflang="[^"]*"[^>]*>\s*/gi;
  let first = true;
  out = out.replace(altRe, () => {
    if (!first) return '';
    first = false;
    return alts.join('\n') + '\n';
  });

  // Internal links. Only exact site routes are rewritten, so anchors, query
  // strings and external URLs are left alone.
  for (const r of SITE_ROUTES) {
    const re = new RegExp('href="/' + r + '(/|")', 'g');
    out = out.replace(re, (m, tail) => 'href="/' + lang + '/' + r + tail);
  }
  // Runtime-built links (result screen deep links) read this constant.
  out = out.replace(/const LANG_PREFIX = '[^']*';/, "const LANG_PREFIX = '/" + lang + "';");

  // the bare home link
  out = out.replace(/href="\/"/g, 'href="/' + lang + '/"');

  return out;
}
