import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const LOCALES = ['uk', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** In switch order; the phone button cycles through them. */
export const THEMES = ['middle', 'dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

/** A value kept on the device that falls back to `fallback` when what is stored is unknown. */
function useChoice<T extends string>(key: string, choices: readonly T[], fallback: T) {
  return useStorage<T>(key, fallback, undefined, {
    flush: 'sync',
    serializer: {
      read: (raw) => (choices.includes(raw as T) ? (raw as T) : fallback),
      write: (value) => value,
    },
  })
}

/** The Preferences: interface language and colour theme, kept on the device. */
export const usePreferencesStore = defineStore('preferences', () => {
  const locale = useChoice<Locale>('teach-clock.locale', LOCALES, 'uk')
  const theme = useChoice<Theme>('teach-clock.theme', THEMES, 'middle')

  function cycleTheme() {
    theme.value = THEMES[(THEMES.indexOf(theme.value) + 1) % THEMES.length]!
  }

  return { locale, theme, cycleTheme }
})
