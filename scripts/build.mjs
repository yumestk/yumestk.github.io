import { readFile, writeFile, mkdir, readdir, rm, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { marked } from 'marked';
import { escape as e, dateLabel, parsePost, projectLink } from './content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFile(path.join(root, name), 'utf8');
const config = JSON.parse(await read('site.config.json'));
const projects = JSON.parse(await read('public/projects.json'));
const template = await read('src/layout.html');
const posts = [];
for (const filename of await readdir(path.join(root, 'content/posts'))) {
  if (!filename.endsWith('.md')) continue;
  const post = parsePost(filename, await read(`content/posts/${filename}`));
  if (post) posts.push(post);
}
posts.sort((a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url));
const categories = [...new Set(posts.map(p => p.category))];
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'public'), out, { recursive: true });
await cp(path.join(root, 'src/styles.css'), path.join(out, 'styles.css'));
await cp(path.join(root, 'src/main.js'), path.join(out, 'main.js'));
await writeFile(path.join(out, '.nojekyll'), '');

const icons = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  down: '<path d="M12 5v14m-5-5 5 5 5-5"/>',
  write: '<path d="m16 3 5 5-12 12H4v-5L16 3Zm-3 3 5 5M4 21h16"/>',
  project: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12h18m-10 0v3h2v-3"/>',
  x: '<path d="M4 3h4l12 18h-4L4 3Zm0 18 6.5-7.5M14 10.5 20 3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2-6-2m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.9a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C4.1.6 2.9 1 2.9 1a5 5 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.6V22" transform="translate(2 0) scale(.9)"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const socialLinks = `<div class="social-links">${[['github', 'GitHub'], ['x', 'X']].map(([key, label]) => `<a class="social-link" href="${e(config[key])}" target="_blank" rel="noopener noreferrer" aria-label="在 ${label} 找到 ${e(config.name)}">${icon(key)}<span>${label}</span>${icon('arrow')}</a>`).join('')}</div>`;
const divider = (label, target) => `<div class="section-divider"><a href="#${target}">${label}${icon('down')}</a></div>`;
const emptyPosts = `<div class="empty-state"><span class="empty-icon">${icon('write')}</span><h3>新的故事，正在路上。</h3><p>这里还没有文章。下一次相遇，也许就有新的记录。</p></div>`;
const emptyProjects = `<div class="project-empty"><div><span class="small-label">WORK IN PROGRESS</span><h3>想法慢慢发芽，作品慢慢生长。</h3><p>项目整理中，先去 GitHub 逛逛吧。</p></div><a class="round-link" href="${e(config.github)}" target="_blank" rel="noopener noreferrer" aria-label="查看 yumestk 的 GitHub">${icon('arrow')}</a></div>`;

function postList(items) {
  return items.map(post => `<article class="post-row" data-post data-search="${e(post.search)}" data-category="${e(post.category)}"><div class="post-meta"><time datetime="${post.date}">${dateLabel(post.date)}</time><span>·</span><span>${e(post.category)}</span></div><h2><a href="${post.url}">${e(post.title)}${icon('arrow')}</a></h2><p>${e(post.description)}</p></article>`).join('');
}
function projectList() {
  return projects.length ? `<div class="project-list">${projects.map(project => {
    if (!project.name || !project.description) throw new Error('项目必须包含 name、description 和 url');
    return `<a class="project-item" href="${e(projectLink(project.url))}" target="_blank" rel="noopener noreferrer"><span class="empty-icon">${icon('project')}</span><div><h3>${e(project.name)}</h3><p>${e(project.description)}</p></div>${icon('arrow')}</a>`;
  }).join('')}</div>` : emptyProjects;
}
async function page(route, title, description, content, section, type = 'website') {
  const navigation = [['/', '首页', 'home'], ['/blog/', '文章', 'posts'], ['/projects/', '项目', 'projects'], ['/search/', '搜索', 'search'], ['/about/', '关于', 'about']].map(([href, label, key]) => `<a href="${href}"${section === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const data = { title: title ? `${title} · ${config.name}` : config.title, description, brand: config.title, name: config.name, canonical: config.url + route, image: config.url + config.avatar, type, github: config.github, x: config.x, year: new Date().getUTCFullYear(), navigation, content };
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => ['content', 'navigation'].includes(key) ? data[key] : e(data[key]));
  const file = route === '/404.html' ? path.join(out, '404.html') : path.join(out, route, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}
const heading = (label, title, description) => `<header class="page-heading"><span class="small-label">${label}</span><h1>${title}</h1><p>${description}</p></header>`;
await page('/', '', config.description, `
<section class="hero-grid"><div class="hero container"><div class="hero-copy"><span class="hero-eyebrow"><span></span> A LITTLE SPACE ON THE INTERNET</span><h1>${e(config.name)}<span class="title-dot">.</span></h1><p class="tagline">${e(config.tagline)}</p><p class="hero-description">${e(config.description)}</p>${socialLinks}</div><figure class="hero-portrait"><img src="${e(config.avatar)}" alt="${e(config.name)} 的头像" width="350" height="350" fetchpriority="high"><figcaption>HELLO, WORLD <span>✳</span></figcaption></figure></div></section>
${divider('我写的文章', 'writing')}
<section class="container home-section" id="writing"><div class="section-heading"><div><span class="small-label">WORDS & THOUGHTS</span><h2>文章</h2></div><span class="section-note">一些思考，一点记录。</span></div>${posts.length ? postList(posts.slice(0, 5)) : emptyPosts}<a class="text-link" href="/blog/">查看所有文章 <span>→</span></a></section>
${divider('我在做的事情', 'projects')}
<section class="container home-section" id="projects"><div class="section-heading"><div><span class="small-label">IDEAS INTO THINGS</span><h2>项目</h2></div><span class="section-note">把好奇心变成看得见的东西。</span></div>${projectList()}<a class="text-link" href="/projects/">查看所有项目 <span>→</span></a></section>`, 'home');
await page('/blog/', '文章', '一些思考，一点记录。', `<section class="container page-section">${heading('WORDS & THOUGHTS', '文章', '记下学到的，做过的，还有不想忘记的。')}<div class="list-toolbar"><span>${posts.length} 篇文章</span><label>分类 <select id="category" aria-label="按分类筛选"><option value="">全部</option>${categories.map(c => `<option>${e(c)}</option>`).join('')}</select></label></div>${posts.length ? postList(posts) : emptyPosts}${posts.length ? '<p id="no-results" class="no-results" hidden>这个分类还没有文章。</p>' : ''}</section>`, 'posts');
await page('/projects/', '项目', '把想法慢慢变成现实。', `<section class="container page-section">${heading('IDEAS INTO THINGS', '项目', '从一个小小的想法开始。')}${projectList()}</section>`, 'projects');
await page('/search/', '搜索', '寻找留在这里的只言片语。', `<section class="container page-section">${heading('FIND SOMETHING', '搜索', '寻找留在这里的只言片语。')}<label class="search-box">${icon('search')}<input id="search-input" type="search" placeholder="输入关键词，找一篇文章…" aria-label="搜索文章" autocomplete="off"></label><p class="search-count" id="result-count" role="status">${posts.length} 篇文章</p>${postList(posts)}<div class="empty-state" id="no-results"${posts.length ? ' hidden' : ''}><span class="empty-icon">${icon('search')}</span><h3>${posts.length ? '没有找到相关的文章。' : '还没有可以搜索的文章。'}</h3><p>${posts.length ? '换个关键词，再试一次。' : '等第一篇文章发布后，就可以在这里找到它。'}</p></div><noscript><p>开启 JavaScript 可以筛选搜索结果，所有文章仍可直接阅读。</p></noscript></section>`, 'search');
await page('/about/', '关于', '这里是 Kira，爱好音乐、coding、漫画、番剧以及一切有意思的事物', `<section class="container page-section about-section"><aside class="about-aside"><img src="${e(config.avatar)}" alt="${e(config.name)} 的头像" width="160" height="160"><span class="small-label">A LITTLE ABOUT ME</span>${socialLinks}</aside><article class="prose">${marked.parse(await read('content/about.md'))}</article></section>`, 'about');
for (const post of posts) await page(post.url, post.title, post.description, `<article class="container article-page"><a class="back-link" href="/blog/">← 返回文章列表</a><div class="post-meta"><time datetime="${post.date}">${dateLabel(post.date)}</time><span>·</span><span>${e(post.category)}</span></div><h1>${e(post.title)}</h1><p class="article-description">${e(post.description)}</p><div class="prose">${post.html}</div><a class="back-link article-back" href="/blog/">← 继续阅读其他文章</a></article>`, 'posts', 'article');
await page('/404.html', '页面未找到', '这一页暂时不在这里。', `<section class="container page-section">${heading('404 / A LITTLE DETOUR', '好像走远了一点。', '这一页暂时不在这里，也许可以从首页重新出发。')}<a class="text-link" href="/">回到首页 →</a></section>`, '');
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.url}/sitemap.xml\n`);
const routes = ['/', '/blog/', '/projects/', '/search/', '/about/', ...posts.map(p => p.url)];
await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${e(config.url + route)}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${routes.length + 1} pages, ${posts.length} posts → dist/`);
