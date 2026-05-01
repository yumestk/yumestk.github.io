<template>
  <div class="p3r-blog-list-page">
    <div class="p3r-container">
      <!-- Page header -->
      <div class="p3r-page-header">
        <span class="p3r-label">Writing</span>
        <h1 class="p3r-title p3r-page-title">Blog</h1>
        <p class="p3r-page-subtitle">{{ posts.length }} articles on development, design, and more.</p>
        <div class="p3r-page-divider"></div>
      </div>

      <!-- Posts list -->
      <div v-if="loading" class="p3r-loading">
        <span class="p3r-label">Loading...</span>
      </div>
      <div v-else-if="posts.length === 0" class="p3r-empty">
        <span class="p3r-label">No posts yet. Check back soon.</span>
      </div>
      <div v-else class="p3r-posts-list">
        <a
          v-for="post in posts"
          :key="post.url"
          :href="post.url"
          class="p3r-post-item"
        >
          <div class="p3r-post-item-left">
            <time class="p3r-post-item-date">{{ formatDate(post.date) }}</time>
          </div>
          <div class="p3r-post-item-right">
            <h2 class="p3r-post-item-title">{{ post.title }}</h2>
            <p class="p3r-post-item-abstract">{{ post.abstract }}</p>
            <span class="p3r-post-item-read">
              Read more
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Post {
  title: string
  date: string
  abstract: string
  url: string
}

const posts = ref<Post[]>([])
const loading = ref(true)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

onMounted(async () => {
  try {
    const modules = import.meta.glob('/blog/*.md', { eager: true })
    const allPosts: Post[] = []

    for (const [path, mod] of Object.entries(modules)) {
      const m = mod as any
      const fm = m?.frontmatter || m?.default?.frontmatter
      if (fm?.title && fm?.date) {
        const slug = path.replace('/blog/', '').replace('.md', '')
        allPosts.push({
          title: fm.title,
          date: fm.date,
          abstract: fm.abstract || '',
          url: `/blog/${slug}`
        })
      }
    }

    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    posts.value = allPosts
  } catch (e) {
    console.error('Failed to load posts', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.p3r-blog-list-page {
  padding: 60px 0 100px;
}

.p3r-page-header {
  margin-bottom: 4rem;
}

.p3r-page-title {
  font-size: clamp(3rem, 8vw, 6rem);
  margin: 0.4rem 0 0.75rem;
}

.p3r-page-subtitle {
  font-size: 1.05rem;
  color: var(--p3r-text-secondary);
  margin: 0 0 2rem;
}

.p3r-page-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--p3r-accent) 0%, transparent 50%);
}

.p3r-posts-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.p3r-post-item {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--p3r-divider);
  text-decoration: none;
  color: inherit;
  transition: background var(--p3r-transition);
  position: relative;
}

.p3r-post-item::before {
  content: '';
  position: absolute;
  left: -2rem;
  right: -2rem;
  top: 0;
  bottom: 0;
  background: var(--p3r-accent-subtle);
  opacity: 0;
  transition: opacity var(--p3r-transition);
}

.p3r-post-item:hover::before {
  opacity: 1;
}

.p3r-post-item-left {
  padding-top: 0.25rem;
}

.p3r-post-item-date {
  font-family: var(--p3r-font-en);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--p3r-accent);
}

.p3r-post-item-right {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.p3r-post-item-title {
  font-family: var(--p3r-font-en);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--p3r-text-primary);
  margin: 0;
  transition: color var(--p3r-transition);
}

.p3r-post-item:hover .p3r-post-item-title {
  color: var(--p3r-accent);
}

.p3r-post-item-abstract {
  font-size: 0.9rem;
  color: var(--p3r-text-secondary);
  line-height: 1.65;
  margin: 0;
}

.p3r-post-item-read {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--p3r-font-en);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--p3r-accent);
  margin-top: 0.25rem;
}

.p3r-loading,
.p3r-empty {
  padding: 4rem 0;
  text-align: center;
}

@media (max-width: 640px) {
  .p3r-post-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
