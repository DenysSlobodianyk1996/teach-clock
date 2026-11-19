// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import { JSDOM } from 'jsdom'
import { CONTACT_EMAIL, ISSUES_URL } from '@/config'
import { formatPrivacyDate, PRIVACY_UPDATED } from '@/privacy'
import { t, tEn } from '@/test/i18n'
import { buildPrivacyPage, type PrivacyPage } from '../../scripts/buildPrivacyPage.ts'

const KEYS = [
  'title',
  'intro',
  'nothingSent',
  'onDevice',
  'results',
  'createdBy',
  'questions',
  'updated',
]

describe('the static privacy.html for Google Play, rendered from the app', () => {
  let page: PrivacyPage
  let doc: Document
  const article = (lang: 'uk' | 'en') => doc.querySelector<HTMLElement>(`article[lang="${lang}"]`)!

  beforeAll(async () => {
    page = await buildPrivacyPage({ root: process.cwd(), base: '/teach-clock/' })
    doc = new JSDOM(page.html).window.document
  }, 60_000)

  it('says what the in-app Privacy Page says, Ukrainian then English', () => {
    const articles = [...doc.querySelectorAll('article')].map((a) => a.lang)
    expect(articles).toEqual(['uk', 'en'])
    expect(article('uk').querySelector('h1')!.textContent).toBe(t('privacy.title'))
    expect(article('en').querySelector('h2')!.textContent).toBe(tEn('privacy.title'))
    for (const key of KEYS) {
      expect(article('uk').textContent).toContain(t(`privacy.${key}`))
      expect(article('en').textContent).toContain(tEn(`privacy.${key}`))
    }
  })

  it('names the page and the game in both languages in its title', () => {
    for (const text of [t('privacy.title'), tEn('privacy.title'), t('app.name'), tEn('app.name')]) {
      expect(doc.title).toContain(text)
    }
  })

  it('gives the contact email, the issues and the date of the text in each language', () => {
    for (const lang of ['uk', 'en'] as const) {
      const links = [...article(lang).querySelectorAll('a')]
      // The contact email, the issues and the way back to the game are the only links.
      expect(links.map((a) => a.getAttribute('href'))).toEqual([
        `mailto:${CONTACT_EMAIL}`,
        ISSUES_URL,
        './',
      ])
      expect(article(lang).querySelector('time')!.getAttribute('datetime')).toBe(PRIVACY_UPDATED)
      expect(article(lang).querySelector('time')!.textContent).toBe(formatPrivacyDate(lang))
    }
  })

  it('shows the app header with the brand only: the switches need JavaScript', () => {
    const header = doc.querySelector('header')!
    expect(header.textContent).toBe(t('app.name'))
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
})

describe('formatPrivacyDate', () => {
  it('writes the date in words for each language', () => {
    expect(formatPrivacyDate('en', '2026-11-13')).toBe('13 November 2026')
    expect(formatPrivacyDate('uk', '2026-11-13')).toMatch(/^13 листопада 2026/)
  })
})

describe('PRIVACY_UPDATED', () => {
  it('is the date of the commit the build is made from, with nothing to bump by hand', () => {
    const commitDate = execSync('git log -1 --format=%cs', { encoding: 'utf8' }).trim()
    expect(PRIVACY_UPDATED).toBe(commitDate)
  })
})
