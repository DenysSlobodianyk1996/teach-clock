/**
 * What each Play listing needs beyond the interface text. A language on the shared list joins the
 * store (screenshots, feature graphic, listing checks, release wizard) when it has an entry here.
 * The release wizard reads `playLocale` from this file, so keep it on a line of its own.
 */
import { LOCALES, type Locale } from '../src/i18n/locales.ts'

interface StoreLanguage {
  /** The locale of its release notes on Google Play. */
  playLocale: string
  /** The Player's name in its screenshots. */
  playerName: string
  /** The feature graphic's tagline under the Game Name, in two lines. */
  tagline: [string, string]
}

const STORE: Partial<Record<Locale, StoreLanguage>> = {
  en: {
    playLocale: 'en-US',
    playerName: 'Emma',
    tagline: ['Four games to learn to read', 'and set the time'],
  },
  uk: {
    playLocale: 'uk-UA',
    playerName: 'Оля',
    tagline: ['Чотири ігри, щоб навчитися', 'читати й ставити час'],
  },
  de: {
    playLocale: 'de-DE',
    playerName: 'Mia',
    tagline: ['Vier Spiele, um die Uhr', 'lesen und stellen zu lernen'],
  },
  fr: {
    playLocale: 'fr-FR',
    playerName: 'Léa',
    tagline: ['Quatre jeux pour apprendre', 'à lire et régler l’heure'],
  },
  it: {
    playLocale: 'it-IT',
    playerName: 'Giulia',
    tagline: ['Quattro giochi per imparare', 'a leggere e impostare l’ora'],
  },
  es: {
    playLocale: 'es-ES',
    playerName: 'Lucía',
    tagline: ['Cuatro juegos para aprender', 'a leer y poner la hora'],
  },
}

/** The languages with a Play listing, in the order of the shared language list. */
export const STORE_LANGUAGES: readonly Locale[] = LOCALES.filter((locale) => locale in STORE)

const entry = (lang: Locale) => STORE[lang]!

export const playLocale = (lang: Locale) => entry(lang).playLocale
export const playerName = (lang: Locale) => entry(lang).playerName
export const tagline = (lang: Locale) => entry(lang).tagline
