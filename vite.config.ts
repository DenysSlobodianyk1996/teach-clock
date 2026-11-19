import { fileURLToPath, URL } from 'node:url'
import { readFile } from 'node:fs/promises'
import process from 'node:process'

import { defineConfig, transformWithOxc, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { customMediaPlugin } from './src/styles/media.ts'
import { buildPrivacyPage, type PrivacyPage } from './scripts/buildPrivacyPage.ts'
import { privacyUpdated } from './scripts/privacyUpdated.ts'
import { THEME_BG } from './src/themeColors.ts'
import { webManifestFile, webManifestHref, webManifests } from './src/webManifest.ts'
import { LOCALES } from './src/i18n/locales.ts'
import { OLDEST_CHROME } from './src/config.ts'
import uk from './src/i18n/uk.ts'
import en from './src/i18n/en.ts'

/** The Android App build (`npm run android:sync`); src/platform.ts reads the same var for the app. */
const isAndroidApp = process.env.VITE_TARGET === 'android'

/**
 * The Privacy Page's "Updated" date: the built commit's date (scripts/privacyUpdated.ts). Set here,
 * before Vite reads the environment, so the app, the static privacy.html and Vitest all print it.
 */
process.env.VITE_PRIVACY_UPDATED = privacyUpdated({ given: process.env.VITE_PRIVACY_UPDATED })

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
 * src/i18n/deviceLocale.ts as plain JavaScript for the pre-paint script: an expression that is the
 * `deviceLocale` function. The file is compiled from its source (types stripped), not taken from
 * the config's own bundle, so no bundler helper or outside name can slip in. It is run once here
 * and the build fails if it does not give the language the store's rule gives.
 */
async function deviceLocaleScript(): Promise<string> {
  const file = fileURLToPath(new URL('./src/i18n/deviceLocale.ts', import.meta.url))
  const { code } = await transformWithOxc(await readFile(file, 'utf8'), file, {
    lang: 'ts',
    target: 'es2015',
  })
  if (/^\s*import\s/m.test(code)) throw new Error(`${file} must have no imports but types`)
  const body = code.replace(/\/\*[\s\S]*?\*\/\s*/g, '').replace(/^export function/m, 'function')
  const script = `(function () {\n${body}\nreturn deviceLocale\n})()`
  const rule = new Function(`return ${script}`)() as (
    languages?: string[],
    language?: string,
  ) => string
  const checks: [string[], string | undefined, string][] = [
    [['ru', 'uk-UA', 'en'], undefined, 'uk'],
    [['de', 'en_US'], undefined, 'en'],
    [[], 'uk_UA', 'uk'],
    [['pl'], undefined, 'en'],
  ]
  for (const [languages, language, expected] of checks) {
    if (rule(languages, language) !== expected) {
      throw new Error(`The pre-paint deviceLocale gives the wrong language for ${languages}`)
    }
  }
  return script
}

/**
 * Fills index.html: its static Game Name and description in English (`__APP_NAME__`,
 * `__APP_DESCRIPTION__`, decision 7 of batch 13), and the pre-paint script's interface-language
 * rule (`__DEVICE_LOCALE__`, src/i18n/deviceLocale.ts) and each language's Game Name and
 * description (`__APP_TEXT__`, from i18n). So the tab is named in the language the app will start
 * in and never drifts from the Preferences store.
 */
function appTextPlugin(): Plugin {
  const messages = { uk, en }
  // `<` escaped, so no text can close the script.
  const text = JSON.stringify(
    Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        { name: messages[locale].app.name, description: messages[locale].app.description },
      ]),
    ),
  ).replaceAll('<', '\\u003c')
  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  let script: Promise<string> | undefined
  return {
    name: 'teach-clock-app-text',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html) =>
        html
          .replaceAll('__APP_NAME__', escape(en.app.name))
          .replaceAll('__APP_DESCRIPTION__', escape(en.app.description))
          .replaceAll('__APP_TEXT__', text)
          .replaceAll('__DEVICE_LOCALE__', await (script ??= deviceLocaleScript())),
    },
  }
}

/**
 * The Web App's manifests, one per interface language (src/webManifest.ts). The build writes both
 * and the dev server serves them; index.html links one, and its pre-paint script and App.vue
 * point the link at the interface language's (`__WEB_MANIFESTS__`, their addresses), except in an
 * installed Web App, which links none so its name never changes. The Android
 * App gets no manifest and no link (ADR 0004): `__WEB_MANIFESTS__` is `null` there.
 */
function webManifestPlugin(): Plugin {
  let base = '/'
  return {
    name: 'teach-clock-web-manifest',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => {
        if (isAndroidApp) return html.replaceAll('__WEB_MANIFESTS__', 'null')
        const hrefs = JSON.stringify(
          Object.fromEntries(LOCALES.map((locale) => [locale, webManifestHref(base, locale)])),
        )
        return {
          html: html.replaceAll('__WEB_MANIFESTS__', hrefs),
          // Before the pre-paint script, which points it at the interface language's manifest.
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'manifest', href: webManifestHref(base, 'en') },
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
        const locale = LOCALES.find((l) => url === webManifestHref(base, l))
        if (!locale) return next()
        res.setHeader('Content-Type', 'application/manifest+json')
        res.end(JSON.stringify(webManifests(base)[locale]))
      })
    },
    generateBundle() {
      if (isAndroidApp) return
      const manifests = webManifests(base)
      for (const locale of LOCALES) {
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
  // Old Android WebViews (src/config.ts); other browsers as Vite's default baseline.
  build: {
    target: [`chrome${OLDEST_CHROME}`, 'edge107', 'firefox104', 'safari16'],
    cssTarget: [`chrome${OLDEST_CHROME}`, 'edge107', 'firefox104', 'safari16'],
  },
  // Shared breakpoints such as `@media (--phone)`, defined once in src/styles/media.ts.
  css: { postcss: { plugins: [customMediaPlugin] } },
  plugins: [
    vue(),
    // Not under Playwright: its floating button sits over the bottom of the screen, where a phone
    // Round's Submit can be, and would catch the tests' taps.
    ...(process.env.PW_TEST ? [] : [vueDevTools()]),
    themeColorsPlugin(),
    appTextPlugin(),
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
