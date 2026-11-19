/**
 * The Privacy Page's text lives in i18n (`privacy.*`, one per language) and its look in
 * PrivacyContent.vue, shown in the app by PrivacyView (/privacy-policy) and rendered into the static
 * privacy/index.html by src/privacyStatic.ts (batch 24).
 */
/**
 * The Privacy Page's "Updated" date (ISO): the date of the commit the build was made from, so every
 * deploy carries its own date with nothing to bump by hand (scripts/privacyUpdated.ts, batch 21).
 */
export const PRIVACY_UPDATED: string = import.meta.env.VITE_PRIVACY_UPDATED ?? '2026-11-19'

export type PrivacyLocale = 'uk' | 'en'

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
// Genitive, as in "19 листопада 2026 року".
const UK_MONTHS = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
]

/**
 * "19 листопада 2026 року" / "19 November 2026". Spelled out here rather than with Intl, so the
 * static page built in Node and the app print exactly the same words.
 */
export function formatPrivacyDate(locale: PrivacyLocale, iso: string = PRIVACY_UPDATED): string {
  const [year, month, day] = iso.split('-').map(Number)
  const index = (month ?? 1) - 1
  return locale === 'en'
    ? `${day} ${EN_MONTHS[index]} ${year}`
    : `${day} ${UK_MONTHS[index]} ${year} року`
}
