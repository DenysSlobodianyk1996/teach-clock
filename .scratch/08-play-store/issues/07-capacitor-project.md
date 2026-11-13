# 07: Capacitor Android project

Covers: P2

**What to build:** the Android App builds and runs: Capacitor with the packaged game, API 36, no service worker. See the spec, Android App, and `docs/android-release.md` §2.

**Blocked by:** 01

**Status:** done

- [x] `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/app`; `capacitor.config.ts` (`appId: 'app.teachclockforkids'`, `appName: 'Вчимо годинник'`, `webDir: 'dist'`)
- [x] `android/` committed (build outputs ignored); compile and target SDK 36; JDK 21
- [x] `vite.config.ts`: VitePWA left out when `VITE_TARGET=android`; `src/pwa.ts` registration skipped in the Android App
- [x] Scripts: `build:android` (`VITE_TARGET=android vite build && cap sync android`)
- [x] Release signing in `android/app/build.gradle` reads keystore path, passwords and alias from env vars; with none set, the release build still works unsigned for local checks
- [x] `versionName` from `package.json`, `versionCode` from env `VERSION_CODE` (default 1)
- [x] Privacy and mailto links open outside the WebView (Capacitor does this by default: an `https` link, `target="_blank"`, `window.open` and `mailto:` all left the app on the emulator; no code needed)
- [x] Runs on an emulator: all four Games, both Modes, theme and language switch, the name is remembered after a restart (API 36 emulator, driven through the WebView with Playwright: every Game × Mode reached its Summary)
- [x] `docs/android-release.md` §2 commands match the real scripts
