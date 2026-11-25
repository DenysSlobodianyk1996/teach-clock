/**
 * The Play Store feature graphic in each listing language: docs/store/feature-graphic.svg with
 * its text slots filled in. `npm run store-shots` draws each one into docs/store/<lang>/feature-graphic.png.
 * The English one, docs/store/en/feature-graphic.png, is also the Web App's link preview image:
 * the Pages build copies it to og-image.png (`seoPlugin` in vite.config.ts), so redrawing it
 * changes link previews.
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
