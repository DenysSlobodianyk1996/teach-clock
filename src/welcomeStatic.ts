/**
 * Server-side entry for the prerendered Welcome (batch 31): the English Welcome the GitHub Pages
 * build writes into index.html's #app, so a search engine that runs no JavaScript sees the game. The
 * app mounts over it, with no hydration, in the Player's language. scripts/buildWelcomePage.ts
 * builds this module with Vite and calls `renderWelcome`. Always English: no device, no storage.
 */
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import WelcomeStaticPage from './views/WelcomeStaticPage.vue'
import { createAppI18n } from './i18n'
import { createAppRouter } from './router'

/** The markup for #app, its links under `base` (Vite's base). */
export async function renderWelcome(base: string): Promise<string> {
  return renderToString(
    createSSRApp(WelcomeStaticPage)
      .use(createPinia())
      .use(createAppRouter(createMemoryHistory(base)))
      .use(createAppI18n('en')),
  )
}
