// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { webManifestFile, webManifests } from '@/webManifest'
import { t, tEn } from '@/test/i18n'

/**
 * The installed Web App's name (decision 8 of batch 13): one manifest per interface language, so
 * the browser installs the full Game Name the Player sees at that moment.
 */
const text = {
  uk: (key: string) => t(key, {}, { locale: 'uk' }),
  en: (key: string) => tEn(key),
}

describe('Web App manifests', () => {
  const manifests = webManifests('/teach-clock/')

  it.each(['uk', 'en'] as const)(
    '%s: name and short name are the full Game Name, in that language',
    (lang) => {
      expect(manifests[lang]).toMatchObject({
        name: text[lang]('app.name'),
        short_name: text[lang]('app.name'),
        description: text[lang]('app.description'),
        lang,
      })
    },
  )

  it('differ only in the language fields', () => {
    const rest = (lang: 'uk' | 'en') => {
      const { name, short_name, description, lang: _, ...others } = manifests[lang]
      expect([name, short_name, description].every(Boolean)).toBe(true)
      return others
    }
    expect(rest('uk')).toEqual(rest('en'))
    expect(rest('en')).toMatchObject({ start_url: '/teach-clock/', scope: '/teach-clock/' })
    expect(rest('en').icons).not.toHaveLength(0)
  })

  it('each has its own file', () => {
    expect(webManifestFile('uk')).not.toBe(webManifestFile('en'))
  })
})
