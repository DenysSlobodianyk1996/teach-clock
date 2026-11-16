import type { Locale } from './locales'

/**
 * The interface language a device starts in, from its language list (`navigator.languages`, or
 * `navigator.language` when the list is empty or missing): the first of Ukrainian or English,
 * else English (ADR 0005). Tags may use `-` or `_` (`uk-UA`, `uk_UA`).
 *
 * The one copy of the rule: the Preferences store calls it, and vite.config.ts compiles this file
 * into the pre-paint script in index.html, so it must stay self-contained (type imports only, no
 * outside names).
 */
export function deviceLocale(languages: readonly string[] | undefined, language?: string): Locale {
  const list = languages && languages.length ? languages : language ? [language] : []
  for (let i = 0; i < list.length; i++) {
    const tag = String(list[i]).toLowerCase().split(/[-_]/)[0]
    if (tag === 'uk' || tag === 'en') return tag
  }
  return 'en'
}
