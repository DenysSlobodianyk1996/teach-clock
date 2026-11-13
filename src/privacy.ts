/**
 * The Privacy Page's text lives in i18n (`privacy.*`), shown in the app by PrivacyView. This module
 * also writes it as the static `privacy.html` that the build emits for the Web App: Google Play's
 * listing needs a public URL that works without the app. Plain TypeScript with relative imports, so
 * vite.config.ts can load it.
 */
import { CONTACT_EMAIL, PRIVACY_UPDATED, WEB_APP_URL } from './config.ts'
import uk from './i18n/uk.ts'
import en from './i18n/en.ts'

export type PrivacyLocale = 'uk' | 'en'

/** "13 листопада 2026 р." / "13 November 2026". */
export function formatPrivacyDate(locale: PrivacyLocale, iso: string = PRIVACY_UPDATED): string {
  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`))
}

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

function section(locale: PrivacyLocale, heading: 'h1' | 'h2'): string {
  const p = (locale === 'uk' ? uk : en).privacy
  const mail = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`
  return `
      <section id="${locale}" lang="${locale}">
        <${heading} id="privacy-${locale}">${escape(p.title)}</${heading}>
        <p>${escape(p.intro)}</p>
        <ul>
          <li>${escape(p.nothingSent)}</li>
          <li>${escape(p.onDevice)}</li>
          <li>${escape(p.results)}</li>
          <li>${escape(p.webVersion)} <a href="${WEB_APP_URL}">${WEB_APP_URL}</a></li>
          <li>${escape(p.questions)} ${mail}</li>
        </ul>
        <p class="updated">${escape(p.updated)} <time datetime="${PRIVACY_UPDATED}">${escape(formatPrivacyDate(locale))}</time></p>
        <a class="back" href="./">${escape(p.back)}</a>
      </section>`
}

/** The whole static page: Ukrainian, then English. */
export function privacyPageHtml(): string {
  return `<!doctype html>
<html lang="uk">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(uk.privacy.title)} · ${escape(en.privacy.title)} — Teach Clock</title>
    <meta name="description" content="${escape(uk.privacy.intro)} ${escape(en.privacy.intro)}" />
    <link rel="icon" href="favicon.ico" sizes="any" />
    <link rel="icon" href="favicon.svg" type="image/svg+xml" />
    <style>
      /* Colours from src/styles/theme.css: the light theme, and the dark theme when the device
         prefers dark. This page is outside the Vue app, so it cannot import that file. */
      :root {
        color-scheme: light dark;
        --bg: #f5efe3;
        --surface: #ffffff;
        --line: rgba(31, 45, 58, 0.14);
        --text: #1f2d3a;
        --muted: #4c5b69;
        --link: #11727a;
        --accent: #f2b84b;
        --accent-ink: #2a2214;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #121a24;
          --surface: #1c2633;
          --line: rgba(238, 242, 246, 0.16);
          --text: #eef2f6;
          --muted: #b3c0cd;
          --link: #f0b444;
          --accent: #f0b444;
        }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font: 17px/1.55 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        overflow-wrap: anywhere;
      }
      main { max-width: 680px; margin: 0 auto; padding: 24px 16px 48px; }
      section {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 20px 20px 24px;
        margin-bottom: 24px;
      }
      h1, h2 { font-size: 1.6rem; line-height: 1.2; margin: 0 0 12px; }
      ul { padding-left: 1.2em; }
      li { margin-bottom: 8px; }
      a { color: var(--link); }
      .updated { color: var(--muted); font-size: 0.95rem; }
      a.back {
        display: inline-block;
        margin-top: 8px;
        padding: 10px 18px;
        border-radius: 999px;
        background: var(--accent);
        color: var(--accent-ink);
        font-weight: 700;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>${section('uk', 'h1')}
${section('en', 'h2')}
    </main>
  </body>
</html>
`
}
