import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { usePreferencesStore } from '../preferences'
import { stubDeviceTheme } from '@/test/deviceTheme'

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => vi.unstubAllGlobals())

  it('starts in Ukrainian and light on a fresh device in light mode', () => {
    stubDeviceTheme('light')
    const preferences = usePreferencesStore()
    expect(preferences.locale).toBe('uk')
    expect(preferences.theme).toBe('light')
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

  it.each(['middle', 'neon'])('follows the device when the saved theme is %s', (saved) => {
    localStorage.setItem('teach-clock.locale', 'de')
    localStorage.setItem('teach-clock.theme', saved)
    stubDeviceTheme('dark')
    const preferences = usePreferencesStore()
    expect(preferences.locale).toBe('uk')
    expect(preferences.theme).toBe('dark')
  })

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
