import { describe, expect, it } from 'vitest'
import { deviceLocale as pick } from '../deviceLocale'
import { LOCALES, type Locale } from '../locales'

const deviceLocale = (languages?: readonly string[], language?: string) =>
  pick(LOCALES, languages, language)

describe('the interface language a device starts in', () => {
  it.each([
    [['ru', 'uk', 'en'], 'uk'],
    [['pl', 'en'], 'en'],
    [['pl'], 'en'],
    [['en-GB', 'uk'], 'en'],
    [['uk-UA'], 'uk'],
    [['de-AT', 'en'], 'de'],
    [['pl', 'de_DE', 'uk'], 'de'],
    [['UK-ua'], 'uk'],
    [['uk_UA'], 'uk'],
    [['pl_PL', 'en_US'], 'en'],
    [[], 'en'],
  ])('%j gives %s', (languages, expected) => {
    expect(deviceLocale(languages)).toBe(expected)
  })

  it('takes the single device language when the list is empty or missing', () => {
    expect(deviceLocale([], 'uk-UA')).toBe('uk')
    expect(deviceLocale(undefined, 'uk_UA')).toBe('uk')
    expect(deviceLocale(undefined, undefined)).toBe('en')
  })

  it('reads the list before the single language', () => {
    expect(deviceLocale(['en-US'], 'uk-UA')).toBe('en')
  })

  it('picks any language on the list it is given, in the device order', () => {
    const longerList = ['en', 'uk', 'fr'] as unknown as readonly Locale[]
    expect(pick(longerList, ['pl', 'fr-CA', 'uk'])).toBe('fr')
  })

  it('is English when the device has nothing on the list, whatever the list order', () => {
    const list = ['uk', 'en'] as unknown as readonly Locale[]
    expect(pick(list, ['pl'])).toBe('en')
  })
})
