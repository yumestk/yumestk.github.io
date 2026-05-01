<template>
  <div class="p3r-app" :class="{ dark: isDark }">
    <Header :is-dark="isDark" @toggle-dark="toggleDark" />
    <main class="p3r-main">
      <template v-if="frontmatter.layout === 'home'">
        <HomePage />
      </template>
      <template v-else-if="frontmatter.layout === 'blog-list'">
        <BlogList />
      </template>
      <template v-else-if="frontmatter.layout === 'about'">
        <About />
      </template>
      <template v-else>
        <div class="p3r-doc-wrapper">
          <div class="p3r-container">
            <article class="p3r-article">
              <div v-if="frontmatter.title" class="p3r-article-header">
                <span class="p3r-label">Blog</span>
                <h1 class="p3r-article-title">{{ frontmatter.title }}</h1>
                <div class="p3r-article-meta">
                  <time v-if="frontmatter.date">{{ formatDate(frontmatter.date) }}</time>
                  <span v-if="frontmatter.abstract" class="p3r-article-abstract">
                    {{ frontmatter.abstract }}
                  </span>
                </div>
                <div class="p3r-article-divider"></div>
              </div>
              <Content class="vp-doc" />
            </article>
          </div>
        </div>
      </template>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import HomePage from './HomePage.vue'
import BlogList from './BlogList.vue'
import About from './About.vue'

const { frontmatter, isDark } = useData()

const toggleDark = () => {
  isDark.value = !isDark.value
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.p3r-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.p3r-main {
  flex: 1;
  padding-top: var(--p3r-nav-height);
}

.p3r-doc-wrapper {
  padding: 60px 0 100px;
}

.p3r-article {
  max-width: 760px;
}

.p3r-article-header {
  margin-bottom: 3rem;
}

.p3r-article-title {
  font-family: var(--p3r-font-en);
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0.5rem 0 1rem;
  background: linear-gradient(135deg, var(--p3r-text-primary) 0%, var(--p3r-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.p3r-article-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--p3r-text-muted);
  font-size: 0.9rem;
}

.p3r-article-abstract {
  font-size: 1.05rem;
  color: var(--p3r-text-secondary);
  line-height: 1.6;
  font-style: italic;
}

.p3r-article-divider {
  margin-top: 2rem;
  height: 1px;
  background: linear-gradient(90deg, var(--p3r-accent) 0%, transparent 60%);
}
</style>
