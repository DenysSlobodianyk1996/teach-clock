import { describe, expect, it } from 'vitest'
import { deviceLocale } from '../deviceLocale'

describe('the interface language a device starts in', () => {
  it.each([
    [['ru', 'uk', 'en'], 'uk'],
    [['de', 'en'], 'en'],
    [['pl'], 'en'],
    [['en-GB', 'uk'], 'en'],
    [['uk-UA'], 'uk'],
    [['UK-ua'], 'uk'],
    [['uk_UA'], 'uk'],
    [['de_DE', 'en_US'], 'en'],
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
})
