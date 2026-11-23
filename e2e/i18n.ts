import { MESSAGES, type MessageSchema } from '../src/i18n/messages.ts'
import { LOCALES, languageOf, type Locale } from '../src/i18n/locales.ts'
import type { Page } from '@playwright/test'

export { LOCALES, type Locale }

/** Every dotted key in the messages, such as `teach.right`. */
type Key<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Key<T[K]>}`
}[keyof T & string]

/** Looks up interface text by key in `messages`, with `{name}` filled from `params`. */
function lookup(messages: MessageSchema, key: string, params: Record<string, string | number>) {
  const message = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], messages)
  if (typeof message !== 'string') throw new Error(`No message "${key}"`)
  return message.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (!(name in params)) throw new Error(`Message "${key}" needs {${name}}`)
    return String(params[name])
  })
}

/**
 * Interface text by key, as the app shows it (Ukrainian), with `{name}` filled from `params`.
 * Browser tests use this, never literal text.
 */
export function t(key: Key<MessageSchema>, params: Record<string, string | number> = {}): string {
  return tIn('uk', key, params)
}

/** Interface text by key in English, for tests that switch the language. */
export function tEn(key: Key<MessageSchema>, params: Record<string, string | number> = {}) {
  return tIn('en', key, params)
}

/** Interface text by key in `locale`, for tests that loop over the language list. */
export function tIn(
  locale: Locale,
  key: Key<MessageSchema>,
  params: Record<string, string | number> = {},
): string {
  return lookup(MESSAGES[locale], key, params)
}

/** The header language button's accessible name while `locale` is in use. */
export function languageNow(locale: Locale): string {
  return tIn(locale, 'header.languageNow', { language: languageOf(locale).name })
}

/** The key the header language button shows while `locale` is in use. */
export function languageKey(locale: Locale): string {
  return languageOf(locale).key
}

/** A row of the open language menu, named by its key and own name. */
export function languageRow(page: Page, locale: Locale) {
  const { key, name } = languageOf(locale)
  return page.getByRole('menuitemradio', { name: `${key} ${name}`, exact: true })
}

/** Opens the header's language menu, in use `from`, and chooses `to`. */
export async function chooseLanguage(page: Page, from: Locale, to: Locale) {
  await page.getByRole('button', { name: languageNow(from) }).click()
  await languageRow(page, to).click()
}

/** Matches an accessible name that starts with `text`, such as a choice card's title. */
export function startingWith(text: string): RegExp {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
}
