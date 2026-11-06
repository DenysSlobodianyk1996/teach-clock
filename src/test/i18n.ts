import { createAppI18n } from '@/i18n'

/** Interface text by key, exactly as the app shows it (Ukrainian). Tests use this, never literal text. */
export const { t } = createAppI18n().global

/** Interface text by key in English, for tests that switch the language. */
export function tEn(key: string, named: Record<string, unknown> = {}): string {
  return t(key, named, { locale: 'en' })
}
