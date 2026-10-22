const empty = '<section class="empty-posts"><i class="fas fa-feather-alt" aria-hidden="true"></i><h2>新的故事，正在路上。</h2><p>这里还没有文章，新的记录会慢慢补上。</p><a href="/about/">关于我 →</a></section>';

hexo.extend.generator.register('empty-blog', locals => {
  if (locals.posts.length) return [];
  return [
    { path: 'index.html', layout: 'index', data: { __index: true, posts: locals.posts, current: 1, total: 1, base: '', current_url: '', prev: 0, next: 0 } },
    { path: 'blog/index.html', layout: 'page', data: { title: '文章', top_img: false, comments: false, content: empty } }
  ];
});
hexo.extend.filter.register('after_render:html', html => {
  if (hexo.locals.get('posts').length) return html;
  return html.replace('<div class="recent-post-items">', '<div class="recent-post-items">' + empty);
});
