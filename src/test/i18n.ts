import { createAppI18n } from '../i18n'
import { LOCALES, languageOf, type Locale } from '../i18n/locales'

export { LOCALES, type Locale }

/** Interface text by key, exactly as the app shows it (Ukrainian). Tests use this, never literal text. */
export const { t } = createAppI18n('uk').global

/** Interface text by key in `locale`, for tests that loop over the language list. */
export function tIn(locale: Locale, key: string, named: Record<string, unknown> = {}): string {
  return t(key, named, { locale })
}

/** Interface text by key in English, for tests that switch the language. */
export function tEn(key: string, named: Record<string, unknown> = {}): string {
  return tIn('en', key, named)
}

/** The header language button's accessible name while `locale` is in use. */
export function languageNow(locale: Locale): string {
  return tIn(locale, 'header.languageNow', { language: languageOf(locale).name })
}

/** The key the header language button shows while `locale` is in use. */
export function languageKey(locale: Locale): string {
  return languageOf(locale).key
}
