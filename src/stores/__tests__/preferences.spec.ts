import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { usePreferencesStore } from '../preferences'
import { stubDeviceTheme } from '@/test/deviceTheme'
import { stubDeviceLanguages } from '@/test/deviceLanguages'

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('starts light on a fresh device in light mode', () => {
    stubDeviceTheme('light')
    expect(usePreferencesStore().theme).toBe('light')
  })

  it.each([
    [['ru', 'uk', 'en'], 'uk'],
    [['de', 'en'], 'en'],
  ])('starts a device with languages %j in %s and saves nothing', (languages, expected) => {
    stubDeviceLanguages(languages)
    const preferences = usePreferencesStore()
    expect(preferences.locale).toBe(expected)
    expect(localStorage.getItem('teach-clock.locale')).toBeNull()
  })

  it('follows the device language live until the Player picks one', () => {
    const device = stubDeviceLanguages(['en'])
    const preferences = usePreferencesStore()
    device.set(['uk'])
    expect(preferences.locale).toBe('uk')
    expect(localStorage.getItem('teach-clock.locale')).toBeNull()
  })

  it('saves the language the Player picks and keeps it whatever the device says', () => {
    const device = stubDeviceLanguages(['uk'])
    usePreferencesStore().locale = 'en'
    expect(localStorage.getItem('teach-clock.locale')).toBe('en')
    device.set(['uk'])
    setActivePinia(createPinia())
    expect(usePreferencesStore().locale).toBe('en')
  })

  it('keeps a saved Ukrainian on an English device', () => {
    localStorage.setItem('teach-clock.locale', 'uk')
    stubDeviceLanguages(['en-US', 'en'])
    expect(usePreferencesStore().locale).toBe('uk')
  })

  it('starts dark on a fresh device in dark mode', () => {
    stubDeviceTheme('dark')
    expect(usePreferencesStore().theme).toBe('dark')
  })

  it('follows the device live until the Player picks a theme', async () => {
    const device = stubDeviceTheme('light')
    const preferences = usePreferencesStore()
    device.set('dark')
    await nextTick()
    expect(preferences.theme).toBe('dark')
    expect(localStorage.getItem('teach-clock.theme')).toBeNull()
  })

  it('remembers the language and theme on the device', () => {
    stubDeviceTheme('dark')
    const preferences = usePreferencesStore()
    preferences.locale = 'en'
    preferences.theme = 'light'
    setActivePinia(createPinia())
    expect(usePreferencesStore().locale).toBe('en')
    expect(usePreferencesStore().theme).toBe('light')
  })

  it('keeps a saved theme when the device changes', async () => {
    localStorage.setItem('teach-clock.theme', 'light')
    const device = stubDeviceTheme('light')
    const preferences = usePreferencesStore()
    device.set('dark')
    await nextTick()
    expect(preferences.theme).toBe('light')
  })

  it.each(['middle', 'neon'])(
    'follows the device when the saved language is de and the theme %s',
    (saved) => {
      localStorage.setItem('teach-clock.locale', 'de')
      localStorage.setItem('teach-clock.theme', saved)
      stubDeviceTheme('dark')
      stubDeviceLanguages(['uk-UA'])
      const preferences = usePreferencesStore()
      expect(preferences.locale).toBe('uk')
      expect(preferences.theme).toBe('dark')
    },
  )

  it('toggles between light and dark and saves the choice', () => {
    stubDeviceTheme('light')
    const preferences = usePreferencesStore()
    preferences.toggleTheme()
    expect(preferences.theme).toBe('dark')
    expect(localStorage.getItem('teach-clock.theme')).toBe('dark')
    preferences.toggleTheme()
    expect(preferences.theme).toBe('light')
    expect(localStorage.getItem('teach-clock.theme')).toBe('light')
  })
})
