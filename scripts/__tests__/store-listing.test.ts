// @vitest-environment node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import uk from '../../src/i18n/uk.ts'
import en from '../../src/i18n/en.ts'

// The Play listing texts in docs/store/listing.<lang>.md: each field is a `## Field (n / limit)`
// heading and a ```text block, pasted into Play Console as is.
const store = fileURLToPath(new URL('../../docs/store/', import.meta.url))

function fields(lang: string) {
  const md = readFileSync(`${store}listing.${lang}.md`, 'utf8')
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
})
