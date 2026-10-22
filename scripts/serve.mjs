import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.json':'application/json', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8' };
const build = () => {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) console.error('Build failed. Fix the reported error and save again.');
  return result.status === 0;
};
if (process.argv.includes('--watch')) {
  if (!build()) process.exit(1);
  let timer;
  const rebuild = () => { clearTimeout(timer); timer = setTimeout(build, 120); };
  for (const name of ['src', 'content', 'public']) watch(path.join(root, name), { recursive: true }, rebuild);
  watch(path.join(root, 'site.config.json'), rebuild);
}
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(dist, '.' + pathname);
    if (!file.startsWith(dist + path.sep) && file !== dist) { response.writeHead(403); response.end('Forbidden'); return; }
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      response.end(body);
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
      response.writeHead(404, { 'Content-Type': types['.html'] });
      response.end(await readFile(path.join(dist, '404.html')));
    }
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 500);
    response.end(error instanceof URIError ? 'Bad request' : 'Server error');
    if (!(error instanceof URIError)) console.error(error);
  }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
