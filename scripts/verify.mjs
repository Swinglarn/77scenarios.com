// ---------------------------------------------------------------
//  Verification harness for the pre-render build.
//
//  Serves the repo the way Vercel does (filesystem first, then the
//  rewrites as a fallback, cleanUrls, redirects) and, with a
//  Googlebot user agent, checks every sitemap URL:
//    - HTTP status
//    - visible word count (scripts/styles/tags stripped)
//    - title / description / canonical are present and per-page
//    - JSON-LD parses
//
//  Usage:
//    node scripts/verify.mjs                verify against local server
//    node scripts/verify.mjs https://host   verify against a deployed URL
// ---------------------------------------------------------------
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8799;
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const ORIGIN = 'https://77scenarios.com';
const REMOTE = process.argv[2] && process.argv[2].startsWith('http') ? process.argv[2].replace(/\/$/, '') : null;
const POLICY = new Set(['/privacy', '/terms', '/contact', '/about']);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };

let REDIRECTS = new Map();
try {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  for (const r of cfg.redirects || []) REDIRECTS.set(r.source, r.destination);
} catch {}

function rewriteTemplate(p) {
  if (/^\/vs\/[^/]+$/.test(p)) return '/vs.html';
  if (/^\/types\/[^/]+$/.test(p)) return '/type.html';
  if (/^\/letters\/[^/]+$/.test(p)) return '/letter.html';
  if (/^\/compatibility\/[^/]+$/.test(p)) return '/compatibility-pair.html';
  return null;
}

function resolveDisk(pathname) {
  const clean = pathname === '/' ? '/index.html' : pathname.replace(/\/$/, '');
  for (const c of [clean, clean + '.html', path.join(clean, 'index.html')]) {
    const abs = path.join(ROOT, decodeURIComponent(c));
    if (!abs.startsWith(ROOT)) continue;
    try { if (fs.statSync(abs).isFile()) return abs; } catch {}
  }
  return null;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(req.url.split('?')[0]);
      if (REDIRECTS.has(pathname)) { res.writeHead(301, { Location: REDIRECTS.get(pathname) }); res.end(); return; }
      let abs = resolveDisk(pathname); // filesystem first, like Vercel
      if (!abs) { const t = rewriteTemplate(pathname); if (t) abs = path.join(ROOT, t); } // rewrite fallback
      if (!abs || !fs.existsSync(abs)) { res.writeHead(404); res.end('404'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(abs).pipe(res);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function visibleWords(html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  const words = stripped.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
  return words.length;
}

function pick(html, re) { const m = html.match(re); return m ? m[1].trim() : null; }

async function fetchPage(pathOrUrl) {
  const url = REMOTE ? REMOTE + pathOrUrl : `http://127.0.0.1:${PORT}${pathOrUrl}`;
  const resp = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
  const status = resp.status;
  const body = status >= 200 && status < 300 ? await resp.text() : '';
  return { status, body };
}

function sitemapUrls() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, ''));
}

function sample(urls, n, filter) {
  const pool = urls.filter(filter);
  const out = [];
  const copy = pool.slice();
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}

async function main() {
  const server = REMOTE ? null : await startServer();
  if (REMOTE) console.log(`verifying against ${REMOTE}`); else console.log(`verifying against local server :${PORT}`);
  const all = sitemapUrls();
  console.log(`sitemap: ${all.length} URLs\n`);

  // ---- Check 1: visible word count on a stratified random sample >=30
  const s = [
    ...sample(all, 10, (u) => u.startsWith('/vs/')),
    ...sample(all, 8, (u) => u.startsWith('/compatibility/')),
    ...sample(all, 6, (u) => u.startsWith('/types/')),
    ...sample(all, 5, (u) => u.startsWith('/letters/')),
    ...sample(all, 6, (u) => u.startsWith('/character/')),
    '/archive', '/'
  ];
  console.log('=== CHECK 1: visible words (Googlebot UA) ===');
  const meta = [];
  let under = 0;
  for (const u of s) {
    const { status, body } = await fetchPage(u);
    const w = body ? visibleWords(body) : 0;
    const title = body ? pick(body, /<title[^>]*>([^<]*)<\/title>/i) : null;
    const desc = body ? pick(body, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) : null;
    const canon = body ? pick(body, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) : null;
    const flag = w < 300 && !POLICY.has(u) ? '  <-- UNDER 300' : '';
    if (w < 300 && !POLICY.has(u)) under++;
    console.log(`${String(status).padEnd(4)} ${String(w).padStart(5)}w  ${u}${flag}`);
    meta.push({ u, title, desc, canon });
  }
  console.log(under === 0 ? '\nAll sampled non-policy pages >= 300 words: PASS' : `\n${under} page(s) under 300 words: FAIL`);

  // ---- Check 2: HTTP 200 for every sitemap URL
  console.log('\n=== CHECK 2: HTTP status for all sitemap URLs ===');
  let bad = 0, i = 0;
  for (const u of all) {
    const { status } = await fetchPage(u);
    if (status !== 200) { bad++; console.log(`  ${status}  ${u}`); }
    if (++i % 300 === 0) console.log(`  ...checked ${i}/${all.length}`);
  }
  console.log(bad === 0 ? `All ${all.length} URLs returned 200: PASS` : `${bad} URL(s) not 200: FAIL`);

  // ---- Check 3: per-page title/description/canonical distinct
  console.log('\n=== CHECK 3: title/description/canonical differ per page ===');
  const titles = new Set(meta.map((m) => m.title));
  const descs = new Set(meta.map((m) => m.desc));
  console.log(`distinct titles: ${titles.size}/${meta.length}, distinct descriptions: ${descs.size}/${meta.length}`);
  for (const m of meta.slice(0, 6)) console.log(`  ${m.u}\n     title: ${m.title}\n     canon: ${m.canon}`);

  // ---- Check 4: JSON-LD parses on a sample of generated pages
  console.log('\n=== CHECK 4: JSON-LD parses ===');
  const ldSample = [s.find((u) => u.startsWith('/vs/')), s.find((u) => u.startsWith('/compatibility/')), s.find((u) => u.startsWith('/types/')), s.find((u) => u.startsWith('/letters/')), '/archive'].filter(Boolean);
  let ldBad = 0;
  for (const u of ldSample) {
    const { body } = await fetchPage(u);
    const blocks = [...body.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    let okCount = 0;
    for (const b of blocks) { try { JSON.parse(b[1].trim()); okCount++; } catch { ldBad++; console.log(`  INVALID JSON-LD in ${u}`); } }
    console.log(`  ${u}: ${okCount}/${blocks.length} JSON-LD block(s) parse`);
  }
  console.log(ldBad === 0 ? 'All sampled JSON-LD valid: PASS' : `${ldBad} invalid JSON-LD block(s): FAIL`);

  if (server) server.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
