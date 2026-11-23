/**
 * The Play Store feature graphic in each listing language: docs/store/feature-graphic.svg with
 * its text slots filled in. `npm run store-shots` draws each one into docs/store/<lang>/feature-graphic.png.
 */
import { readFileSync } from 'node:fs'
import { MESSAGES } from '../src/i18n/messages.ts'
import type { Locale } from '../src/i18n/locales.ts'

export type ListingLang = Locale

/** The tagline under the Game Name, in two lines. Store text, not interface text. */
const TAGLINE: Record<ListingLang, [string, string]> = {
  uk: ['Чотири ігри, щоб навчитися', 'читати й ставити час'],
  en: ['Four games to learn to read', 'and set the time'],
  de: ['Vier Spiele, um die Uhr', 'lesen und stellen zu lernen'],
  fr: ['Quatre jeux pour apprendre', 'à lire et régler l’heure'],
  it: ['Quattro giochi per imparare', 'a leggere e impostare l’ora'],
  es: ['Cuatro juegos para aprender', 'a leer y poner la hora'],
}

const template = () =>
  readFileSync(new URL('../docs/store/feature-graphic.svg', import.meta.url), 'utf8')

/** The feature graphic's SVG in `lang`: the Game Name over two lines, then the tagline. */
export function featureGraphicSvg(lang: ListingLang): string {
  const [title1, ...rest] = MESSAGES[lang].app.name.split(' ')
  const [tagline1, tagline2] = TAGLINE[lang]
  const slots: Record<string, string> = {
    title1: title1!,
    title2: rest.join(' '),
    tagline1,
    tagline2,
  }
  return template().replace(/\{(\w+)\}/g, (_, slot: string) => slots[slot]!)
}
