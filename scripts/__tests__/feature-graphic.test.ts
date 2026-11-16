// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { featureGraphicSvg } from '../featureGraphic.ts'

/** The title and tagline lines a feature graphic shows, top to bottom. */
function lines(svg: string) {
  const block = /<!-- Title and line -->([\s\S]*?)<\/g>/.exec(svg)![1]!
  return [...block.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])
}

describe('Feature graphic', () => {
  it('in Ukrainian keeps its text: "Вчимо / годинник" and the tagline', () => {
    expect(lines(featureGraphicSvg('uk'))).toEqual([
      'Вчимо',
      'годинник',
      'Чотири ігри, щоб навчитися',
      'читати й ставити час',
    ])
  })

  it('in English shows "Teach / Clock" and its tagline', () => {
    const [title1, title2, ...tagline] = lines(featureGraphicSvg('en'))
    expect([title1, title2]).toEqual(['Teach', 'Clock'])
    expect(tagline.join(' ')).toBe('Four games to learn to read and set the time')
  })

  it('has the same layout in both languages', () => {
    const layout = (svg: string) => svg.replace(/>[^<]*</g, '><')
    expect(layout(featureGraphicSvg('en'))).toBe(layout(featureGraphicSvg('uk')))
  })
})
