/**
 * The interface language a device starts in, from its language list (`navigator.languages`):
 * the first of Ukrainian or English, else English (ADR 0005).
 *
 * The one copy of the rule: the Preferences store calls it, and vite.config.ts writes its source
 * into the pre-paint script in index.html, so it must stay self-contained (no imports, no outside
 * names).
 */
export function deviceLocale(languages: readonly string[]): 'uk' | 'en' {
  for (let i = 0; i < languages.length; i++) {
    const language = String(languages[i]).toLowerCase().split('-')[0]
    if (language === 'uk' || language === 'en') return language
  }
  return 'en'
}
