import type { ManifestOptions } from 'vite-plugin-pwa'
import { THEME_BG } from './themeColors.ts'
import { LOCALES, type Locale } from './i18n/locales.ts'
import { MESSAGES } from './i18n/messages.ts'

/** The manifest file for `locale`, at the site root next to index.html. */
export function webManifestFile(locale: Locale): string {
  return `manifest.${locale}.webmanifest`
}

/** The address the page links for `locale`'s manifest, under the site's `base`. */
export function webManifestHref(base: string, locale: Locale): string {
  return `${base}${webManifestFile(locale)}`
}

/**
 * The Web App's manifest in each interface language, from one definition: only the name, short
 * name, description and `lang` differ. The page links the one in the interface language, so the
 * browser installs the full Game Name the Player sees (decision 8, batch 13). Name and short name
 * are both the full Game Name: it is never shortened. The Android App has none (ADR 0004).
 */
export function webManifests(base: string): Record<Locale, Partial<ManifestOptions>> {
  const manifest = (lang: Locale): Partial<ManifestOptions> => ({
    name: MESSAGES[lang].app.name,
    short_name: MESSAGES[lang].app.name,
    description: MESSAGES[lang].app.description,
    lang,
    // The browser bar starts light, the default theme; index.html repaints it per theme.
    theme_color: THEME_BG.light,
    // The launch screen matches the maskable and Apple icons, which sit on the dark background.
    background_color: THEME_BG.dark,
    display: 'standalone',
    start_url: base,
    scope: base,
    icons: [
      { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  })
  return Object.fromEntries(LOCALES.map((lang) => [lang, manifest(lang)])) as Record<
    Locale,
    Partial<ManifestOptions>
  >
}
