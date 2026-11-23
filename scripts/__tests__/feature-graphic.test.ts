// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { featureGraphicSvg } from '../featureGraphic.ts'
import { STORE_LANGUAGES } from '../storeLanguages.ts'
import { t, tEn } from '../../src/test/i18n.ts'

/** The Game Name's words in `locale`, one title line each. */
const nameWords = {
  uk: t('app.name', {}, { locale: 'uk' }).split(' '),
  en: tEn('app.name').split(' '),
}

/** The title and tagline lines a feature graphic shows, top to bottom. */
function lines(svg: string) {
  const block = /<!-- Title and line -->([\s\S]*?)<\/g>/.exec(svg)![1]!
  return [...block.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])
}

describe('Feature graphic', () => {
  it('in Ukrainian shows the Game Name, a word per line, and keeps its tagline', () => {
    expect(lines(featureGraphicSvg('uk'))).toEqual([
      ...nameWords.uk,
      'Чотири ігри, щоб навчитися',
      'читати й ставити час',
    ])
  })

  it('in English shows the Game Name, a word per line, and its tagline', () => {
    const [title1, title2, ...tagline] = lines(featureGraphicSvg('en'))
    expect([title1, title2]).toEqual(nameWords.en)
    expect(tagline.join(' ')).toBe('Four games to learn to read and set the time')
  })

  it('in German shows the Game Name, a word per line, and its tagline', () => {
    expect(lines(featureGraphicSvg('de'))).toEqual([
      'Uhr',
      'lernen',
      'Vier Spiele, um die Uhr',
      'lesen und stellen zu lernen',
    ])
  })

  it('has the same layout in every store language', () => {
    const layout = (svg: string) => svg.replace(/>[^<]*</g, '><')
    for (const lang of STORE_LANGUAGES) {
      expect(layout(featureGraphicSvg(lang))).toBe(layout(featureGraphicSvg('en')))
    }
  })
})
