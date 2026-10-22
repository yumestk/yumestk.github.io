# 写作与维护

需要 Node.js 20.19 或更新版本，推荐 Node.js 22。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址。关于页在 `source/about/index.md`，项目页在 `source/projects/index.md`，图片放在 `source/images/`。公开图片链接以 `/images/` 开头。

## 新建文章

```sh
npm run new -- "my-first-post"
```

编辑 `source/_posts/my-first-post.md`：

```markdown
---
title: 第一篇记录
date: 2026-10-22 12:00:00
categories:
  - 随笔
tags:
  - 生活
description: 今天想记下的一点小事。
cover: /images/home-cover.jpg
---

从这里开始写正文，不需要重复一级标题。
```

日期使用中国标准时间。文件名建议使用小写英文、数字和连字符，文章地址保持 `/blog/文件名/`。

## 草稿

`npx hexo new draft my-draft` 新建草稿，保存在 `source/_drafts/`，不会出现在公开构建中。完成后运行 `npx hexo publish my-draft`。

## 配置与发布

- `_config.yml`：站点名称、作者、域名、文章地址等。
- `_config.butterfly.yml`：主题、导航、社交链接、封面、侧栏、搜索等。
- `source/css/custom.css`：封面到卡片的过渡和暖色调样式。
- `source/js/site.js`：独立搜索页调用主题自带搜索。

构建后检查，再提交推送：

```sh
npm run build
npm run check
git add -A
git commit -m "更新博客"
git push
```

`public/` 是生成结果，已加入忽略列表。GitHub Actions 构建后发布到 GitHub Pages。

使用 npm 锁文件中的 Butterfly 5.7.0，不修改其包内源码。升级前在分支测试。旧版源码可通过迁移前的 Git 历史恢复。当前还没有接入网页写作后台。

## 依赖维护

截至 2026-10-22，Hexo 构建工具链的部分传递依赖存在 npm audit 告警（主要是 braces、sprintf-js 的拒绝服务问题，当前上游没有已发布的修复版本）。这些依赖用于本地和 CI 构建，不随网站运行在访客浏览器中。只构建作者自己维护的可信内容；后续升级时复查，不通过强制降级 Hexo 来消除告警。
