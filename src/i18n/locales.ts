/**
 * The interface languages. A plain module with no imports, so vite.config.ts, the Web App
 * manifests and the Preferences store all share it.
 */
export const LOCALES = ['uk', 'en'] as const
export type Locale = (typeof LOCALES)[number]
