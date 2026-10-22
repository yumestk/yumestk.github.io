const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../public');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
for (const route of ['index.html', 'blog/index.html', 'about/index.html', 'projects/index.html', 'categories/index.html', 'tags/index.html', 'search/index.html', '404.html', 'sitemap.xml', 'search.json']) {
  assert(fs.existsSync(path.join(root, route)), `Missing route: ${route}`);
}
const home = read('index.html');
assert.match(home, /Hexo/);
assert.match(home, /home-cover\.jpg/);
assert(fs.existsSync(path.join(root, 'lib/fontawesome/css/all.min.css')));
assert(Array.isArray(JSON.parse(read('search.json'))));
const pages = [];
function visit(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (file.endsWith('.html')) pages.push(file);
  }
}
visit(root);
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const dest = path.join(root, decodeURIComponent(href));
    assert(fs.existsSync(dest) || fs.existsSync(path.join(dest, 'index.html')), `Broken link in ${path.relative(root,file)}: ${href}`);
  }
}
console.log(`Verified ${pages.length} pages, local assets and search index.`);
