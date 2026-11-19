/**
 * The "Updated" date on the Privacy Page (batch 21). Every build prints the date of the commit it
 * builds, so each deploy from main (GitHub Pages and the Android App alike) carries the day it was
 * merged, with nothing to bump by hand. vite.config.ts fills src/static/privacy.html with it
 * (batch 23); VITE_PRIVACY_UPDATED overrides it.
 */
import { execSync } from 'node:child_process'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function privacyUpdated({
  given,
  commitDate = () => execSync('git log -1 --format=%cs', { encoding: 'utf8', stdio: 'pipe' }),
  now = new Date(),
}: {
  /** A date set from outside, e.g. to rebuild an older release with its own date. */
  given?: string
  /** The built commit's date, YYYY-MM-DD. */
  commitDate?: () => string
  now?: Date
} = {}): string {
  if (given && ISO_DATE.test(given)) return given
  try {
    const date = commitDate().trim()
    if (ISO_DATE.test(date)) return date
  } catch {
    // No git (a source archive): today.
  }
  return now.toISOString().slice(0, 10)
}

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

/** A YYYY-MM-DD date as the page prints it in each language, independent of the build's ICU. */
export function formatPrivacyDate(iso: string, lang: 'en' | 'uk'): string {
  const [year, month, day] = iso.split('-').map(Number)
  const index = (month ?? 1) - 1
  return lang === 'en'
    ? `${day} ${EN_MONTHS[index]} ${year}`
    : `${day} ${UK_MONTHS[index]} ${year} року`
}

/** src/static/privacy.html with its date placeholders filled in. */
export function fillPrivacyPage(html: string, iso: string): string {
  return html
    .replaceAll('%PRIVACY_UPDATED%', iso)
    .replaceAll('%PRIVACY_UPDATED_EN%', formatPrivacyDate(iso, 'en'))
    .replaceAll('%PRIVACY_UPDATED_UK%', formatPrivacyDate(iso, 'uk'))
}
