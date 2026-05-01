<template>
  <div class="p3r-carousel-wrapper" ref="wrapperRef">
    <div
      class="p3r-carousel-track"
      ref="trackRef"
      @wheel.prevent="handleWheel"
    >
      <a
        v-for="project in projects"
        :key="project.id"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="p3r-project-card"
      >
        <div class="p3r-card-cover">
          <span class="p3r-card-emoji">{{ project.emoji }}</span>
          <div class="p3r-card-cover-overlay"></div>
        </div>
        <div class="p3r-card-body">
          <div class="p3r-card-tags">
            <span v-for="tag in project.tags" :key="tag" class="p3r-card-tag">{{ tag }}</span>
          </div>
          <h3 class="p3r-card-title">{{ project.name }}</h3>
          <p class="p3r-card-desc">{{ project.description }}</p>
          <div class="p3r-card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </div>
        </div>
        <div class="p3r-card-corner tl"></div>
        <div class="p3r-card-corner tr"></div>
      </a>
    </div>

    <!-- Scroll hint -->
    <div class="p3r-carousel-hint" :class="{ hidden: hasScrolled }">
      <span class="p3r-label">Scroll to explore</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Project {
  id: string | number
  name: string
  description: string
  emoji: string
  url: string
  tags: string[]
}

defineProps<{ projects: Project[] }>()

const trackRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const hasScrolled = ref(false)

const handleWheel = (e: WheelEvent) => {
  if (!trackRef.value) return
  trackRef.value.scrollLeft += e.deltaY * 1.2
  if (!hasScrolled.value) hasScrolled.value = true
}
</script>

<style scoped>
.p3r-carousel-wrapper {
  position: relative;
  overflow: hidden;
}

.p3r-carousel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1rem 2rem 2rem;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
}

.p3r-carousel-track::-webkit-scrollbar {
  display: none;
}

.p3r-carousel-track:active {
  cursor: grabbing;
}

.p3r-project-card {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  background: var(--p3r-bg-card);
  border: 1px solid var(--p3r-border);
  clip-path: var(--p3r-clip-card);
  text-decoration: none;
  color: inherit;
  position: relative;
  transition: transform var(--p3r-transition), box-shadow var(--p3r-transition), border-color var(--p3r-transition);
  overflow: hidden;
}

.p3r-project-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--p3r-shadow-hover);
  border-color: var(--p3r-border-strong);
}

.p3r-card-cover {
  height: 160px;
  background: var(--p3r-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.p3r-card-emoji {
  font-size: 4rem;
  line-height: 1;
  filter: drop-shadow(0 0 20px var(--p3r-accent-glow));
  transition: transform var(--p3r-transition);
}

.p3r-project-card:hover .p3r-card-emoji {
  transform: scale(1.1);
}

.p3r-card-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, var(--p3r-bg-card) 100%);
}

.p3r-card-body {
  padding: 1.25rem 1.5rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.p3r-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.p3r-card-tag {
  font-family: var(--p3r-font-en);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--p3r-accent);
  background: var(--p3r-accent-subtle);
  border: 1px solid var(--p3r-border);
  padding: 0.15rem 0.5rem;
}

.p3r-card-title {
  font-family: var(--p3r-font-en);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--p3r-text-primary);
  margin: 0;
}

.p3r-card-desc {
  font-size: 0.875rem;
  color: var(--p3r-text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.p3r-card-arrow {
  color: var(--p3r-accent);
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--p3r-transition);
  margin-top: 0.5rem;
}

.p3r-project-card:hover .p3r-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.p3r-card-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--p3r-accent);
  border-style: solid;
  opacity: 0;
  transition: opacity var(--p3r-transition);
}

.p3r-card-corner.tl { top: 4px; left: 4px; border-width: 1px 0 0 1px; }
.p3r-card-corner.tr { top: 4px; right: 4px; border-width: 1px 1px 0 0; }

.p3r-project-card:hover .p3r-card-corner {
  opacity: 1;
}

.p3r-carousel-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 2rem;
  color: var(--p3r-text-muted);
  transition: opacity var(--p3r-transition);
}

.p3r-carousel-hint.hidden {
  opacity: 0;
  pointer-events: none;
}

@media (max-width: 768px) {
  .p3r-project-card {
    flex: 0 0 260px;
  }
}
</style>
