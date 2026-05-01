<template>
  <div class="p3r-home">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Projects Section -->
    <section class="p3r-section p3r-projects-section">
      <div class="p3r-container p3r-section-header">
        <span class="p3r-label">Portfolio</span>
        <h2 class="p3r-title p3r-section-title">Projects</h2>
        <p class="p3r-section-subtitle">Things I've built and shipped.</p>
      </div>

      <div v-if="projectsLoading" class="p3r-container">
        <span class="p3r-label">Loading projects...</span>
      </div>
      <ProjectCarousel v-else :projects="projects" />

      <!-- Social links at bottom of projects -->
      <div class="p3r-container p3r-projects-footer">
        <SocialLinks :show-labels="true" />
      </div>
    </section>

    <!-- Latest Blog Section -->
    <section class="p3r-section p3r-blog-section">
      <div class="p3r-container">
        <div class="p3r-section-header">
          <span class="p3r-label">Writing</span>
          <h2 class="p3r-title p3r-section-title">Latest Posts</h2>
          <p class="p3r-section-subtitle">Thoughts on development, design, and everything in between.</p>
        </div>

        <LatestPosts :limit="3" />

        <div class="p3r-blog-more">
          <a href="/blog/" class="p3r-btn">
            View all posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectCarousel from '../components/ProjectCarousel.vue'
import LatestPosts from '../components/LatestPosts.vue'
import SocialLinks from '../components/SocialLinks.vue'

interface Project {
  id: string | number
  name: string
  description: string
  emoji: string
  url: string
  tags: string[]
}

const projects = ref<Project[]>([])
const projectsLoading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/projects.json')
    projects.value = await res.json()
  } catch (e) {
    console.error('Failed to load projects', e)
  } finally {
    projectsLoading.value = false
  }
})
</script>

<style scoped>
.p3r-home {
  overflow-x: hidden;
}

.p3r-section-header {
  margin-bottom: 3rem;
}

.p3r-section-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0.4rem 0 0.75rem;
}

.p3r-section-subtitle {
  font-size: 1.05rem;
  color: var(--p3r-text-secondary);
  margin: 0;
  max-width: 480px;
}

.p3r-projects-section {
  background: var(--p3r-bg-secondary);
  position: relative;
  overflow: hidden;
}

.p3r-projects-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--p3r-accent), transparent);
}

.p3r-projects-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--p3r-border);
}

.p3r-blog-section {
  position: relative;
}

.p3r-blog-more {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}
</style>
