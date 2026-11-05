import { createAppI18n } from '@/i18n'

/** Interface text by key, exactly as the app shows it (Ukrainian). Tests use this, never literal text. */
export const { t } = createAppI18n().global
