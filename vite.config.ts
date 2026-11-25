import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import process from 'node:process'

import { defineConfig, transformWithOxc, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { customMediaPlugin } from './src/styles/media.ts'
import { buildPrivacyPage, type PrivacyPage } from './scripts/buildPrivacyPage.ts'
import { buildWelcomePage } from './scripts/buildWelcomePage.ts'
import { PRERENDER_HIDDEN_CSS, prerenderedWelcomeScript } from './src/static/prerenderedWelcome.ts'
import { privacyUpdated } from './scripts/privacyUpdated.ts'
import { appVersion } from './scripts/appVersion.ts'
import { NOT_THE_APP_PAGES, PRIVACY_PAGE } from './src/static/privacy.ts'
import { THEME_BG } from './src/themeColors.ts'
import { webManifestFile, webManifestHref, webManifests } from './src/webManifest.ts'
import { LOCALES } from './src/i18n/locales.ts'
import { GOOGLE_SITE_VERIFICATION, OLDEST_CHROME, SITE_URL } from './src/config.ts'
import { structuredData } from './src/structuredData.ts'
import { MESSAGES } from './src/i18n/messages.ts'

/** The Android App build (`npm run android:sync`); src/platform.ts reads the same var for the app. */
const isAndroidApp = process.env.VITE_TARGET === 'android'

/**
 * The Privacy Page's "Updated" date: the built commit's date (scripts/privacyUpdated.ts). Set here,
 * before Vite reads the environment, so the app, the static privacy/index.html and Vitest all print it.
 */
process.env.VITE_PRIVACY_UPDATED = privacyUpdated({ given: process.env.VITE_PRIVACY_UPDATED })

/**
 * The version on the Privacy Page (scripts/appVersion.ts): package.json's major.minor and the
 * Android run number CI gives in VERSION_CODE, as Google Play's versionName.
 */
process.env.VITE_APP_VERSION = appVersion({
  packageVersion: (
    JSON.parse(readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8')) as {
      version: string
    }
  ).version,
  versionCode: process.env.VERSION_CODE,
})

/**
 * GitHub Pages serves the app from /teach-clock/; everywhere else, the Android App included, it
 * lives at the root.
 */
const base = process.env.GITHUB_PAGES && !isAndroidApp ? '/teach-clock/' : '/'

/**
 * The Web App's static `privacy/index.html` (PRIVACY_PAGE), the public URL in Google Play's listing,
 * …/teach-clock/privacy/. It is rendered from the app's own Privacy Page components
 * (scripts/buildPrivacyPage.ts), so the two never drift: one text per language (batch 24). The dev
 * server serves it at the same addresses (NOT_THE_APP_PAGES); the service worker precaches it with
 * the rest of the build and leaves those addresses to it.
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
        if (!url.startsWith(base) || !NOT_THE_APP_PAGES.some((page) => page.test(url)))
          return next()
        // A bare folder, as GitHub Pages does: the page's relative links need the slash.
        if (url.endsWith('/privacy')) {
          res.writeHead(302, { Location: `${url}/` }).end()
          return
        }
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
      // Its public address on GitHub Pages only, for search engines (batch 31).
      const canonical = isPagesBuild(process.env) ? `${SITE_URL}privacy/` : undefined
      const page = await buildPrivacyPage({ root, base, canonical })
      this.emitFile({ type: 'asset', fileName: PRIVACY_PAGE, source: page.html })
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
    supported: readonly string[],
    languages?: string[],
    language?: string,
  ) => string
  const checks: [string[], string | undefined, string][] = [
    [['ru', 'uk-UA', 'en'], undefined, 'uk'],
    [['pl', 'en_US'], undefined, 'en'],
    [[], 'uk_UA', 'uk'],
    [['pl'], undefined, 'en'],
  ]
  for (const [languages, language, expected] of checks) {
    if (rule(LOCALES, languages, language) !== expected) {
      throw new Error(`The pre-paint deviceLocale gives the wrong language for ${languages}`)
    }
  }
  return script
}

/** Text made safe for an HTML attribute or element. */
const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

/**
 * Fills index.html: its static Game Name and description in English (`__APP_NAME__`,
 * `__APP_DESCRIPTION__`, decision 7 of batch 13), and the pre-paint script's interface-language
 * rule (`__DEVICE_LOCALE__`, src/i18n/deviceLocale.ts), the list it picks from (`__LOCALES__`) and each language's Game Name and
 * description (`__APP_TEXT__`, from i18n). So the tab is named in the language the app will start
 * in and never drifts from the Preferences store.
 */
function appTextPlugin(): Plugin {
  // `<` escaped, so no text can close the script.
  const text = JSON.stringify(
    Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        { name: MESSAGES[locale].app.name, description: MESSAGES[locale].app.description },
      ]),
    ),
  ).replaceAll('<', '\\u003c')
  let script: Promise<string> | undefined
  return {
    name: 'teach-clock-app-text',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html) =>
        html
          .replaceAll('__APP_NAME__', escape(MESSAGES.en.app.name))
          .replaceAll('__APP_DESCRIPTION__', escape(MESSAGES.en.app.description))
          .replaceAll('__LOCALES__', JSON.stringify(LOCALES))
          .replaceAll('__APP_TEXT__', text)
          .replaceAll('__DEVICE_LOCALE__', await (script ??= deviceLocaleScript())),
    },
  }
}

/**
 * The Web App's build for GitHub Pages: `GITHUB_PAGES` and not the Android App. Only it is on the
 * web for search engines and link previews. `env` is the process environment (a test gives its own).
 */
function isPagesBuild(env: Record<string, string | undefined>): boolean {
  return !!env.GITHUB_PAGES && env.VITE_TARGET !== 'android'
}

/** The app's folder, where the static pages' server-side builds find its sources. */
const PROJECT_ROOT = fileURLToPath(new URL('.', import.meta.url))

const APP_MOUNT = '<div id="app"></div>'

/**
 * The English Welcome in index.html's #app for search engines that run no JavaScript (batch 31):
 * the app's own Welcome rendered at build time (scripts/buildWelcomePage.ts), its CSS after the
 * app's stylesheet. The app mounts over it (no hydration) in the Player's language. A pre-paint
 * script hides it where the app opens another screen (src/static/prerenderedWelcome.ts). Only the
 * GitHub Pages build: nobody crawls the Android App, and the dev server needs none.
 */
export function prerenderedWelcomePlugin(
  env: Record<string, string | undefined> = process.env,
): Plugin {
  let base = '/'
  return {
    name: 'teach-clock-prerendered-welcome',
    apply: (_config, { command }) => isPagesBuild(env) && command === 'build',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      // After Vite has linked the app's stylesheet, so Welcome's own rules come after it, as when
      // the app loads Welcome's chunk.
      order: 'post',
      async handler(html) {
        if (!html.includes(APP_MOUNT)) throw new Error(`index.html has no ${APP_MOUNT}`)
        const welcome = await buildWelcomePage({ root: PROJECT_ROOT, base })
        return {
          html: html.replace(APP_MOUNT, `<div id="app">${welcome.html}</div>`),
          tags: [
            { tag: 'style', children: PRERENDER_HIDDEN_CSS, injectTo: 'head' },
            { tag: 'script', children: prerenderedWelcomeScript(base), injectTo: 'head' },
            { tag: 'style', children: welcome.css, injectTo: 'head' },
          ],
        }
      },
    },
  }
}

/** The link preview image, the English store feature graphic (1024 × 500), at the site root. */
const OG_IMAGE = 'og-image.png'

/** What seoPlugin takes from src/config.ts unless a test gives its own. */
export interface SeoOptions {
  /** Search Console's token (`GOOGLE_SITE_VERIFICATION`); no tag while it is empty. */
  siteVerification?: string
}

/**
 * Link previews and the search basics for the Web App on GitHub Pages (batch 30): Open Graph and
 * Twitter tags and a canonical link in index.html, all with absolute URLs from SITE_URL, since
 * Slack, Telegram and other unfurlers run no JavaScript; the image and sitemap.xml beside it. The
 * text is English, as the static title and description are. Batch 31 adds the search engines'
 * part: the JSON-LD (src/structuredData.ts), the Search Console verification tag and robots.txt.
 * Only a build with `GITHUB_PAGES` and not the Android App's; never the dev server. `env` is the
 * process environment and `options` the constants in src/config.ts (a test gives its own).
 */
export function seoPlugin(
  env: Record<string, string | undefined> = process.env,
  { siteVerification = GOOGLE_SITE_VERIFICATION }: SeoOptions = {},
): Plugin {
  const enabled = isPagesBuild(env)
  const image = `${SITE_URL}${OG_IMAGE}`
  const text = { title: MESSAGES.en.app.name, description: MESSAGES.en.app.description }
  // Vite escapes the attributes of the tags it injects, as appTextPlugin's `escape` does.
  const meta = (key: string, content: string) => ({
    tag: 'meta',
    attrs: { [key.startsWith('og:') ? 'property' : 'name']: key, content },
    injectTo: 'head' as const,
  })
  return {
    name: 'teach-clock-seo',
    apply: (_config, { command }) => enabled && command === 'build',
    transformIndexHtml: () => [
      meta('og:type', 'website'),
      meta('og:site_name', text.title),
      meta('og:title', text.title),
      meta('og:description', text.description),
      meta('og:url', SITE_URL),
      meta('og:locale', 'en_US'),
      meta('og:image', image),
      meta('og:image:width', '1024'),
      meta('og:image:height', '500'),
      meta('og:image:alt', MESSAGES.en.app.previewAlt),
      meta('twitter:card', 'summary_large_image'),
      meta('twitter:title', text.title),
      meta('twitter:description', text.description),
      meta('twitter:image', image),
      meta('twitter:image:alt', MESSAGES.en.app.previewAlt),
      { tag: 'link', attrs: { rel: 'canonical', href: SITE_URL }, injectTo: 'head' },
      ...(siteVerification ? [meta('google-site-verification', siteVerification)] : []),
      {
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        // `<` escaped, so no text can close the script.
        children: JSON.stringify(
          structuredData({
            site: SITE_URL,
            name: text.title,
            description: text.description,
            languages: LOCALES,
            googlePlayUrl: null,
          }),
        ).replaceAll('<', '\\u003c'),
        injectTo: 'head',
      },
    ],
    async generateBundle() {
      const graphic = fileURLToPath(new URL('./docs/store/en/feature-graphic.png', import.meta.url))
      this.emitFile({ type: 'asset', fileName: OG_IMAGE, source: await readFile(graphic) })
      const urls = [SITE_URL, `${SITE_URL}privacy/`]
        .map((url) => `  <url><loc>${escape(url)}</loc></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      // Crawlers read robots.txt only at the host root, which this project site does not serve, so
      // it is advisory; Search Console gets the sitemap directly (batch 31).
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`,
      })
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
    seoPlugin(),
    prerenderedWelcomePlugin(),
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
        // The link preview image is for unfurlers, never shown in the game (seoPlugin).
        globIgnores: [OG_IMAGE],
        // The static Privacy Page is its own page (precached as privacy/index.html), not the app.
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
