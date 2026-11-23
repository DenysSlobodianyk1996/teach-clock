/**
 * The Play Store feature graphic in each listing language: docs/store/feature-graphic.svg with
 * its text slots filled in. `npm run store-shots` draws each one into docs/store/<lang>/feature-graphic.png.
 */
import { readFileSync } from 'node:fs'
import { MESSAGES } from '../src/i18n/messages.ts'
import type { Locale } from '../src/i18n/locales.ts'
import { tagline } from './storeLanguages.ts'

const template = () =>
  readFileSync(new URL('../docs/store/feature-graphic.svg', import.meta.url), 'utf8')

/** The feature graphic's SVG in `lang`: the Game Name over two lines, then the tagline. */
export function featureGraphicSvg(lang: Locale): string {
  const [title1, ...rest] = MESSAGES[lang].app.name.split(' ')
  const [tagline1, tagline2] = tagline(lang)
  const slots: Record<string, string> = {
    title1: title1!,
    title2: rest.join(' '),
    tagline1,
    tagline2,
  }
  return template().replace(/\{(\w+)\}/g, (_, slot: string) => slots[slot]!)
}
