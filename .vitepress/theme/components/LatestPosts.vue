<template>
  <div class="p3r-latest-posts">
    <div v-if="loading" class="p3r-posts-loading">
      <span class="p3r-label">Loading...</span>
    </div>
    <div v-else class="p3r-posts-grid">
      <a
        v-for="post in posts"
        :key="post.url"
        :href="post.url"
        class="p3r-post-card"
      >
        <div class="p3r-post-meta">
          <time class="p3r-post-date">{{ formatDate(post.date) }}</time>
        </div>
        <h3 class="p3r-post-title">{{ post.title }}</h3>
        <p class="p3r-post-abstract">{{ post.abstract }}</p>
        <span class="p3r-post-read">
          Read more
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })

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
    // VitePress provides data() from createContentLoader in config
    // We use a static import approach via glob
    const modules = import.meta.glob('/blog/*.md', { eager: true })
    const allPosts: Post[] = []

    for (const [path, mod] of Object.entries(modules)) {
      const m = mod as any
      const fm = m?.frontmatter || m?.default?.frontmatter
      if (fm?.title && fm?.date) {
        const url = path.replace('/blog/', '/blog-web/blog/').replace('.md', '')
        allPosts.push({
          title: fm.title,
          date: fm.date,
          abstract: fm.abstract || '',
          url
        })
      }
    }

    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    posts.value = allPosts.slice(0, props.limit)
  } catch (e) {
    console.error('Failed to load posts', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.p3r-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.p3r-post-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem;
  background: var(--p3r-bg-card);
  border: 1px solid var(--p3r-border);
  clip-path: var(--p3r-clip-card);
  text-decoration: none;
  color: inherit;
  transition: transform var(--p3r-transition), box-shadow var(--p3r-transition), border-color var(--p3r-transition);
}

.p3r-post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--p3r-shadow-hover);
  border-color: var(--p3r-border-strong);
}

.p3r-post-date {
  font-family: var(--p3r-font-en);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--p3r-accent);
}

.p3r-post-title {
  font-family: var(--p3r-font-en);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--p3r-text-primary);
  margin: 0;
  line-height: 1.3;
  transition: color var(--p3r-transition);
}

.p3r-post-card:hover .p3r-post-title {
  color: var(--p3r-accent);
}

.p3r-post-abstract {
  font-size: 0.875rem;
  color: var(--p3r-text-secondary);
  line-height: 1.65;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.p3r-post-read {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--p3r-font-en);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--p3r-accent);
  margin-top: auto;
}

.p3r-posts-loading {
  padding: 2rem;
  text-align: center;
}
</style>
