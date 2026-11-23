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
  it('is EN, УК, DE, FR, IT, ES, each with its key and own name', () => {
    expect(LANGUAGES).toEqual([
      { code: 'en', key: 'EN', name: 'English' },
      { code: 'uk', key: 'УК', name: 'Українська' },
      { code: 'de', key: 'DE', name: 'Deutsch' },
      { code: 'fr', key: 'FR', name: 'Français' },
      { code: 'it', key: 'IT', name: 'Italiano' },
      { code: 'es', key: 'ES', name: 'Español' },
    ])
    expect(LOCALES).toEqual(['en', 'uk', 'de', 'fr', 'it', 'es'])
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

  it.each([1, 2, 12])('reads correctly in German with the count %i', (n) => {
    const { t } = createAppI18n('de').global
    const hint = t('teach.mistakes.minuteOn', { number: n, minute: n })
    expect(hint).not.toMatch(/\b1 Minuten\b/)
    expect(t('teach.mistakes.hourOn', { hour: n })).not.toMatch(/\b(der|dem|den) \d/)
  })

  const ROMANCE = ['fr', 'it', 'es'] as const
  const texts = (locale: (typeof ROMANCE)[number]) =>
    keys(MESSAGES[locale]).map((path) => at(MESSAGES[locale], path))

  it.each(ROMANCE)('%s puts no article or elision right before a number', (locale) => {
    const bad = texts(locale).filter((text) =>
      /(?:^|[\s(])(?:le|la|les|l['’]|il|lo|el|los|las|d['’]|dell['’]|all['’])\s*\{(?:hour|next|number|minute|n|right|total|time)\}/i.test(
        text,
      ),
    )
    expect(bad).toEqual([])
  })

  it.each(ROMANCE)('%s puts no counted noun right after a number', (locale) => {
    const bad = texts(locale).filter((text) =>
      /\{(?:hour|next|number|minute|n|right|total)\}\s+(?:minut|heure|ore\b|ora\b|hora|nombre|numer|númer|chiffre|cifra|plac|pos[éet])/i.test(
        text,
      ),
    )
    expect(bad).toEqual([])
  })

  it('French has a non-breaking space before ! ? ; : and inside « »', () => {
    const bad = texts('fr').filter(
      (text) =>
        /[^\u00a0\u202f][!?;»]/.test(text) ||
        /«[^\u00a0\u202f]/.test(text) ||
        / :(?!\d)/.test(text),
    )
    expect(bad).toEqual([])
  })

  it.each([
    ['fr', 'petite aiguille', 'grande aiguille'],
    ['it', 'lancetta', 'lancetta'],
    ['es', 'manecilla', 'manecilla'],
  ] as const)('%s names the clock hands in its usual words', (locale, short, long) => {
    expect(MESSAGES[locale].round.hourHand.toLowerCase()).toContain(short)
    expect(MESSAGES[locale].round.minuteHand.toLowerCase()).toContain(long)
  })

  it.each([
    ['fr', "Apprendre l'heure"],
    ['it', "Impara l'ora"],
    ['es', 'Aprende la hora'],
  ] as const)('%s has its full Game Name', (locale, name) => {
    expect(MESSAGES[locale].app.name).toBe(name)
  })
})
