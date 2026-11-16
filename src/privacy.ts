/**
 * The Privacy Page's text lives in i18n (`privacy.*`) and its look in PrivacyContent.vue, shown in
 * the app by PrivacyView and rendered into the static `privacy.html` by src/privacyStatic.ts.
 */
import { PRIVACY_UPDATED } from './config.ts'

export type PrivacyLocale = 'uk' | 'en'

/** "13 листопада 2026 р." / "13 November 2026". */
export function formatPrivacyDate(locale: PrivacyLocale, iso: string = PRIVACY_UPDATED): string {
  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`))
}
