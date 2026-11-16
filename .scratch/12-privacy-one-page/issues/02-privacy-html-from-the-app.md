# 02: privacy.html rendered from the app's Privacy Page

**Blocked by:** 01

**Status:** done

**What to build:** one Privacy Page. The Web App build renders the static `privacy.html` for Google Play from the same Vue component the app shows, with the app's own styles, so the two look the same and cannot drift. The hand-written HTML and CSS in `src/privacy.ts` go away. The URL stays `…/teach-clock/privacy.html`, so Play Console needs no change.

**What privacy.html shows:**

- The app header with the logo and "Вчимо годинник" only: no УК/EN, no sun/moon (they need JavaScript).
- The Privacy Page twice, Ukrainian then English, one under the other; each section has its own `lang`.
- The device's light or dark theme (`prefers-color-scheme`), with the app's theme tokens.
- "До гри" is a link to the web game (`./`), not the app's Back button.
- Works with JavaScript off and answers with status 200.

**Checklist:**

- [x] The Privacy Page content split so it renders for a given locale without the router (the app screen keeps its Back button; the static page gets the link).
- [x] Build step (Web App only, as today in `vite.config.ts`): server-render that content for `uk` and `en` with `vue/server-renderer`, inside the app's header, with the CSS the build already produces; emit `privacy.html`. The dev server still answers `/privacy.html`.
- [x] `src/privacy.ts`: keep `formatPrivacyDate`; drop `privacyPageHtml` and its CSS.
- [x] Tests: `src/__tests__/privacy.spec.ts` checks the rendered page (both languages, contact email, author, date, no script needed); `e2e/privacy.spec.ts` checks the built page in light and dark (`colorScheme`) and with JavaScript off. Text looked up with `t`.
- [x] The Android build still writes no `privacy.html` (`npm run build:android`).

**Out of scope:** new privacy text; the УК/EN or sun/moon switches on `privacy.html`.
