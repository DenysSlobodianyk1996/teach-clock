import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { customMediaPlugin } from './src/styles/media.ts'
import { buildPrivacyPage, type PrivacyPage } from './scripts/buildPrivacyPage.ts'
import { THEME_BG } from './src/themeColors.ts'

/** The Android App build (`npm run build:android`); src/platform.ts reads the same var for the app. */
const isAndroidApp = process.env.VITE_TARGET === 'android'

/**
 * GitHub Pages serves the app from /teach-clock/; everywhere else, the Android App included, it
 * lives at the root.
 */
const base = process.env.GITHUB_PAGES && !isAndroidApp ? '/teach-clock/' : '/'

/**
 * The Web App's static `privacy.html`, the public URL in Google Play's listing. It is rendered from
 * the app's own Privacy Page components (scripts/buildPrivacyPage.ts), so the two look alike and
 * never drift. The dev server serves it too; the service worker precaches it with the rest of the
 * build.
 */
function privacyPagePlugin(): Plugin {
  let root = ''
  let base = '/'
  return {
    name: 'teach-clock-privacy-page',
    configResolved(config) {
      root = config.root
      base = config.base
    },
    configureServer(server) {
      // Built once and kept until a source file changes, so reloads stay fast. Its fonts are served
      // from here: the dev server does not have them under these names.
      let page: Promise<PrivacyPage> | undefined
      server.watcher.on('all', () => (page = undefined))
      const fontTypes: Record<string, string> = { woff2: 'font/woff2', woff: 'font/woff' }
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url.startsWith(`${base}assets/`) && page) {
          const asset = (await page.catch(() => undefined))?.assets.get(url.slice(base.length))
          if (!asset) return next()
          const type = fontTypes[url.split('.').pop()!]
          if (type) res.setHeader('Content-Type', type)
          return res.end(asset)
        }
        if (url !== `${base}privacy.html`) return next()
        try {
          page ??= buildPrivacyPage({ root, base })
          const { html } = await page
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (error) {
          page = undefined
          next(error)
        }
      })
    },
    async generateBundle(_options, bundle) {
      const page = await buildPrivacyPage({ root, base })
      this.emitFile({ type: 'asset', fileName: 'privacy.html', source: page.html })
      // The app's build has these fonts already (same content, same names); emit any it lacks.
      for (const [fileName, source] of page.assets) {
        if (!(fileName in bundle)) this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}

/**
 * Fills the theme backgrounds into index.html (`__THEME_BG_LIGHT__`, `__THEME_BG_DARK__`), from the
 * same module as the manifest and the icons, so the pre-paint script never drifts from theme.css.
 */
function themeColorsPlugin(): Plugin {
  return {
    name: 'teach-clock-theme-colors',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replaceAll('__THEME_BG_LIGHT__', THEME_BG.light)
          .replaceAll('__THEME_BG_DARK__', THEME_BG.dark),
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  server: { port: 4200, strictPort: true },
  // Shared breakpoints such as `@media (--phone)`, defined once in src/styles/media.ts.
  css: { postcss: { plugins: [customMediaPlugin] } },
  plugins: [
    vue(),
    vueDevTools(),
    themeColorsPlugin(),
    // Not in the Android App: it shows the Privacy Page as an app screen and needs no web copy.
    ...(isAndroidApp ? [] : [privacyPagePlugin()]),
    // Offline and installable (ticket 11). The service worker precaches the whole app on the
    // first visit; src/pwa.ts registers it and applies updates only between Rounds.
    // Off in the Android App: the game is packaged inside it, so there is no service worker and
    // no manifest (ADR 0004). main.ts loads src/pwa.ts only in the Web App; `disable` still
    // answers its `virtual:pwa-register` import.
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
        // The browser bar starts light, the default theme; index.html repaints it per theme.
        theme_color: THEME_BG.light,
        // The launch screen matches the maskable and Apple icons, which sit on the dark background.
        background_color: THEME_BG.dark,
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
