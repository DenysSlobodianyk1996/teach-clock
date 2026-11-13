import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { customMediaPlugin } from './src/styles/media.ts'

/** The middle theme's background (--bg in src/styles/theme.css). */
const themeColor = '#1d4b5c'

/** The Android App build (`npm run build:android`); src/platform.ts reads the same var for the app. */
const isAndroidApp = process.env.VITE_TARGET === 'android'

/**
 * GitHub Pages serves the app from /teach-clock/; everywhere else, the Android App included, it
 * lives at the root.
 */
const base = process.env.GITHUB_PAGES && !isAndroidApp ? '/teach-clock/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  server: { port: 4200, strictPort: true },
  // Shared breakpoints such as `@media (--phone)`, defined once in src/styles/media.ts.
  css: { postcss: { plugins: [customMediaPlugin] } },
  plugins: [
    vue(),
    vueDevTools(),
    // Offline and installable (ticket 11). The service worker precaches the whole app on the
    // first visit; src/pwa.ts registers it and applies updates only between Rounds.
    // Off in the Android App: the game is packaged inside it, so there is no service worker and
    // no manifest (ADR 0004). `disable` still answers src/pwa.ts's import, which main.ts never
    // calls there.
    VitePWA({
      disable: isAndroidApp,
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: 'Вчимо годинник',
        // Short enough to fit under a home-screen icon.
        short_name: 'Годинник',
        description: 'Гра, яка вчить дітей читати й ставити час на годиннику зі стрілками.',
        lang: 'uk',
        theme_color: themeColor,
        background_color: themeColor,
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Everything the build emits, fonts included, so every Game works offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
