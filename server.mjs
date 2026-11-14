// Stimulx server for Google Cloud Run (and local use).
// Serves the static build in ./out and the Stimulx Copilot API at /api/copilot.
//
//   npm run build && GEMINI_API_KEY=... node server.mjs

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleCopilot } from './src/server/copilot.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out');
const PORT = Number(process.env.PORT || 8080);
const MAX_BODY_BYTES = 64 * 1024;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json',
};

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('too_large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function serveApi(req, res) {
  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await readBody(req);
    } catch {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request too large.' }));
      return;
    }
  }
  const request = new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers, body });
  const response = await handleCopilot(request, process.env);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    // Next's static export writes /page as page.html; fall back to the app shell.
    try {
      await stat(`${filePath}.html`);
      filePath = `${filePath}.html`;
    } catch {
      filePath = path.join(ROOT, path.extname(urlPath) ? '404.html' : 'index.html');
    }
  }
  try {
    const data = await readFile(filePath);
    const immutable = urlPath.startsWith('/_next/static/');
    res.writeHead(filePath.endsWith('404.html') ? 404 : 200, {
      'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}

http
  .createServer((req, res) => {
    const handler = req.url.split('?')[0] === '/api/copilot' ? serveApi : serveStatic;
    handler(req, res).catch((err) => {
      console.error(err);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    });
  })
  .listen(PORT, () => {
    console.log(`Stimulx listening on http://localhost:${PORT}`);
    console.log(process.env.GEMINI_API_KEY ? 'Copilot: Gemini key found.' : 'Copilot: GEMINI_API_KEY is not set; AI generation is disabled.');
  });
