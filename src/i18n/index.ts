import { createI18n } from 'vue-i18n'
import uk from './uk'

export type MessageSchema = typeof uk

export function createAppI18n() {
  return createI18n<[MessageSchema], 'uk'>({
    legacy: false,
    locale: 'uk',
    fallbackLocale: 'uk',
    messages: { uk },
  })
}
