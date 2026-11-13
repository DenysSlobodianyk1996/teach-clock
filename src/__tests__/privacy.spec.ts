// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { CONTACT_EMAIL, PRIVACY_UPDATED, WEB_APP_URL } from '@/config'
import { formatPrivacyDate, privacyPageHtml } from '@/privacy'
import { t, tEn } from '@/test/i18n'

const KEYS = [
  'intro',
  'nothingSent',
  'onDevice',
  'results',
  'webVersion',
  'questions',
  'updated',
  'back',
]

/** The text of one language section of the static page, tags stripped. */
function sectionText(html: string, lang: 'uk' | 'en'): string {
  const section = html.match(
    new RegExp(`<section id="${lang}" lang="${lang}">([\\s\\S]*?)</section>`),
  )
  if (!section) throw new Error(`No ${lang} section`)
  return section[1]!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
}

describe('the static privacy.html for Google Play', () => {
  const html = privacyPageHtml()

  it('says what the in-app Privacy Page says, Ukrainian then English', () => {
    expect(html.indexOf('<section id="uk"')).toBeLessThan(html.indexOf('<section id="en"'))
    const uk = sectionText(html, 'uk')
    const en = sectionText(html, 'en')
    expect(uk).toContain(t('privacy.title'))
    expect(en).toContain(tEn('privacy.title'))
    for (const key of KEYS) {
      expect(uk).toContain(t(`privacy.${key}`))
      expect(en).toContain(tEn(`privacy.${key}`))
    }
  })

  it('gives the contact email and the date of the text in each language', () => {
    expect(html.match(new RegExp(`href="mailto:${CONTACT_EMAIL}"`, 'g'))).toHaveLength(2)
    expect(html.match(new RegExp(`<time datetime="${PRIVACY_UPDATED}">`, 'g'))).toHaveLength(2)
    expect(sectionText(html, 'uk')).toContain(formatPrivacyDate('uk'))
    expect(sectionText(html, 'en')).toContain(formatPrivacyDate('en'))
  })

  it('links to the web version of the game in each language', () => {
    expect(html.match(new RegExp(`<a href="${WEB_APP_URL}">`, 'g'))).toHaveLength(2)
  })

  it('links back to the game', () => {
    expect(html.match(/<a class="back" href="\.\/">/g)).toHaveLength(2)
  })
})

describe('formatPrivacyDate', () => {
  it('writes the date in words for each language', () => {
    expect(formatPrivacyDate('en', '2026-11-13')).toBe('13 November 2026')
    expect(formatPrivacyDate('uk', '2026-11-13')).toMatch(/^13 листопада 2026/)
  })
})
