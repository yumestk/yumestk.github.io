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
  integrations: [mdx()],
  vite: { plugins: [tailwind()], resolve: { tsconfigPaths: false } },
  markdown: {
    processor: unified({ remarkPlugins: [prefixMarkdownAssets] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  devToolbar: { enabled: false },
})
