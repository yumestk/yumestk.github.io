<template>
  <footer class="p3r-footer">
    <div class="p3r-footer-inner p3r-container">
      <div class="p3r-footer-top">
        <div class="p3r-footer-brand">
          <span class="p3r-logo-bracket">[</span>
          <span>YUMESTK</span>
          <span class="p3r-logo-bracket">]</span>
        </div>
        <SocialLinks />
      </div>
      <div class="p3r-footer-divider"></div>
      <div class="p3r-footer-bottom">
        <span class="p3r-footer-copy">© 2026 yumestk. All rights reserved.</span>
        <span class="p3r-footer-built">Built with VitePress</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
</script>

<style scoped>
.p3r-footer {
  border-top: 1px solid var(--p3r-border);
  background: var(--p3r-bg-secondary);
  margin-top: auto;
}

.p3r-footer-inner {
  padding: 3rem 2rem 2rem;
}

.p3r-footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.p3r-footer-brand {
  font-family: var(--p3r-font-en);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  color: var(--p3r-text-primary);
}

.p3r-logo-bracket {
  color: var(--p3r-accent);
}

.p3r-footer-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--p3r-accent) 0%, transparent 50%);
  margin-bottom: 1.5rem;
}

.p3r-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.p3r-footer-copy,
.p3r-footer-built {
  font-family: var(--p3r-font-en);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--p3r-text-muted);
}
</style>
