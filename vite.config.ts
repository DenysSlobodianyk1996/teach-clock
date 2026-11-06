import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

/** The middle theme's background (--bg in src/styles/theme.css). */
const themeColor = '#1d4b5c'

/** GitHub Pages serves the app from /teach-clock/; everywhere else it lives at the root. */
const base = process.env.GITHUB_PAGES ? '/teach-clock/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  server: { port: 4200, strictPort: true },
  plugins: [
    vue(),
    vueDevTools(),
    // Offline and installable (ticket 11). The service worker precaches the whole app on the
    // first visit; src/pwa.ts registers it and applies updates only between Rounds.
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: 'Teach Clock',
        short_name: 'Teach Clock',
        description: 'A game that teaches children to read and set an analogue clock.',
        lang: 'en',
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
