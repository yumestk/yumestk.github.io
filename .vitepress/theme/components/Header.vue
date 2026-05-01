<template>
  <header class="p3r-header" :class="{ scrolled: isScrolled }">
    <div class="p3r-header-inner">
      <a href="/" class="p3r-logo">
        <span class="p3r-logo-bracket">[</span>
        <span class="p3r-logo-text">YUMESTK</span>
        <span class="p3r-logo-bracket">]</span>
      </a>

      <nav class="p3r-nav" :class="{ open: menuOpen }">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          class="p3r-nav-link"
          :class="{ active: isActive(item.link) }"
          @click="menuOpen = false"
        >
          {{ item.text }}
        </a>
      </nav>

      <div class="p3r-header-actions">
        <button class="p3r-theme-toggle" @click="$emit('toggle-dark')" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <span class="p3r-theme-icon">{{ isDark ? '◐' : '◑' }}</span>
        </button>
        <button class="p3r-menu-btn" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
          <span class="p3r-menu-line" :class="{ open: menuOpen }"></span>
          <span class="p3r-menu-line" :class="{ open: menuOpen }"></span>
          <span class="p3r-menu-line" :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

defineProps<{ isDark: boolean }>()
defineEmits(['toggle-dark'])

const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { text: 'Home', link: '/' },
  { text: 'Blog', link: '/blog/' },
  { text: 'About', link: '/about' }
]

const isActive = (link: string) => {
  return route.path === link || route.path.startsWith(link + '/')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.p3r-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--p3r-nav-height);
  background: transparent;
  transition: background var(--p3r-transition), border-color var(--p3r-transition);
}

.p3r-header.scrolled {
  background: var(--p3r-bg-nav);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--p3r-border);
}

.p3r-header-inner {
  max-width: var(--p3r-max-width);
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.p3r-logo {
  font-family: var(--p3r-font-en);
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.12em;
  text-decoration: none;
  color: var(--p3r-text-primary);
  transition: color var(--p3r-transition);
  white-space: nowrap;
}

.p3r-logo-bracket {
  color: var(--p3r-accent);
}

.p3r-logo:hover {
  color: var(--p3r-accent);
}

.p3r-nav {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.p3r-nav-link {
  font-family: var(--p3r-font-en);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--p3r-text-secondary);
  transition: color var(--p3r-transition);
  position: relative;
}

.p3r-nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--p3r-accent);
  transition: width var(--p3r-transition);
}

.p3r-nav-link:hover,
.p3r-nav-link.active {
  color: var(--p3r-accent);
}

.p3r-nav-link:hover::after,
.p3r-nav-link.active::after {
  width: 100%;
}

.p3r-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.p3r-theme-toggle {
  background: none;
  border: 1px solid var(--p3r-border);
  color: var(--p3r-text-secondary);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  transition: all var(--p3r-transition);
}

.p3r-theme-toggle:hover {
  border-color: var(--p3r-accent);
  color: var(--p3r-accent);
  background: var(--p3r-accent-subtle);
}

.p3r-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.p3r-menu-line {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--p3r-text-primary);
  transition: all var(--p3r-transition);
}

@media (max-width: 768px) {
  .p3r-menu-btn {
    display: flex;
  }

  .p3r-nav {
    position: fixed;
    top: var(--p3r-nav-height);
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--p3r-bg-nav);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--p3r-border);
    padding: 1rem 0;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all var(--p3r-transition);
  }

  .p3r-nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .p3r-nav-link {
    padding: 0.75rem 2rem;
    width: 100%;
  }
}
</style>
