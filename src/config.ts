/** The author's address for Contact in the Footer. Also printed on the Privacy Page. */
export const CONTACT_EMAIL = 'denys.slobodianyk@gmail.com'

/** The game's public issue tracker, the Privacy Page's second way to ask a question. */
export const ISSUES_URL = 'https://github.com/DenysSlobodianyk1996/teach-clock/issues'

/** The subject a Contact email starts with, in English whatever the interface language. */
export const CONTACT_SUBJECT = 'Contact support from teach clock for kids'

/**
 * The oldest Chrome the game must work on: an Android App on a phone whose system WebView was never
 * updated, such as a Samsung S8's (batch 22). Vite builds the JS and CSS for it (vite.config.ts),
 * and src/__tests__/cssFloor.spec.ts fails on CSS it lacks without a fallback.
 */
export const OLDEST_CHROME = 87

/**
 * The Web App's public address on GitHub Pages, written only here: the link preview tags, the
 * canonical link and sitemap.xml use it (vite.config.ts). scripts/release-wizard.sh's WEBSITE_URL
 * must match.
 */
export const SITE_URL = 'https://denysslobodianyk1996.github.io/teach-clock/'
