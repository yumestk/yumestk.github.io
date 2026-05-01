import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'yumestk',
  description: 'Personal blog and portfolio',
  base: '/blog-web/',

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Source+Han+Sans+CN:wght@300;400;500;700&display=swap'
      }
    ],
    ['meta', { name: 'theme-color', content: '#0a0c10' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'og:site_name', content: 'yumestk' }],
    // SPA redirect handler for GitHub Pages 404 fallback
    [
      'script',
      {},
      `(function(){var r=sessionStorage.getItem('redirect');if(r){sessionStorage.removeItem('redirect');history.replaceState(null,null,r);}})();`
    ]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yumestk' }
    ]
  },

  vite: {
    css: {
      preprocessorOptions: {}
    }
  },

  // Markdown config
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro'
    }
  },

  // Sitemap for SEO
  sitemap: {
    hostname: 'https://yumestk.github.io/blog-web/'
  }
})
