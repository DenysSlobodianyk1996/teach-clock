/**
 * Server-side entry for the static privacy/index.html, the public Privacy policy URL in Google
 * Play's listing (…/teach-clock/privacy/): it must work without the app and without JavaScript. scripts/buildPrivacyPage.ts builds
 * this module with Vite (so the page gets the app's own styles) and calls `renderPrivacyPage`.
 */
import './styles/base.css'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import PrivacyStaticPage from './views/PrivacyStaticPage.vue'
import { createAppI18n } from './i18n'
import { MESSAGES } from './i18n/messages'
import { THEME_BG } from './themeColors'

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** The whole page, with `css` (the app's styles for it) inlined: no script, no other request. */
export async function renderPrivacyPage(css: string): Promise<string> {
  const en = MESSAGES.en
  const body = await renderToString(createSSRApp(PrivacyStaticPage).use(createAppI18n('en')))
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="${THEME_BG.light}" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="${THEME_BG.dark}" media="(prefers-color-scheme: dark)" />
    <title>${escape(en.privacy.title)} · ${escape(en.app.name)}</title>
    <meta name="description" content="${escape(en.privacy.noData)}" />
    <link rel="icon" href="../favicon.ico" sizes="48x48" />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" sizes="any" />
    <style>${css}</style>
  </head>
  <body>
    ${body}
  </body>
</html>
`
}
