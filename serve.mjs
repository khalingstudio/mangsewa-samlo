// Tiny local web server for the exported site (no packages needed).  Run:  node serve.mjs   then open http://localhost:8080
// It sends the two headers the in-browser database needs and falls back to index.html for app pages.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'docs');
const port = Number(process.env.PORT) || 8080;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.db': 'application/octet-stream', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[\\/]+/, '');
  let file = join(root, path);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { file = join(root, 'index.html'); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, () => console.log(`Site running at http://localhost:${port}`));
