// Local static server that mimics Vercel routing (filesystem first,
// then the rewrites as a fallback, cleanUrls, redirects). For local
// preview and verification only; not deployed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8800;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.woff': 'font/woff', '.woff2': 'font/woff2' };

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

http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (REDIRECTS.has(pathname)) { res.writeHead(301, { Location: REDIRECTS.get(pathname) }); res.end(); return; }
  let abs = resolveDisk(pathname);
  if (!abs) { const t = rewriteTemplate(pathname); if (t) abs = path.join(ROOT, t); }
  if (!abs || !fs.existsSync(abs)) { res.writeHead(404); res.end('404: ' + pathname); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`serve on http://127.0.0.1:${PORT}`));
