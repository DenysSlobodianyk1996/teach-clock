/**
 * The Privacy Page (batch 23): src/static/privacy.html, which every build writes here, under the
 * site root. The Footer links the full file name: Capacitor serves the app for a bare folder.
 */
export const PRIVACY_PAGE = 'privacy/index.html'

/**
 * Addresses that are the Privacy Page, not the app, so the service worker's offline navigation
 * fallback never answers them with index.html (vite.config.ts): with or without a trailing slash,
 * index.html or a query string. Workbox tests these against the path plus the query string.
 */
export const NOT_THE_APP_PAGES: RegExp[] = [/\/privacy(?:\/(?:index\.html)?)?(?:\?.*)?$/]
