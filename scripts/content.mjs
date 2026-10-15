import { parse as parseYaml } from 'yaml';
import { marked } from 'marked';

export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const dateLabel = value => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(value));
export const plainText = value => value.replace(/<[^>]*>/g, ' ').replace(/[#*`\[\]()>_~]/g, ' ').replace(/\s+/g, ' ').trim();

export function parsePost(filename, source) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)) throw new Error(`文章文件名请使用小写英文和连字符：${filename}`);
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const data = frontmatter ? parseYaml(frontmatter[1]) : {};
  const content = frontmatter ? source.slice(frontmatter[0].length) : source;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`${filename} 的文章信息必须是对象`);
  if (data.draft === true) return null;
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${filename} 缺少 title`);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date || '');
  const parsed = new Date(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error(`${filename} 的 date 必须是有效的 YYYY-MM-DD`);
  const body = plainText(content);
  const description = String(data.description || data.abstract || body.slice(0, 110));
  return { title: data.title.trim(), date, description, category: String(data.category || '随笔'), url: `/blog/${filename.slice(0, -3)}/`, html: marked.parse(content), search: `${data.title} ${description} ${body}`.toLocaleLowerCase() };
}

export function projectLink(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`项目链接仅支持 http/https：${value}`);
  return url.href;
}
