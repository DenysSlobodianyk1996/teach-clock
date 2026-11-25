// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { MESSAGES } from '../../src/i18n/messages.ts'
import { STORE_LANGUAGES, playLocale } from '../storeLanguages.ts'

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

it('has a Play listing for all six languages, in the language list order', () => {
  expect(STORE_LANGUAGES).toEqual(['en', 'uk', 'de', 'fr', 'it', 'es'])
})

it('names each listing by its Play locale', () => {
  expect(STORE_LANGUAGES.map(playLocale)).toEqual([
    'en-US',
    'uk-UA',
    'de-DE',
    'fr-FR',
    'it-IT',
    'es-ES',
  ])
})

it('tells every listing which six languages the game has', () => {
  const named = {
    en: ['English', 'Ukrainian', 'German', 'French', 'Italian', 'Spanish'],
    uk: ['англійська', 'українська', 'німецька', 'французька', 'італійська', 'іспанська'],
    de: ['Englisch', 'Ukrainisch', 'Deutsch', 'Französisch', 'Italienisch', 'Spanisch'],
    fr: ['anglais', 'ukrainien', 'allemand', 'français', 'italien', 'espagnol'],
    it: ['inglese', 'ucraino', 'tedesco', 'francese', 'italiano', 'spagnolo'],
    es: ['inglés', 'ucraniano', 'alemán', 'francés', 'italiano', 'español'],
  }
  for (const [lang, languages] of Object.entries(named)) {
    const text = fields(lang)['Full description']!.text.toLowerCase()
    for (const language of languages) expect(text).toContain(language.toLowerCase())
  }
})

it('gives every listing its release notes in the Android workflow, in its Play locale', () => {
  const workflow = readFileSync(
    fileURLToPath(new URL('../../.github/workflows/android.yml', import.meta.url)),
    'utf8',
  )
  for (const lang of STORE_LANGUAGES) {
    const upper = lang.toUpperCase()
    expect(workflow).toContain(`notes_${lang}:`)
    expect(workflow).toContain(`NOTES_${upper}: \${{ inputs.notes_${lang} }}`)
    expect(workflow).toContain(`write_notes ${playLocale(lang)} "$NOTES_${upper}" notes_${lang}`)
    const pushNote = new RegExp(`^ +NOTES_${upper}='(.+)'$`, 'm').exec(workflow)?.[1]
    expect(chars(pushNote!)).toBeLessThanOrEqual(500)
  }
})

describe.each(STORE_LANGUAGES.map((lang) => [lang, MESSAGES[lang].app.name] as const))(
  'Play listing %s',
  (lang, gameName) => {
    const listing = fields(lang)

    it.each(Object.entries(LIMITS))(
      "%s states its real count and fits Play's %i",
      (field, limit) => {
        const { count, limit: stated, text } = listing[field]!
        expect(stated).toBe(limit)
        expect(count).toBe(chars(text))
        expect(chars(text)).toBeLessThanOrEqual(limit)
      },
    )

    it('has a title "Game Name — tagline"', () => {
      expect(listing['App name']!.text.startsWith(`${gameName} — `)).toBe(true)
    })

    // The page's description in search results, link previews and the install prompt (batch 31).
    it("is the game's description in its language, word for word", () => {
      expect(MESSAGES[lang].app.description).toBe(listing['Short description']!.text)
    })

    it('keeps everything for its Play listing in one folder, with plain filenames', () => {
      const testers = lang === 'en' || lang === 'uk' ? ['testers.md'] : []
      expect(readdirSync(`${store}${lang}`).sort()).toEqual([
        'feature-graphic.png',
        'listing.md',
        'phone',
        'tablet-10',
        'tablet-7',
        ...testers,
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
  },
)

it('keeps only language-neutral files in the store root', () => {
  const files = readdirSync(store, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== '.DS_Store')
    .map((entry) => entry.name)
  expect(files.sort()).toEqual(['closed-test.md', 'feature-graphic.svg', 'icon-512.png'])
  expect(existsSync(`${store}screenshots`)).toBe(false)
})
