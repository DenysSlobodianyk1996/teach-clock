import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage, usePreferredDark, usePreferredLanguages } from '@vueuse/core'
import { deviceLocale } from '@/i18n/deviceLocale'

export const LOCALES = ['uk', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const THEMES = ['light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

/** A value kept on the device that falls back to `fallback` when what is stored is unknown. */
function useChoice<T extends string, F extends T | null>(
  key: string,
  choices: readonly T[],
  fallback: F,
) {
  return useStorage<T | F>(key, fallback, undefined, {
    flush: 'sync',
    // Its own write events would pause saving until the next tick; one tab is enough here.
    listenToStorageChanges: false,
    serializer: {
      read: (raw) => (choices.includes(raw as T) ? (raw as T) : fallback),
      write: (value) => value ?? '',
    },
  })
}

/**
 * The Preferences: interface language and colour theme, kept on the device. Until the Player
 * picks one, each follows the device: the language its language list (src/i18n/deviceLocale.ts),
 * the theme its dark mode. Only the Player's pick is saved. index.html applies the same rules
 * before the app loads.
 */
export const usePreferencesStore = defineStore('preferences', () => {
  // A `uk` saved before ADR 0005 was the old default, saved automatically; it is kept.
  const chosenLocale = useChoice<Locale, null>('teach-clock.locale', LOCALES, null)
  const deviceLanguages = usePreferredLanguages()
  const chosenTheme = useChoice<Theme, null>('teach-clock.theme', THEMES, null)
  const deviceIsDark = usePreferredDark()

  const locale = computed<Locale>({
    get: () => chosenLocale.value ?? deviceLocale(deviceLanguages.value),
    set: (value) => {
      chosenLocale.value = value
    },
  })

  const theme = computed<Theme>({
    get: () => chosenTheme.value ?? (deviceIsDark.value ? 'dark' : 'light'),
    set: (value) => {
      chosenTheme.value = value
    },
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { locale, theme, toggleTheme }
})
