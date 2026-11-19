/**
 * The Privacy Page (batch 23): one static page, src/static/privacy.html, that every build writes to
 * privacy/index.html with the built commit's date. It is what Google Play's listing links and what
 * the Footer opens, so it must work with no JavaScript.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CONTACT_EMAIL } from '@/config'
import { fillPrivacyPage } from '../../scripts/privacyUpdated'

// From the project root, where Vitest runs: jsdom's import.meta.url is not a file URL.
const source = readFileSync('src/static/privacy.html', 'utf8')
const html = fillPrivacyPage(source, '2026-11-19')
const doc = new DOMParser().parseFromString(html, 'text/html')
const section = (lang: string) => doc.querySelector(`section[lang="${lang}"]`)!

describe('the Privacy Page', () => {
  it('is English, then Ukrainian, with a link to each', () => {
    const langs = [...doc.querySelectorAll('section')].map((s) => s.getAttribute('lang'))
    expect(langs).toEqual(['en', 'uk'])
    const anchors = [...doc.querySelectorAll('nav a')].map((a) => a.getAttribute('href'))
    expect(anchors).toEqual(['#en', '#uk'])
  })

  it('has every date filled in, in both languages', () => {
    expect(html).not.toMatch(/%PRIVACY_UPDATED(_EN|_UK)?%/)
    for (const lang of ['en', 'uk']) {
      expect(section(lang).querySelector('time')!.getAttribute('datetime')).toBe('2026-11-19')
    }
  })

  it('names the contact email in both languages', () => {
    for (const lang of ['en', 'uk']) {
      expect(section(lang).querySelector('a[href^="mailto:"]')!.getAttribute('href')).toBe(
        `mailto:${CONTACT_EMAIL}`,
      )
    }
  })

  it('needs no JavaScript and loads nothing from another site', () => {
    expect(doc.querySelectorAll('script')).toHaveLength(0)
    const urls = [...doc.querySelectorAll('[src], link[href]')].map(
      (el) => el.getAttribute('src') ?? el.getAttribute('href') ?? '',
    )
    expect(urls.filter((url) => /^(https?:)?\/\//.test(url))).toEqual([])
  })
})
