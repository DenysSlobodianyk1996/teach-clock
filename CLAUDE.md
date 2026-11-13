# Teach Clock

Game that teaches children to read and set an analogue clock: a Web App (offline PWA on GitHub Pages) and an Android App (Capacitor, Google Play), one codebase.
Rebuild of a 2019 master's-thesis project ("Time Teacher") as an HTML5 game.

## Status

Design approved (ticket 01). App skeleton in place (ticket 02). All four Games playable in Test and Teach (tickets 03–08, Drag Minutes in batch 06), full Summary (ticket 09), English and themes (ticket 10), offline and installable (ticket 11), one two-button wrong-answer popup in Teach for every Game (batch 07), Android App on Google Play with a Footer, Privacy Page and Web-only Support Button (batch 08), Privacy Page as an app screen (batch 09): Welcome → Settings → Round → Summary. Stack: Vue 3 + Vite + TypeScript + SVG (see `docs/tech-stack.md`).
Work is tracked in batches under `.scratch/NN-<outcome>/`: `.scratch/README.md` lists every batch with its status and PRs, and sets the naming and file rules. Last done: `09-privacy-in-app` (the Privacy Page is a Vue screen at `/privacy` in both builds; `src/privacy.ts` writes the static `privacy.html` for Play from the same i18n text). Before it, `08-play-store` (Capacitor Android App with back button, icons and store art; CI builds a signed bundle and uploads it to Play closed testing; Footer on Welcome and Settings; `src/platform.ts` is the one place that tells the two builds apart).

## Commands

- `npm run dev`: dev server on http://localhost:4200
- Push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`, `GITHUB_PAGES=1` sets base `/teach-clock/`): https://denysslobodianyk1996.github.io/teach-clock/
- `npm run type-check`, `npm run lint`, `npm run format`
- `npx vitest run [file]`: unit and component tests
- `npx playwright test`: browser flows (desktop + phone, plus an offline check on a fresh build)
- `npm run build`: type-check and build (with the offline service worker)
- `npm run generate-pwa-assets`: redraw the app icons in `public/` from `public/favicon.svg`
- `VITE_SUPPORT_URL=https://… npm run dev`: shows the Support Button (hidden without an `https://` link)
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
- `src/platform.ts` — `isAndroidApp` and `supportUrl`; components read the build target only from here.
- `docs/design/` — ticket 01 design prototype: open `gallery.html` locally; `project/theme.css` has the theme tokens.
- `docs/original/` — the 2019 thesis (PDF), deck (PPTX) and screenshots, in Ukrainian. Large; prefer the brief.

## Rules

- Use the 2019 docs only for game mechanics. Their stack (ASP.NET Core, Angular, MySQL), code, palette and images are not a reference.
- No accounts, no stored results, no backend (ADR 0002). Only Preferences and the last name live in `localStorage`.
- Keep clock maths in plain TypeScript, separate from Vue and SVG (ADR 0001).
- Art must be original SVG.
- Tests never hardcode interface text: look it up by key with `t` from `src/test/i18n.ts` (Vitest) or `e2e/i18n.ts` (Playwright). Player names and other test data stay literal.
