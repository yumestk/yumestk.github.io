---
title: Building a P3R-Inspired Blog with VitePress
date: 2026-04-28
abstract: How I designed and built this blog using VitePress, Vue 3, and a heavy dose of Persona 3 Reload's iconic UI aesthetic.
---

# Building a P3R-Inspired Blog with VitePress

When I decided to build a personal blog, I knew I wanted it to look different. Not just another minimal white blog. I wanted something with personality — dark, geometric, with that electric blue that makes Persona 3 Reload's UI so memorable.

## The Design Language

Persona 3 Reload's UI is famous for a reason. It combines:

- **Deep navy/black backgrounds** that make content pop
- **Electric blue accents** used sparingly but powerfully
- **Geometric clip-paths** — those signature cut corners
- **Tight typography** with generous whitespace

The challenge was translating a game UI into a functional website without it feeling like a costume.

## Technical Approach

### VitePress as the Foundation

VitePress is perfect for this use case. It handles:

- Markdown rendering with syntax highlighting
- Static site generation for GitHub Pages
- Vue 3 component integration
- Fast HMR during development

### Custom Theme Architecture

The key insight is that VitePress lets you completely replace the default theme. My `theme/index.ts` exports a custom `Layout.vue` that handles routing between different page types:

```typescript
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // register global components
  }
}
```

### CSS Variables for Theming

All colors live in CSS custom properties, making dark/light mode trivial:

```css
:root {
  --p3r-accent: #0066ff;
  --p3r-bg-primary: #f0f2f5;
}

.dark {
  --p3r-accent: #2d8cff;
  --p3r-bg-primary: #0a0c10;
}
```

### Clip-Path for Geometry

The cut-corner effect is pure CSS:

```css
clip-path: polygon(
  0 0,
  calc(100% - 16px) 0,
  100% 16px,
  100% 100%,
  16px 100%,
  0 calc(100% - 16px)
);
```

## What I Learned

Building a custom VitePress theme is more involved than using the default, but the flexibility is worth it. The main gotcha is that you need to handle all the layout concerns yourself — navigation, dark mode persistence, responsive design.

The result is a site that feels distinctly mine. That's worth the extra work.
