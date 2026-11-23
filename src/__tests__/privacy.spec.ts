// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import { JSDOM } from 'jsdom'
import { CONTACT_EMAIL, ISSUES_URL } from '@/config'
import { readFileSync } from 'node:fs'
import { APP_VERSION, formatPrivacyDate, PRIVACY_UPDATED } from '@/privacy'
import { LOCALES, t, tEn, tIn, type Locale } from '@/test/i18n'
import { buildPrivacyPage, type PrivacyPage } from '../../scripts/buildPrivacyPage.ts'
import { appVersion } from '../../scripts/appVersion.ts'

/** Every text of the Privacy Page, one per language (batch 24). */
const KEYS = [
  'title',
  'updated',
  'version',
  'noDataTitle',
  'noData',
  'onDeviceTitle',
  'onDevice',
  'noAdsTitle',
  'noAds',
  'childrenTitle',
  'children',
  'contactTitle',
  'contactIntro',
  'email',
  'developerTitle',
  'createdBy',
]

describe('the static privacy/index.html for Google Play, rendered from the app', () => {
  let page: PrivacyPage
  let doc: Document
  const article = (lang: Locale) => doc.querySelector<HTMLElement>(`article[lang="${lang}"]`)!

  beforeAll(async () => {
    page = await buildPrivacyPage({ root: process.cwd(), base: '/teach-clock/' })
    doc = new JSDOM(page.html).window.document
  }, 60_000)

  it('says what the in-app Privacy Page says, in the order of the list', () => {
    const articles = [...doc.querySelectorAll('article')].map((a) => a.lang)
    expect(articles).toEqual(LOCALES)
    expect(article('en').querySelector('h1')!.textContent).toBe(tEn('privacy.title'))
    expect(article('uk').querySelector('h2')!.textContent).toBe(t('privacy.title'))
    for (const lang of LOCALES) {
      for (const key of KEYS) {
        expect(article(lang).textContent).toContain(tIn(lang, `privacy.${key}`))
      }
    }
  })

  it('names the page and the game in its title', () => {
    expect(doc.title).toBe(`${tEn('privacy.title')} · ${tEn('app.name')}`)
  })

  it('links each language from the top', () => {
    const nav = [...doc.querySelectorAll('nav a')].map((a) => a.getAttribute('href'))
    expect(nav).toEqual(LOCALES.map((lang) => `#${lang}`))
    for (const lang of LOCALES) expect(doc.getElementById(lang)!.lang).toBe(lang)
  })

  it('gives the contact email, the issues and the date of the text in each language', () => {
    for (const lang of LOCALES) {
      const links = [...article(lang).querySelectorAll('a')]
      // The contact email, the public issues and the way back to the game, one folder up.
      expect(links.map((a) => a.getAttribute('href'))).toEqual([
        `mailto:${CONTACT_EMAIL}`,
        ISSUES_URL,
        '../',
      ])
      expect(article(lang).querySelector('time')!.getAttribute('datetime')).toBe(PRIVACY_UPDATED)
      expect(article(lang).querySelector('time')!.textContent).toBe(formatPrivacyDate(lang))
      expect(article(lang).querySelector('.version')!.textContent!.trim()).toBe(
        `${tIn(lang, 'privacy.version')} ${APP_VERSION}`,
      )
    }
  })

  it('shows the app header with the brand only: the switches need JavaScript', () => {
    const header = doc.querySelector('header')!
    expect(header.textContent).toBe(tEn('app.name'))
    expect(header.querySelector('button, a')).toBeNull()
  })

  it('needs no JavaScript and carries the app styles, light and dark by the device', () => {
    expect(doc.querySelector('script')).toBeNull()
    const css = doc.querySelector('style')!.textContent!
    // The app's own tokens and component styles, not a copy.
    expect(css).toContain('--accent')
    expect(css).toMatch(/\.privacy\[data-v-/)
    expect(css).toMatch(
      /@media \(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{[^}]*--bg:#121a24/,
    )
    expect(doc.querySelector('meta[name="color-scheme"]')!.getAttribute('content')).toBe(
      'light dark',
    )
  })

  it('points its fonts at files under the site base, and hands them over to emit', () => {
    const fonts = [...doc.querySelector('style')!.textContent!.matchAll(/url\(([^)]+)\)/g)].map(
      (m) => m[1]!,
    )
    expect(fonts.length).toBeGreaterThan(0)
    for (const url of fonts) {
      expect(url.startsWith('/teach-clock/')).toBe(true)
      expect(page.assets.has(url.slice('/teach-clock/'.length))).toBe(true)
    }
  })

  it('has no link to the website', () => {
    expect(page.html).not.toContain('github.io')
  })

  it('finds its icons one folder up, where the app is', () => {
    const icons = [...doc.querySelectorAll('link[rel="icon"]')].map((l) => l.getAttribute('href'))
    expect(icons).toEqual(['../favicon.ico', '../favicon.svg'])
  })
})

describe('formatPrivacyDate', () => {
  it('writes the date in words for each language', () => {
    expect(formatPrivacyDate('en', '2026-11-13')).toBe('13 November 2026')
    expect(formatPrivacyDate('uk', '2026-11-13')).toBe('13 листопада 2026 року')
    expect(formatPrivacyDate('en', '2026-01-05')).toBe('5 January 2026')
    expect(formatPrivacyDate('de', '2026-03-05')).toBe('5. März 2026')
    expect(formatPrivacyDate('fr', '2026-08-05')).toBe('5 août 2026')
    expect(formatPrivacyDate('fr', '2026-03-01')).toBe('1er mars 2026')
    expect(formatPrivacyDate('it', '2026-12-05')).toBe('5 dicembre 2026')
    expect(formatPrivacyDate('it', '2026-03-01')).toBe('1º marzo 2026')
    expect(formatPrivacyDate('es', '2026-03-05')).toBe('5 de marzo de 2026')
  })
})

describe('APP_VERSION', () => {
  it("is package.json's major.minor and the Android run number, the same as Google Play's", () => {
    const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }
    expect(APP_VERSION).toBe(
      appVersion({ packageVersion: version, versionCode: process.env.VERSION_CODE }),
    )
  })
})

describe('PRIVACY_UPDATED', () => {
  it('is the date of the commit the build is made from, with nothing to bump by hand', () => {
    const commitDate = execSync('git log -1 --format=%cs', { encoding: 'utf8' }).trim()
    expect(PRIVACY_UPDATED).toBe(commitDate)
  })
})
