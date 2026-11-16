# 01: The Privacy Page at /privacy-policy, and no route matches a built file

**Blocked by:** none

**Status:** todo

**What to build:** the in-app Privacy Page moves from `/privacy` to `/privacy-policy`, so on GitHub Pages a reload (F5) opens the app again instead of the static `privacy.html`, and Back after a reload returns to Welcome (`images/01-in-app-before-reload.png`, `images/01-after-reload.png`). A test makes sure no app route ever matches a file the build writes again.

**Checklist:**

- [ ] Guard first (red today): a Vitest test that takes every route path from `createAppRouter()` and every file the Web App build writes at the site root (`privacy.html`, `404.html`, `index.html`, the files in `public/`), and fails when a path, with or without `.html`, names one of them.
- [ ] `src/router/index.ts`: path `/privacy-policy`, name `privacy` unchanged, so `RouterLink`s and the Android back button need no change.
- [ ] Tests that open `/privacy` move to `/privacy-policy`: `AppFooter.spec.ts`, `PrivacyView.spec.ts`, `src/android/__tests__/backButton.spec.ts`, `e2e/privacy.spec.ts`, `e2e/offline.spec.ts`.
- [ ] Playwright: on a production build, open the Privacy Page from the Footer, reload, see the app screen (the УК/EN switch is there), go Back, see Welcome. Text looked up with `t`.

**Out of scope:** how `privacy.html` is made (ticket 02); a redirect from the old `/privacy` (not wanted: it lands on `privacy.html`).
