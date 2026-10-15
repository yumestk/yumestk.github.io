import test from 'node:test';
import assert from 'node:assert/strict';
import { escape, parsePost, projectLink } from './content.mjs';

const source = `---\ntitle: 第一篇记录\ndate: 2026-10-15\ncategory: 学习\n---\n## 一个开始\n\n带着好奇心 **出发**。`;
test('Markdown becomes a searchable static article; drafts and invalid metadata are rejected', () => {
  const post = parsePost('first-post.md', source);
  assert.equal(post.url, '/blog/first-post/');
  assert.equal(post.date, '2026-10-15');
  assert.equal(post.category, '学习');
  assert.match(post.html, /<strong>出发<\/strong>/);
  assert.match(post.search, /好奇心/);
  assert.equal(parsePost('draft.md', source.replace('title:', 'draft: true\ntitle:')), null);
  assert.throws(() => parsePost('invalid.md', source.replace('2026-10-15', '2026-02-30')), /date/);
  assert.throws(() => parsePost('invalid.md', source.replace('title: 第一篇记录\n', '')), /title/);
  assert.throws(() => parsePost('../escape.md', source), /文件名/);
  assert.equal(escape('<b>" &'), '&lt;b&gt;&quot; &amp;');
  assert.throws(() => projectLink('javascript:alert(1)'));
  assert.equal(projectLink('https://github.com/yumestk'), 'https://github.com/yumestk');
});
