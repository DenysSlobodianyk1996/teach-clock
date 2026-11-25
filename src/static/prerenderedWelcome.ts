/**
 * The prerendered English Welcome in the GitHub Pages build's index.html (batch 31) shows only where
 * the app opens Welcome: the site root, since `/` always opens it (only the Player's name is kept).
 * Any other address the build serves (a reload of /settings, /round, /summary or /privacy-policy,
 * 404.html, the service worker's fallback) hides it before the first paint, so Welcome never flashes
 * up and jumps away. Crawlers, with JavaScript or without, get the root and see it. Plain constants
 * with no imports: vite.config.ts reads this file in Node.
 */

/** Set on `<html>` by the pre-paint script when the prerendered Welcome must not show. */
export const PRERENDER_HIDDEN = 'data-prerender-hidden'

/** Marks the prerendered content inside `#app`. */
export const PRERENDERED = 'data-prerendered'

/** The rule that hides the prerendered content once the script marked `<html>`. */
export const PRERENDER_HIDDEN_CSS = `[${PRERENDER_HIDDEN}] [${PRERENDERED}] { display: none }`

/** The pre-paint script for the site served from `base` (`/teach-clock/` on GitHub Pages). */
export function prerenderedWelcomeScript(base: string): string {
  const root = base.endsWith('/') ? base : `${base}/`
  const rootPaths = [root, `${root}index.html`, root.slice(0, -1) || '/']
  return `(function () {
  if (${JSON.stringify(rootPaths)}.indexOf(location.pathname) < 0) {
    document.documentElement.setAttribute(${JSON.stringify(PRERENDER_HIDDEN)}, '')
  }
})()`
}
