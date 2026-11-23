// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import uk from '../../src/i18n/uk.ts'
import en from '../../src/i18n/en.ts'

// The Play listing texts in docs/store/<lang>/listing.md: each field is a `## Field (n / limit)`
// heading and a ```text block, pasted into Play Console as is.
const store = fileURLToPath(new URL('../../docs/store/', import.meta.url))

function fields(lang: string) {
  const md = readFileSync(`${store}${lang}/listing.md`, 'utf8')
  const found = [...md.matchAll(/^## (.+?) \((\d+) \/ (\d+)\)\n\n```text\n([\s\S]*?)\n```/gm)]
  return Object.fromEntries(
    found.map(([, field, count, limit, text]) => [
      field!,
      { count: Number(count), limit: Number(limit), text: text! },
    ]),
  )
}

// Play's limits and counting: Unicode characters, so the em dash is one.
const LIMITS = { 'App name': 30, 'Short description': 80, 'Full description': 4000 }
const chars = (text: string) => [...text].length

describe.each([
  ['en', en.app.name],
  ['uk', uk.app.name],
])('Play listing %s', (lang, gameName) => {
  const listing = fields(lang)

  it.each(Object.entries(LIMITS))("%s states its real count and fits Play's %i", (field, limit) => {
    const { count, limit: stated, text } = listing[field]!
    expect(stated).toBe(limit)
    expect(count).toBe(chars(text))
    expect(chars(text)).toBeLessThanOrEqual(limit)
  })

  it('has a title "Game Name — tagline"', () => {
    expect(listing['App name']!.text.startsWith(`${gameName} — `)).toBe(true)
  })

  it('keeps everything for its Play listing in one folder, with plain filenames', () => {
    expect(readdirSync(`${store}${lang}`).sort()).toEqual([
      'feature-graphic.png',
      'listing.md',
      'phone',
      'tablet-10',
      'tablet-7',
      'testers.md',
    ])
    for (const device of ['phone', 'tablet-7', 'tablet-10']) {
      expect(readdirSync(`${store}${lang}/${device}`).sort()).toEqual([
        '1-welcome.png',
        '2-settings.png',
        '3-set-time-teach.png',
        '4-set-time-test.png',
        '5-drag-arrows-teach.png',
        '6-drag-hours-test.png',
        '7-drag-minutes-teach.png',
        '8-summary.png',
      ])
    }
  })
})

it('keeps only language-neutral files in the store root', () => {
  const files = readdirSync(store, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== '.DS_Store')
    .map((entry) => entry.name)
  expect(files.sort()).toEqual(['closed-test.md', 'feature-graphic.svg', 'icon-512.png'])
  expect(existsSync(`${store}screenshots`)).toBe(false)
})
