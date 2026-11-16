import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { customMediaPlugin } from './src/styles/media.ts'
import { buildPrivacyPage, type PrivacyPage } from './scripts/buildPrivacyPage.ts'
import { THEME_BG } from './src/themeColors.ts'
import { webManifestFile, webManifests } from './src/webManifest.ts'
import { deviceLocale } from './src/i18n/deviceLocale.ts'
import uk from './src/i18n/uk.ts'
import en from './src/i18n/en.ts'

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

/**
 * Fills the interface-language rule (`__DEVICE_LOCALE__`, the source of src/i18n/deviceLocale.ts)
 * and each Game Name (`__GAME_NAMES__`, from i18n) into index.html's pre-paint script, so the tab
 * is named in the language the app will start in and never drifts from the Preferences store.
 */
function gameNamePlugin(): Plugin {
  const names = JSON.stringify({ uk: uk.app.name, en: en.app.name })
  return {
    name: 'teach-clock-game-name',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replaceAll('__GAME_NAMES__', names)
          .replaceAll('__DEVICE_LOCALE__', `(${deviceLocale})`),
    },
  }
}

/**
 * The Web App's manifests, one per interface language (src/webManifest.ts). The build writes both
 * and the dev server serves them; index.html links one, and its pre-paint script and App.vue
 * point the link at the interface language's (`__WEB_MANIFESTS__`, their addresses). The Android
 * App gets no manifest and no link (ADR 0004): `__WEB_MANIFESTS__` is `null` there.
 */
function webManifestPlugin(): Plugin {
  let base = '/'
  const locales = ['uk', 'en'] as const
  const href = (locale: (typeof locales)[number]) => `${base}${webManifestFile(locale)}`
  return {
    name: 'teach-clock-web-manifest',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => {
        if (isAndroidApp) return html.replaceAll('__WEB_MANIFESTS__', 'null')
        const hrefs = JSON.stringify({ uk: href('uk'), en: href('en') })
        return {
          html: html.replaceAll('__WEB_MANIFESTS__', hrefs),
          // Before the pre-paint script, which points it at the interface language's manifest.
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'manifest', href: href('en') },
              injectTo: 'head-prepend',
            },
          ],
        }
      },
    },
    configureServer(server) {
      if (isAndroidApp) return
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        const locale = locales.find((l) => url === href(l))
        if (!locale) return next()
        res.setHeader('Content-Type', 'application/manifest+json')
        res.end(JSON.stringify(webManifests(base)[locale]))
      })
    },
    generateBundle() {
      if (isAndroidApp) return
      const manifests = webManifests(base)
      for (const locale of locales) {
        this.emitFile({
          type: 'asset',
          fileName: webManifestFile(locale),
          source: JSON.stringify(manifests[locale]),
        })
      }
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
    gameNamePlugin(),
    webManifestPlugin(),
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
      // One manifest per interface language, written by webManifestPlugin above.
      manifest: false,
      workbox: {
        // Everything the build emits, fonts and both manifests included, so every Game works and
        // the app installs offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
