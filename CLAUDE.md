# Teach Clock

Game that teaches children to read and set an analogue clock: a Web App (offline PWA on GitHub Pages) and an Android App (Capacitor, Google Play), one codebase.
Rebuild of a 2019 master's-thesis project ("Time Teacher") as an HTML5 game.

## Status

Design approved (ticket 01). App skeleton in place (ticket 02). All four Games playable in Test and Teach (tickets 03–08, Drag Minutes in batch 06), full Summary (ticket 09), English and themes (ticket 10), offline and installable (ticket 11), one two-button wrong-answer popup in Teach for every Game (batch 07), Android App on Google Play with a Footer and Privacy Page (batch 08), Privacy Page as an app screen (batch 09), Footer with Privacy and Contact only and the author on the Privacy Page (batch 10), two themes (light, dark) with a sun/moon toggle (batch 11), one Privacy Page at `/privacy-policy` with `privacy.html` rendered from it (batch 12), one Game Name per language that follows the device (batch 13), Drag Hours in 1–12 or 13–24 (batch 14), right numbers green on a face in the drag Games' Teach Summary (batch 15), the Filled Clock behind an eye in the drag Games' Teach (batch 16), drops that never vanish (batch 17), store art redrawn after batch 16 (batch 18), every screen fitting a 360 × 640 phone with Info Popups and a cream app icon (batch 19): Welcome → Settings → Round → Summary. Stack: Vue 3 + Vite + TypeScript + SVG (see `docs/tech-stack.md`).
Work is tracked in batches under `.scratch/NN-<outcome>/`: `.scratch/README.md` lists every batch with its status and PRs, and sets the naming and file rules. Last done: `19-small-screen-phone` (on a phone, Welcome, Settings and every Round fit a 360 × 640 screen with nothing scrolled: Welcome's intro and the Settings cards' descriptions are behind an ⓘ that opens an Info Popup, the Settings cards are compact, a Round's clock takes the height left; the app icon is the clock on the face's cream, no dark tile; the store screenshots are retaken on the phone layout at every size). Before it, `18-store-shots` (the store screenshots, feature graphic and listings checked and redone after batch 16; the feature graphic moved to the light theme's tokens). Before it, `17-drag-drops-hold` (a second finger no longer steals a drag; in Teach a drop on a filled slot is a wrong drop with the popup, not a silent jump back; a desktop jump back that did not reproduce is noted in its `request.md`). Before it, `16-filled-clock` (in Teach, Drag Hours and Drag Minutes have an eye by the heading that opens the Filled Clock: a read-only popup with the Round's face, every number yellow on its slot, one Got it button, nothing in the Round changes). Before it, `15-drag-hours-minutes-summary-fix` (in Teach, the Правильно card of a Drag Hours or Drag Minutes Summary is one face with the right numbers green on their slots and the helped ones' slots empty, no chips, no caption). Before it, `14-hours-13-24` (Drag Hours has **Hours** in Settings: 1–12, or 13–24 with 24 at the top and the Hour Badges, as "перша / друга половина доби", no AM/PM; Drag Arrows and Set Time with 24-hour times are noted in its `request.md` as later work). Before it, `13-app-name` (the Game Name is "Teach Clock" / "Вчимо годинник" everywhere, never shortened; the interface language follows the device until the Player taps УК/EN, the Android App's name follows the phone's languages, an installed Web App keeps the name in the interface language at install time; English is Play's default listing, ADR 0005). Before it, `12-privacy-one-page` (the Privacy Page moved to `/privacy-policy` so a reload never lands on `privacy.html`; the build renders `privacy.html` from the same Vue component via `scripts/buildPrivacyPage.ts`, Ukrainian then English, no JavaScript; a test keeps app routes off the files the build writes). Then `11-theme-switch` (two themes, light and dark, the device's choice until the Player taps the sun/moon toggle in the header; the middle theme is gone). Before that, `10-footer-and-privacy` (the Footer is Privacy and Contact only; the Privacy Page names the author and links only the contact email). Then `09-privacy-in-app` (the Privacy Page became a Vue screen in both builds). Before that, `08-play-store` (Capacitor Android App with back button, icons and store art; CI builds a signed bundle and uploads it to Play closed testing; Footer on Welcome and Settings; `src/platform.ts` is the one place that tells the two builds apart).

## Commands

- `npm run dev`: dev server on http://localhost:4200
- Push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`, `GITHUB_PAGES=1` sets base `/teach-clock/`): https://denysslobodianyk1996.github.io/teach-clock/
- `npm run type-check`, `npm run lint`, `npm run format`
- `npx vitest run [file]`: unit and component tests
- `npx playwright test`: browser flows (desktop + phone, plus an offline check on a fresh build)
- `npm run build`: type-check and build (with the offline service worker)
- `npm run generate-pwa-assets`: redraw the app icons in `public/` from `public/favicon.svg`
- Android (Gradle needs `ANDROID_HOME=~/Library/Android/sdk` and `JAVA_HOME=/opt/homebrew/opt/openjdk@21`):
  - `npm run build:android`: Android build into `dist/` and `cap sync`; rerun before every Gradle build (`cd android && ./gradlew assembleDebug|bundleRelease`)
  - `npm run build:apk`: `build:android` then `assembleDebug` (fills in `ANDROID_HOME`/`JAVA_HOME` if unset); the APK to sideload is `android/app/build/outputs/apk/debug/app-debug.apk`
  - `npm run check:android`: after `bundleRelease`, fails on location or `AD_ID` permissions
  - `npm run generate-android-assets`: launcher icons, splash and `docs/store/icon-512.png` from `public/favicon.svg`
  - `PW_PORT=<port> npm run store-shots`: Play screenshots and feature graphic into `docs/store/`; rerun after UI or text changes
  - `bash scripts/release-wizard.sh [--dry-run]`: walks the author through the Play Console steps only a person can do
- Push to `main` that changes the app also uploads a signed bundle to Play closed testing (`.github/workflows/android.yml`); production is its Run workflow button

## Where things are

- `GLOSSARY.md` — the project's terms (Player, Game, Mode, Level, Round, Task, Hint, Summary…). Use them in code and docs.
- `docs/product-brief.md` — screens, the four Games, Teach/Test rules, look. Read this first.
- `docs/tech-stack.md` — libraries and what was rejected.
- `docs/adr/` — decisions that are hard to reverse.
- `src/game/` — game rules, plain TypeScript (no Vue). `src/stores/` — Pinia. `src/i18n/` — interface text (every ticket from 03 adds `en` next to `uk`).
- `docs/android-release.md` — publishing on Google Play step by step (account, keys, secrets, Play Console, testers, releases); `docs/android-checks.md` — the device checklist.
- `docs/store/` — Play listing text (`listing.uk.md`, `listing.en.md`, with character counts), screenshots, feature graphic, icon, closed-test tracker.
- `src/platform.ts` — `isAndroidApp`; components read the build target only from here.
- `docs/design/` — ticket 01 design prototype: open `gallery.html` locally; `project/theme.css` has the theme tokens.
- `docs/original/` — the 2019 thesis (PDF), deck (PPTX) and screenshots, in Ukrainian. Large; prefer the brief.

## Rules

- Use the 2019 docs only for game mechanics. Their stack (ASP.NET Core, Angular, MySQL), code, palette and images are not a reference.
- No accounts, no stored results, no backend (ADR 0002). Only Preferences and the last name live in `localStorage`.
- Keep clock maths in plain TypeScript, separate from Vue and SVG (ADR 0001).
- Art must be original SVG.
- Tests never hardcode interface text: look it up by key with `t` from `src/test/i18n.ts` (Vitest) or `e2e/i18n.ts` (Playwright). Player names and other test data stay literal.
