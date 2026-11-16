import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppI18n } from '..'
import { stubDeviceLanguages } from '@/test/deviceLanguages'
import { t, tEn } from '@/test/i18n'

/** The Game Name the interface shows first, before the Preferences store is read. */
const firstGameName = () => createAppI18n().global.t('app.name')

describe('the interface text before the app reads the Preferences', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('is in the device language on a fresh device', () => {
    stubDeviceLanguages(['en-US'])
    expect(firstGameName()).toBe(tEn('app.name'))
    stubDeviceLanguages(['uk-UA'])
    expect(firstGameName()).toBe(t('app.name'))
  })

  it('is in the saved language', () => {
    localStorage.setItem('teach-clock.locale', 'uk')
    stubDeviceLanguages(['en-US'])
    expect(firstGameName()).toBe(t('app.name'))
  })

  it('falls back to English for text a language lacks', () => {
    const { t: text } = createAppI18n('uk').global
    expect(text('app.name', {}, { locale: 'de' as 'uk' })).toBe(tEn('app.name'))
  })
})
