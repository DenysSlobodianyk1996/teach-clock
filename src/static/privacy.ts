/**
 * Where the Web App build writes the static Privacy Page (batch 23, rendered from the app's own
 * Privacy Page since batch 24), under the site root: Google Play's Privacy policy URL is
 * …/teach-clock/privacy/. The app's own Privacy Page is the /privacy-policy screen, never /privacy.
 * Plain constants with no imports: vite.config.ts reads this file in Node.
 */
export const PRIVACY_PAGE = 'privacy/index.html'

/**
 * Addresses that are the static Privacy Page, not the app, so the service worker's offline
 * navigation fallback never answers them with index.html (vite.config.ts): with or without a
 * trailing slash, index.html or a query string. Workbox tests these against the path plus the
 * query string.
 */
export const NOT_THE_APP_PAGES: RegExp[] = [/\/privacy(?:\/(?:index\.html)?)?(?:\?.*)?$/]
