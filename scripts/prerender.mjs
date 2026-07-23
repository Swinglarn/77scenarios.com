// ---------------------------------------------------------------
//  77scenarios - pre-render build
//
//  Bakes the client-side template routes (/vs, /compatibility,
//  /types, /letters) into static HTML files and bakes the full
//  character grid into /archive, so crawlers and no-JS users get
//  the full content in the raw server response. Then regenerates
//  sitemap.xml from the files actually on disk.
//
//  Vanilla static site, no framework. This runs locally and its
//  output is committed; Vercel has no build step.
//
//  Usage:
//    node scripts/prerender.mjs               full build
//    node scripts/prerender.mjs --sitemap-only regenerate sitemap only
// ---------------------------------------------------------------

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 8791;
const BASE = `http://127.0.0.1:${PORT}`;
const ORIGIN = 'https://77scenarios.com';
const SITEMAP_ONLY = process.argv.includes('--sitemap-only');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Dynamic route -> template file. These always win over any baked
// file so the build always renders from the template, exactly as
// Vercel's rewrites map an unmatched slug back to the template.
function templateFor(pathname) {
  if (/^\/vs\/[^/]+$/.test(pathname)) return '/vs.html';
  if (/^\/types\/[^/]+$/.test(pathname)) return '/type.html';
  if (/^\/letters\/[^/]+$/.test(pathname)) return '/letter.html';
  if (/^\/compatibility\/[^/]+$/.test(pathname)) return '/compatibility-pair.html';
  if (pathname === '/archive') return '/archive.html';
  return null;
}

function resolveDisk(pathname) {
  // cleanUrls: try exact, then .html, then index.html
  const candidates = [];
  const clean = pathname.replace(/\/$/, '');
  candidates.push(clean);
  candidates.push(clean + '.html');
  candidates.push(path.join(clean, 'index.html'));
  if (pathname === '/') candidates.length = 0, candidates.push('/index.html');
  for (const c of candidates) {
    const abs = path.join(ROOT, decodeURIComponent(c));
    if (!abs.startsWith(ROOT)) continue;
    try {
      const st = fs.statSync(abs);
      if (st.isFile()) return abs;
    } catch { /* not found */ }
  }
  return null;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(req.url.split('?')[0]);
      const tpl = templateFor(pathname);
      const abs = tpl ? path.join(ROOT, tpl) : resolveDisk(pathname);
      if (!abs || !fs.existsSync(abs)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found: ' + pathname);
        return;
      }
      const ext = path.extname(abs).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(abs).pipe(res);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

// Only same-origin document + data files are needed to render content.
// Everything that mutates the DOM at runtime (nav.js, cinematic.js) or
// reaches the network (ads, supabase, fonts, wikipedia, analytics) is
// blocked so the snapshot stays a faithful copy of the template body.
function shouldBlock(url) {
  if (url.startsWith(BASE)) {
    const p = url.slice(BASE.length).split('?')[0];
    if (p === '/nav.js' || p === '/cinematic.js') return true;
    if (p.startsWith('/data/')) return false;
    if (p.endsWith('.js')) return true; // stray local scripts, not needed
    return false; // document, css, images
  }
  return true; // any external host
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function evalKeys(page, url, fn) {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (!resp || !resp.ok()) throw new Error(`enumeration load failed ${url}: ${resp && resp.status()}`);
  return page.evaluate(fn);
}

async function renderRoute(page, url, rootSelector, outPath) {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  if (!resp || !resp.ok()) throw new Error(`load failed ${url}: ${resp && resp.status()}`);
  await page.waitForFunction(
    (sel) => { const el = document.querySelector(sel); return el && el.children.length > 0; },
    { timeout: 20000 }, rootSelector
  );
  await sleep(180); // let deferred timeouts (score bar, fn stack) settle
  await page.evaluate((rootSel) => {
    // Ship reveal elements in their pre-animation state and drop the js
    // flag: without it the CSS reveal gate is inert, so the content is
    // fully visible to crawlers and no-JS users. When JS runs, the head
    // script re-adds .js and the observer plays the reveal as normal.
    document.querySelectorAll('.r').forEach((el) => el.classList.remove('in'));
    document.documentElement.classList.remove('js');
    const ov = document.getElementById('t-overlay');
    if (ov) { ov.style.opacity = '0'; ov.style.pointerEvents = 'none'; }
    const root = document.querySelector(rootSel);
    if (root) root.setAttribute('data-prerendered', '1');
  }, rootSelector);
  const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
  fs.writeFileSync(outPath, html);
}

async function renderArchive(page, url, outPath) {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  if (!resp || !resp.ok()) throw new Error(`load failed ${url}: ${resp && resp.status()}`);
  await page.waitForFunction(
    () => { const g = document.getElementById('db-grid'); return g && g.children.length > 100; },
    { timeout: 20000 }
  );
  await sleep(120);
  await page.evaluate(() => {
    document.querySelectorAll('.r').forEach((el) => el.classList.remove('in'));
    document.documentElement.classList.remove('js');
    const ov = document.getElementById('t-overlay');
    if (ov) { ov.style.opacity = '0'; ov.style.pointerEvents = 'none'; }
    // Filter buttons are rebuilt on the client via appendChild, so empty
    // the containers to avoid duplicate buttons when the page hydrates.
    const cf = document.getElementById('cat-filters'); if (cf) cf.innerHTML = '';
    const tf = document.getElementById('type-filters'); if (tf) tf.innerHTML = '';
  });
  const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
  fs.writeFileSync(outPath, html);
}

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

function setEqual(a, b) {
  const sa = new Set(a), sb = new Set(b);
  const missing = [...sb].filter((x) => !sa.has(x)); // in sitemap, not in data
  const extra = [...sa].filter((x) => !sb.has(x));   // in data, not in sitemap
  return { ok: missing.length === 0 && extra.length === 0, missing, extra };
}

function sitemapSlugs(section) {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const re = new RegExp(`${ORIGIN}/${section}/([^<]+)`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

// ---- sitemap generation from disk -----------------------------
const STATIC_PAGES = [
  ['/', 'monthly', '1.0'],
  ['/types', 'monthly', '0.9'],
  ['/rarity', 'monthly', '0.8'],
  ['/letters', 'monthly', '0.9'],
  ['/functions', 'monthly', '0.8'],
  ['/cognitive-functions', 'monthly', '0.8'],
  ['/vs', 'weekly', '0.9'],
  ['/compatibility', 'monthly', '0.7'],
  ['/archive', 'weekly', '0.8'],
  ['/about', 'monthly', '0.8'],
  ['/forum', 'daily', '0.7'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/contact', 'monthly', '0.4']
];

const SECTION_META = {
  character: ['monthly', '0.7'],
  vs: ['monthly', '0.8'],
  compatibility: ['monthly', '0.7'],
  types: ['monthly', '0.9'],
  letters: ['monthly', '0.7']
};

// Paths that vercel.json 301-redirects away (e.g. accent-stripped legacy
// character slugs). Their files still exist to serve the redirect but they
// must never appear in the sitemap.
function redirectSources() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    return new Set((cfg.redirects || []).map((r) => r.source));
  } catch { return new Set(); }
}

function listSlugs(dir, skip) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.slice(0, -5))
    .filter((s) => !skip.has(`/${dir}/${s}`))
    .sort();
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  lines.push('');
  lines.push('  <!-- Core pages -->');
  for (const [loc, cf, pr] of STATIC_PAGES) {
    lines.push(`  <url><loc>${ORIGIN}${loc}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`);
  }
  const sections = [
    ['Type profiles', 'types'],
    ['Letters', 'letters'],
    ['Type vs Type', 'vs'],
    ['Compatibility pairs', 'compatibility'],
    ['Characters', 'character']
  ];
  const skip = redirectSources();
  let total = STATIC_PAGES.length;
  for (const [label, dir] of sections) {
    const slugs = listSlugs(dir, skip);
    const [cf, pr] = SECTION_META[dir];
    lines.push('');
    lines.push(`  <!-- ${label} (${slugs.length}) -->`);
    for (const s of slugs) {
      lines.push(`  <url><loc>${ORIGIN}/${dir}/${s}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`);
    }
    total += slugs.length;
  }
  lines.push('');
  lines.push('</urlset>');
  lines.push('');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), lines.join('\n'));
  return total;
}

// ---- main -----------------------------------------------------
async function main() {
  if (SITEMAP_ONLY) {
    const total = generateSitemap();
    console.log(`sitemap.xml regenerated from disk: ${total} URLs`);
    return;
  }

  const server = await startServer();
  console.log(`static server on ${BASE}`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (r) => { shouldBlock(r.url()) ? r.abort() : r.continue(); });
  page.on('pageerror', () => {}); // tolerate blocked-script ReferenceErrors

  try {
    // 1. Enumerate slugs from the data itself.
    const vsSlugs = await evalKeys(page, `${BASE}/vs`, () => Object.keys(vsData));
    const compatSlugs = await evalKeys(page, `${BASE}/compatibility/enfp-enfp`, () => Object.keys(pairingData));
    const typeSlugs = (await evalKeys(page, `${BASE}/types/intj`, () => Object.keys(types))).map((t) => t.toLowerCase());
    const letterSlugs = (await evalKeys(page, `${BASE}/letters/e`, () => Object.keys(letters))).map((l) => l.toLowerCase());

    console.log(`enumerated: vs=${vsSlugs.length} compatibility=${compatSlugs.length} types=${typeSlugs.length} letters=${letterSlugs.length}`);

    // 2. Cross-check against the current sitemap, both directions.
    const checks = [
      ['vs', vsSlugs, sitemapSlugs('vs')],
      ['compatibility', compatSlugs, sitemapSlugs('compatibility')],
      ['types', typeSlugs, sitemapSlugs('types')],
      ['letters', letterSlugs, sitemapSlugs('letters')]
    ];
    let mismatch = false;
    for (const [name, data, sm] of checks) {
      const r = setEqual(data, sm);
      if (!r.ok) {
        mismatch = true;
        console.error(`\nMISMATCH in ${name}:`);
        if (r.missing.length) console.error(`  in sitemap but not in data: ${r.missing.join(', ')}`);
        if (r.extra.length) console.error(`  in data but not in sitemap: ${r.extra.join(', ')}`);
      }
    }
    if (mismatch) throw new Error('slug set does not match sitemap - aborting');
    console.log('slug cross-check against sitemap: OK');

    // 3. Render each section.
    const jobs = [];
    for (const s of vsSlugs) jobs.push([`${BASE}/vs/${s}`, '#vs-root', path.join(ROOT, 'vs', `${s}.html`)]);
    for (const s of compatSlugs) jobs.push([`${BASE}/compatibility/${s}`, '#content', path.join(ROOT, 'compatibility', `${s}.html`)]);
    for (const s of typeSlugs) jobs.push([`${BASE}/types/${s}`, '#content', path.join(ROOT, 'types', `${s}.html`)]);
    for (const s of letterSlugs) jobs.push([`${BASE}/letters/${s}`, '#content', path.join(ROOT, 'letters', `${s}.html`)]);

    ensureDir(path.join(ROOT, 'vs'));
    ensureDir(path.join(ROOT, 'compatibility'));
    ensureDir(path.join(ROOT, 'types'));
    ensureDir(path.join(ROOT, 'letters'));

    // Smoke mode: PRERENDER_LIMIT=N renders N of each section only.
    const limit = process.env.PRERENDER_LIMIT ? parseInt(process.env.PRERENDER_LIMIT) : 0;
    let runJobs = jobs;
    if (limit) {
      const pick = (pred) => jobs.filter(pred).slice(0, limit);
      runJobs = [
        ...pick((j) => j[0].includes('/vs/')),
        ...pick((j) => j[0].includes('/compatibility/')),
        ...pick((j) => j[0].includes('/types/')),
        ...pick((j) => j[0].includes('/letters/'))
      ];
    }
    let done = 0;
    for (const [url, sel, out] of runJobs) {
      await renderRoute(page, url, sel, out);
      done++;
      if (done % 50 === 0 || done === runJobs.length) console.log(`  rendered ${done}/${runJobs.length}`);
    }

    // 4. Archive: bake the grid into the source file in place.
    await renderArchive(page, `${BASE}/archive`, path.join(ROOT, 'archive.html'));
    console.log('archive grid baked');
  } finally {
    await browser.close();
    server.close();
  }

  // 5. Regenerate the sitemap from disk.
  const total = generateSitemap();
  console.log(`sitemap.xml regenerated from disk: ${total} URLs`);
  console.log('done');
}

main().catch((e) => { console.error(e); process.exit(1); });
