import type { Locale } from './i18n/locales.ts'

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

/**
 * The app's version on the Privacy Page, e.g. 1.0.23: package.json's major.minor and the Android
 * run number, the same as Google Play's versionName (scripts/appVersion.ts, batch 27).
 */
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION ?? '1.0.0'

export type PrivacyLocale = Locale

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

const DE_MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

/** Each language's written date; a listed language without one fails to build. */
const DATES: Record<Locale, (day: number, month: number, year: number) => string> = {
  en: (day, month, year) => `${day} ${EN_MONTHS[month]} ${year}`,
  uk: (day, month, year) => `${day} ${UK_MONTHS[month]} ${year} року`,
  de: (day, month, year) => `${day}. ${DE_MONTHS[month]} ${year}`,
}

/**
 * "19 листопада 2026 року" / "19 November 2026". Spelled out here rather than with Intl, so the
 * static page built in Node and the app print exactly the same words.
 */
export function formatPrivacyDate(locale: PrivacyLocale, iso: string = PRIVACY_UPDATED): string {
  const [year, month, day] = iso.split('-').map(Number)
  return DATES[locale](day!, (month ?? 1) - 1, year!)
}
