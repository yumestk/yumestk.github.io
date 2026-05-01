import DefaultTheme from 'vitepress/theme'
import Layout from './layouts/Layout.vue'
import './styles/vars.css'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Register global components here if needed
  }
}
