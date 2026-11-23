import { describe, expect, it } from 'vitest'
import { LANGUAGES, LOCALES } from '../locales'
import { MESSAGES } from '../messages'
import { createAppI18n } from '..'

/** Every leaf key as a dotted path, e.g. `round.submit`. */
function keys(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

/** The text at a dotted path. */
const at = (messages: object, path: string) =>
  path.split('.').reduce<unknown>((m, k) => (m as Record<string, unknown>)[k], messages) as string

/** The `{name}` placeholders in a text, sorted. */
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('the language list', () => {
  it('is English then Ukrainian, each with its key and own name', () => {
    expect(LANGUAGES).toEqual([
      { code: 'en', key: 'EN', name: 'English' },
      { code: 'uk', key: 'УК', name: 'Українська' },
    ])
    expect(LOCALES).toEqual(['en', 'uk'])
  })

  it('has interface text for exactly the languages on the list', () => {
    expect(Object.keys(MESSAGES).sort()).toEqual([...LOCALES].sort())
  })
})

describe('interface text', () => {
  it.each(LOCALES)('%s has the same keys and placeholders as Ukrainian', (locale) => {
    const source = MESSAGES.uk
    expect(keys(MESSAGES[locale]).sort()).toEqual(keys(source).sort())
    const byKey = (messages: object) =>
      Object.fromEntries(keys(source).map((path) => [path, placeholders(at(messages, path))]))
    expect(byKey(MESSAGES[locale])).toEqual(byKey(source))
  })

  it('has no empty text', () => {
    const empty = LOCALES.flatMap((locale) =>
      keys(MESSAGES[locale]).filter((path) => at(MESSAGES[locale], path) === ''),
    )
    expect(empty).toEqual([])
  })

  it('reads correctly in English when the long hand shows 1 minute', () => {
    const { t } = createAppI18n('en').global
    const hint = t('teach.mistakes.minuteBetween', { number: 12, minute: 1 })
    expect(hint).not.toMatch(/\b1 minutes\b/)
    expect(hint).toContain('1')
  })
})
