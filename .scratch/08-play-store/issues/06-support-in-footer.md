# 06: Support Button in the Footer, Web App only

Covers: P6

**What to build:** the Footer shows the Support Button only in the Web App with a real link.

**Blocked by:** 01, 04, 05

**Status:** done

- [x] `AppFooter.vue` renders `SupportButton` when `!isAndroidApp && supportUrl`
- [x] `unset`, empty or a non-`https://` value hides it
- [x] Vitest: three cases (Web App + URL shows; Web App + `unset` hides; Android App + URL hides)
- [x] Playwright (built with a test URL): the button is there on Welcome; holding it opens a new page with that URL (`e2e/support-button.spec.ts` starts its own dev server with `VITE_SUPPORT_URL=https://example.com/support`; checked by eye in all three themes on phone and desktop)
