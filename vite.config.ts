import { fileURLToPath, URL } from 'node:url'
import { readFile } from 'node:fs/promises'
import process from 'node:process'

import { defineConfig, transformWithOxc, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { customMediaPlugin } from './src/styles/media.ts'
import { fillPrivacyPage, privacyUpdated } from './scripts/privacyUpdated.ts'
import { NOT_THE_APP_PAGES, PRIVACY_PAGE } from './src/static/privacy.ts'
import { THEME_BG } from './src/themeColors.ts'
import { webManifestFile, webManifestHref, webManifests } from './src/webManifest.ts'
import { LOCALES } from './src/i18n/locales.ts'
import { OLDEST_CHROME } from './src/config.ts'
import uk from './src/i18n/uk.ts'
import en from './src/i18n/en.ts'

/** The Android App build (`npm run android:sync`); src/platform.ts reads the same var for the app. */
const isAndroidApp = process.env.VITE_TARGET === 'android'

/**
 * GitHub Pages serves the app from /teach-clock/; everywhere else, the Android App included, it
 * lives at the root.
 */
const base = process.env.GITHUB_PAGES && !isAndroidApp ? '/teach-clock/' : '/'

/**
 * The Privacy Page (batch 23) lives outside public/ so every build can stamp its "Updated" date:
 * the built commit's date, or VITE_PRIVACY_UPDATED when set (scripts/privacyUpdated.ts). The Web
 * App build (where the service worker precaches it) and the Android App both get
 * privacy/index.html; the dev server serves it at the same address.
 */
const PRIVACY_SOURCE = fileURLToPath(new URL('./src/static/privacy.html', import.meta.url))

function privacyPagePlugin(): Plugin {
  const render = async () =>
    fillPrivacyPage(
      await readFile(PRIVACY_SOURCE, 'utf8'),
      privacyUpdated({ given: process.env.VITE_PRIVACY_UPDATED }),
    )
  return {
    name: 'teach-clock-privacy-page',
    async generateBundle() {
      this.emitFile({ type: 'asset', fileName: PRIVACY_PAGE, source: await render() })
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!NOT_THE_APP_PAGES.some((page) => page.test(url))) return next()
        const path = url.split('?')[0] ?? ''
        if (path.endsWith('/privacy')) {
          res.writeHead(302, { Location: `${path}/` }).end()
          return
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(await render())
      })
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
    // The Privacy Page, in both builds: the Footer opens it in the Android App too.
    privacyPagePlugin(),
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
        // The Privacy Page is its own page (precached as privacy/index.html), not the app.
        navigateFallbackDenylist: NOT_THE_APP_PAGES,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
