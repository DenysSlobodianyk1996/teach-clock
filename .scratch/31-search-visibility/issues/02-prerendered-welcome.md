# 02: Prerendered English Welcome

**What to build:** The Pages build's `index.html` holds the English Welcome in `#app` before any
JavaScript: the Game Name, the `<h1>`, the intro, the name field and Start, the clock and the Footer,
in the app's frame and styles. The app mounts over it (no hydration). A pre-paint script hides it
where the app opens another screen. The Android App and the dev server have none. Decisions 4 and 5
in `request.md`.

**Blocked by:** 01 Description from the Play listing

**Status:** done

- [x] A server-side entry renders `WelcomeView` in `AppFrame`, `HeaderBar` (room for two round
      buttons) and `AppFooter`, always English, root `lang="en"` and `data-prerendered`
      (`src/welcomeStatic.ts`, `src/views/WelcomeStaticPage.vue`)
- [x] The SSR build shared with the Privacy Page (`scripts/ssrBuild.ts`), its CSS inlined after the
      app's stylesheet (`scripts/buildWelcomePage.ts`, `prerenderedWelcomePlugin` in `vite.config.ts`)
- [x] A pre-paint script in `<head>` and a CSS rule hide it unless the address is the site root
      (`src/static/prerenderedWelcome.ts`)
- [x] Exactly one `<h1>` in the built page
- [x] Vitest (`src/__tests__/prerenderedWelcome.spec.ts`): the built page has it with the English
      text looked up with `t`, one `<h1>`, `lang="en"`, the script; the Android build and a build for
      elsewhere have none; the script hides it off the root
- [x] Playwright (`e2e/link-preview.spec.ts`): the root shows it with the app's JavaScript blocked;
      `/teach-clock/settings`, `/teach-clock/privacy-policy` and `404.html` hide it; once the app
      mounts there is one `<h1>`
      Note: screenshots of the page with the app's JavaScript blocked and with the app, 1280 × 800
      and 360 × 720, are the same but for the header's two buttons.
