/**
 * The Play Store feature graphic in each listing language: docs/store/feature-graphic.svg with
 * its text slots filled in. `npm run store-shots` draws each one into feature-graphic.<lang>.png.
 */
import { readFileSync } from 'node:fs'
import uk from '../src/i18n/uk.ts'
import en from '../src/i18n/en.ts'

export type ListingLang = 'uk' | 'en'

/** The tagline under the Game Name, in two lines. Store text, not interface text. */
const TAGLINE: Record<ListingLang, [string, string]> = {
  uk: ['Чотири ігри, щоб навчитися', 'читати й ставити час'],
  en: ['Four games to learn to read', 'and set the time'],
}

const GAME_NAME: Record<ListingLang, string> = { uk: uk.app.name, en: en.app.name }

const template = () =>
  readFileSync(new URL('../docs/store/feature-graphic.svg', import.meta.url), 'utf8')

/** The feature graphic's SVG in `lang`: the Game Name over two lines, then the tagline. */
export function featureGraphicSvg(lang: ListingLang): string {
  const [title1, ...rest] = GAME_NAME[lang].split(' ')
  const [tagline1, tagline2] = TAGLINE[lang]
  const slots: Record<string, string> = {
    title1: title1!,
    title2: rest.join(' '),
    tagline1,
    tagline2,
  }
  return template().replace(/\{(\w+)\}/g, (_, slot: string) => slots[slot]!)
}
