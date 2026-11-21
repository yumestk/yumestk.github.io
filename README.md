# yumestk · Personal site V1

Astro 静态站，使用 TypeScript、Tailwind CSS 4、Markdown 和 MDX。本站由此仓库的 GitHub Pages 工作流发布到 https://yumestk.github.io/。

## 本地预览

使用 Node.js 24（`nvm use`）：

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4321
```

打开 http://127.0.0.1:4321/。发布前可运行 `npm run check && npm run build`，通过 `npm run preview` 预览 `dist/`。

## 更新内容

- 个人简介、社交链接、项目、贡献记录和 Side B 的陈列项在 `src/data/site.ts`；完整介绍在 `src/pages/about/index.astro`。
- 文章放在 `src/content/writing/`。可复制一篇已有 Markdown 的文件头，更新 `title`、`date`、`description`、`tags` 和可选的 `cover`。日期建议写成 `"2026-11-21T19:00:00+08:00"`。文章详情保留原博客的 `/blog/文件名/` 结构。
- 图片放在 `public/images/`。已有文章的 `/images/…` 图片路径支持 GitHub Pages 的项目子路径。MDX 中直接写 JSX 图片或站内链接时，使用 `pathTo` 加上站点子路径。
- 全站主题变量和排版在 `src/styles/site.css`。头像在 `public/images/avatar.png`。

## 部署

推送到 `main` 会运行 **Deploy portfolio to GitHub Pages** 工作流，构建并发布 `dist/`。也可以在 **Actions → Deploy portfolio to GitHub Pages → Run workflow** 手动触发。仓库的 **Settings → Pages** 使用 **GitHub Actions** 作为发布来源。

迁移前的 Hexo 源码可在 `hexo-before-astro-v1` 标签查看。
