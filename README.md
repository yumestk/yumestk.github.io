# yumestk 的博客

原生 HTML、CSS 和 JavaScript，无前端框架。参考 [caicaiis.cc](https://caicaiis.cc/) 的白底、淡网格、留白和个人主页布局，使用自己的头像与内容。

## 本地运行

需要 Node.js 20 或更新版本（推荐 22）。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址。编辑 `src/`、`content/`、`public/` 或 `site.config.json` 后会重新构建，刷新浏览器查看。`npm run build` 生成 `dist/`，`npm run preview` 预览构建结果。

## 写文章

在 `content/posts/` 新建 Markdown 文件，文件名使用小写英文、数字和连字符，例如 `my-first-post.md`：

```markdown
---
title: 第一篇记录
date: 2026-10-15
description: 今天想记下的一点小事。
category: 随笔
---

从这里开始写正文。标题已由页面生成，不用再写一级标题。

## 一个小标题

支持 Markdown 链接、图片、列表和代码块。
```

保存后首页、文章列表、分类、搜索和 sitemap 都会自动更新。搜索涵盖文章标题、摘要和全文。设置 `draft: true` 可保留草稿而不发布。Markdown 仅用于作者自己的可信内容，不要直接导入未经检查的外部 HTML。

## 修改内容

- `site.config.json`：名字、介绍、标语、GitHub 链接和网站域名。
- `public/avatar.png`：首页、导航栏和关于页头像，目前为仓库所有者的 GitHub 头像快照。
- `content/about.md`：关于页面。
- `public/projects.json`：真实项目，初始为空。每项包含 `name`、`description` 和完整 `url`。
- `src/styles.css`：页面样式；`src/layout.html`：通用页面外壳。
- `scripts/build.mjs`：静态页面生成；`src/main.js`：搜索与分类筛选。

主页介绍和关于页文字是可编辑的初稿。文章和示例项目均已清空，旧版可从 Git 历史 `e7e38c1` 找回。

## 验证与发布

```sh
npm run check
npm run build
```

GitHub Actions 会验证 Pull Request。合并到 `main` 后自动构建并发布 `dist/` 到 GitHub Pages。仓库 Settings → Pages 的构建来源应为 GitHub Actions。实际访问域名为 <https://yumestk.github.io/>，不依赖额外托管服务。
