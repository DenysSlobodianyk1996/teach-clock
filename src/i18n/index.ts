import { createI18n } from 'vue-i18n'
import uk from './uk'
import en from './en'
import type { Locale } from './locales'
import { startingLocale } from '../stores/preferences'

export type MessageSchema = typeof uk

/**
 * The interface text, starting in `locale`: by default the language the Preferences give before
 * the store exists (a saved one, else the device's), so the first paint is never in the other
 * language. App.vue keeps it in step with the store from then on.
 */
export function createAppI18n(locale: Locale = startingLocale()) {
  return createI18n<[MessageSchema], Locale>({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { uk, en },
  })
}
