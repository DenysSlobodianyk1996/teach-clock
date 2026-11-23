// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import capacitorConfig from '../../capacitor.config'
import { t, tEn, tIn } from '@/test/i18n'

/**
 * The Android App's name (ADR 0005): Android reads it from the string resources before the game
 * runs, so it follows the phone's language list. Default resources are English, `values-<code>` the other languages.
 */
const res = new URL('../../android/app/src/main/res/', import.meta.url)

/** The `<string name="…">` values in `values<qualifier>/strings.xml`. */
function strings(folder: string): Record<string, string> {
  const file = new URL(`${folder}/strings.xml`, res)
  if (!existsSync(file)) throw new Error(`No ${folder}/strings.xml`)
  const xml = readFileSync(file, 'utf8')
  return Object.fromEntries(
    [...xml.matchAll(/<string name="([^"]+)">([^<]*)<\/string>/g)].map(([, key, value]) => [
      key,
      value,
    ]),
  )
}

const gameName = {
  en: tEn('app.name'),
  uk: t('app.name', {}, { locale: 'uk' }),
  de: tIn('de', 'app.name'),
}

describe('Android App name', () => {
  it.each([
    ['values', 'en'],
    ['values-uk', 'uk'],
    ['values-de', 'de'],
  ] as const)('%s: launcher name and window title are the full Game Name (%s)', (folder, lang) => {
    const { app_name, title_activity_main } = strings(folder)
    expect(app_name).toBe(gameName[lang])
    expect(title_activity_main).toBe(gameName[lang])
  })

  it('Capacitor app name is the default (English) Game Name', () => {
    expect(capacitorConfig.appName).toBe(gameName.en)
  })
})
