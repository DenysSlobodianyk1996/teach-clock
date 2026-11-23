/**
 * The supported interface languages, in the order the game lists them: the one place a language is
 * added. Each has its key (the header button's label) and its own name, the same in every interface
 * language. A plain module with no imports, so vite.config.ts, the Web App manifests, the build
 * scripts and the Preferences store all share it.
 */
export const LANGUAGES = [
  { code: 'en', key: 'EN', name: 'English' },
  { code: 'uk', key: 'УК', name: 'Українська' },
  { code: 'de', key: 'DE', name: 'Deutsch' },
] as const

export type Locale = (typeof LANGUAGES)[number]['code']

export const LOCALES: readonly Locale[] = LANGUAGES.map((language) => language.code)

/** The language's entry on the list. */
export function languageOf(locale: Locale): (typeof LANGUAGES)[number] {
  return LANGUAGES.find((language) => language.code === locale)!
}
