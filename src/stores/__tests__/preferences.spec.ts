import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePreferencesStore } from '../preferences'

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts in Ukrainian with the middle theme on a fresh device', () => {
    const preferences = usePreferencesStore()
    expect(preferences.locale).toBe('uk')
    expect(preferences.theme).toBe('middle')
  })

  it('remembers the language and theme on the device', () => {
    const preferences = usePreferencesStore()
    preferences.locale = 'en'
    preferences.theme = 'light'
    setActivePinia(createPinia())
    expect(usePreferencesStore().locale).toBe('en')
    expect(usePreferencesStore().theme).toBe('light')
  })

  it('falls back to the defaults when the stored values are unknown', () => {
    localStorage.setItem('teach-clock.locale', 'de')
    localStorage.setItem('teach-clock.theme', 'neon')
    const preferences = usePreferencesStore()
    expect(preferences.locale).toBe('uk')
    expect(preferences.theme).toBe('middle')
  })

  it('cycles the theme middle → dark → light → middle', () => {
    const preferences = usePreferencesStore()
    const seen = [1, 2, 3].map(() => {
      preferences.cycleTheme()
      return preferences.theme
    })
    expect(seen).toEqual(['dark', 'light', 'middle'])
  })
})
