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
    [[], 'en'],
  ])('%j gives %s', (languages, expected) => {
    expect(deviceLocale(languages)).toBe(expected)
  })
})
