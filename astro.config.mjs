import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@tailwindcss/vite'
import { unified } from '@astrojs/markdown-remark'

const base = (process.env.BASE_PATH || '/').replace(/\/$/, '')

function prefixMarkdownAssets() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'image' && node.url.startsWith('/images/')) {
        node.url = base + node.url
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}

export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: base || '/',
  trailingSlash: 'always',
  // Keep bookmarks from the previous Hexo site's navigation and archives working.
  redirects: {
    '/projects/': '/work/',
    '/search/': '/writing/',
    '/blog/2026/10/': '/writing/',
    '/blog/2026/11/': '/writing/',
    '/blog/2026/': '/writing/',
    '/categories/': '/writing/',
    '/categories/开源/': '/writing/',
    '/categories/折腾记录/': '/writing/',
    '/categories/软件架构/': '/writing/',
    '/tags/c4模型/': '/writing/',
    '/tags/dubbo-go/': '/writing/',
    '/tags/galgame/': '/writing/',
    '/tags/go/': '/writing/',
    '/tags/': '/writing/',
    '/tags/学习笔记/': '/writing/',
    '/tags/开源/': '/writing/',
    '/tags/系统设计/': '/writing/',
    '/tags/计算机网络/': '/writing/',
    '/tags/软件架构/': '/writing/',
    '/tags/远程串流/': '/writing/',
  },
  integrations: [mdx()],
  vite: { plugins: [tailwind()], resolve: { tsconfigPaths: false } },
  markdown: {
    processor: unified({ remarkPlugins: [prefixMarkdownAssets] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  devToolbar: { enabled: false },
})
