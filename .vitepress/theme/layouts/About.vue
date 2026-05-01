<template>
  <div class="p3r-about-page">
    <div class="p3r-container">
      <div class="p3r-about-header">
        <span class="p3r-label">About</span>
        <h1 class="p3r-title p3r-about-title">yumestk</h1>
        <div class="p3r-about-divider"></div>
      </div>

      <div class="p3r-about-body">
        <div class="p3r-about-text">
          <p class="p3r-about-lead">
            Hi, I'm yumestk — a developer passionate about building things for the web.
          </p>
          <p>
            I enjoy working across the full stack, with a particular interest in frontend development,
            user experience, and the intersection of design and engineering.
          </p>
          <p>
            When I'm not coding, I'm probably exploring new technologies, playing games,
            or writing about what I've learned.
          </p>

          <div class="p3r-about-section">
            <h2 class="p3r-about-section-title">Skills</h2>
            <div class="p3r-skills-grid">
              <div v-for="skill in skills" :key="skill.category" class="p3r-skill-group">
                <span class="p3r-label">{{ skill.category }}</span>
                <div class="p3r-skill-tags">
                  <span v-for="tag in skill.items" :key="tag" class="p3r-skill-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p3r-about-section">
            <h2 class="p3r-about-section-title">Connect</h2>
            <SocialLinks :show-labels="true" />
          </div>
        </div>

        <!-- Decorative side panel -->
        <div class="p3r-about-side">
          <div class="p3r-about-card">
            <div class="p3r-about-avatar">
              <span>Y</span>
            </div>
            <div class="p3r-about-card-info">
              <span class="p3r-about-card-name">yumestk</span>
              <span class="p3r-about-card-role">Developer</span>
            </div>
            <div class="p3r-corner-decoration tl"></div>
            <div class="p3r-corner-decoration br"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialLinks from '../components/SocialLinks.vue'

const skills = [
  { category: 'Frontend', items: ['Vue 3', 'TypeScript', 'Vite', 'CSS'] },
  { category: 'Backend', items: ['Java', 'Spring Boot', 'Node.js'] },
  { category: 'Tools', items: ['Git', 'Docker', 'GitHub Actions'] }
]
</script>

<style scoped>
.p3r-about-page {
  padding: 60px 0 100px;
}

.p3r-about-header {
  margin-bottom: 4rem;
}

.p3r-about-title {
  font-size: clamp(3rem, 8vw, 6rem);
  margin: 0.4rem 0 2rem;
}

.p3r-about-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--p3r-accent) 0%, transparent 50%);
}

.p3r-about-body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 4rem;
  align-items: start;
}

.p3r-about-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.p3r-about-text p {
  font-size: 1.05rem;
  color: var(--p3r-text-secondary);
  line-height: 1.8;
  margin: 0;
}

.p3r-about-lead {
  font-size: 1.3rem !important;
  color: var(--p3r-text-primary) !important;
  font-weight: 500;
}

.p3r-about-section {
  margin-top: 1rem;
}

.p3r-about-section-title {
  font-family: var(--p3r-font-en);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--p3r-text-primary);
  margin: 0 0 1.25rem;
}

.p3r-skills-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.p3r-skill-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.p3r-skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.p3r-skill-tag {
  font-family: var(--p3r-font-en);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.3rem 0.75rem;
  background: var(--p3r-bg-card);
  border: 1px solid var(--p3r-border);
  color: var(--p3r-text-secondary);
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  transition: all var(--p3r-transition);
}

.p3r-skill-tag:hover {
  border-color: var(--p3r-accent);
  color: var(--p3r-accent);
  background: var(--p3r-accent-subtle);
}

.p3r-about-card {
  background: var(--p3r-bg-card);
  border: 1px solid var(--p3r-border);
  clip-path: var(--p3r-clip-card);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  text-align: center;
}

.p3r-about-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--p3r-accent) 0%, var(--p3r-accent-bright) 100%);
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--p3r-font-en);
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
}

.p3r-about-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.p3r-about-card-name {
  font-family: var(--p3r-font-en);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--p3r-text-primary);
}

.p3r-about-card-role {
  font-family: var(--p3r-font-en);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--p3r-accent);
}

@media (max-width: 900px) {
  .p3r-about-body {
    grid-template-columns: 1fr;
  }

  .p3r-about-side {
    order: -1;
  }

  .p3r-about-card {
    flex-direction: row;
    text-align: left;
  }
}
</style>
