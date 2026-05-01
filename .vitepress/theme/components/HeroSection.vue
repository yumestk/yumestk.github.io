<template>
  <section class="p3r-hero">
    <!-- Background geometric elements -->
    <div class="p3r-hero-bg">
      <div class="p3r-hero-grid"></div>
      <div class="p3r-hero-glow"></div>
    </div>

    <div class="p3r-container p3r-hero-content">
      <div class="p3r-hero-eyebrow">
        <span class="p3r-label">Personal Portfolio</span>
        <span class="p3r-hero-line"></span>
      </div>

      <h1 class="p3r-hero-title">
        <span class="p3r-hero-title-sub">Hello, I'm</span>
        <span class="p3r-hero-title-main">yumestk</span>
      </h1>

      <p class="p3r-hero-desc">
        A developer who loves building things for the web.<br>
        Exploring ideas through code, design, and writing.
      </p>

      <div class="p3r-hero-actions">
        <a href="/blog/" class="p3r-btn">
          Read Blog
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <SocialLinks :show-labels="true" />
      </div>

      <!-- Decorative corner elements -->
      <div class="p3r-corner-decoration tl"></div>
      <div class="p3r-corner-decoration tr"></div>
      <div class="p3r-corner-decoration bl"></div>
      <div class="p3r-corner-decoration br"></div>
    </div>

    <!-- Scroll indicator -->
    <div class="p3r-hero-scroll">
      <span class="p3r-label">Scroll</span>
      <div class="p3r-hero-scroll-line"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
</script>

<style scoped>
.p3r-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.p3r-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.p3r-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--p3r-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--p3r-border) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.4;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

.p3r-hero-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, var(--p3r-accent-glow) 0%, transparent 70%);
  filter: blur(40px);
}

.p3r-hero-content {
  position: relative;
  z-index: 1;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.p3r-hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.p3r-hero-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: var(--p3r-accent);
  opacity: 0.6;
}

.p3r-hero-title {
  display: flex;
  flex-direction: column;
  margin: 0 0 1.5rem;
  line-height: 1;
}

.p3r-hero-title-sub {
  font-family: var(--p3r-font-en);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--p3r-text-muted);
  margin-bottom: 0.3rem;
}

.p3r-hero-title-main {
  font-family: var(--p3r-font-en);
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--p3r-text-primary) 40%, var(--p3r-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 0.9;
}

.p3r-hero-desc {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: var(--p3r-text-secondary);
  line-height: 1.7;
  max-width: 480px;
  margin: 0 0 2.5rem;
}

.p3r-hero-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.p3r-hero-scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
}

.p3r-hero-scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--p3r-accent), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.2); }
}

@media (max-width: 768px) {
  .p3r-hero-scroll {
    display: none;
  }
}
</style>
