# 07: Capacitor Android project

Covers: P2

**What to build:** the Android App builds and runs: Capacitor with the packaged game, API 36, no service worker. See the spec, Android App, and `docs/android-release.md` §2.

**Blocked by:** 01

**Status:** todo

- [ ] `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/app`; `capacitor.config.ts` (`appId: 'app.teachclockforkids'`, `appName: 'Вчимо годинник'`, `webDir: 'dist'`)
- [ ] `android/` committed (build outputs ignored); compile and target SDK 36; JDK 21
- [ ] `vite.config.ts`: VitePWA left out when `VITE_TARGET=android`; `src/pwa.ts` registration skipped in the Android App
- [ ] Scripts: `build:android` (`VITE_TARGET=android vite build && cap sync android`)
- [ ] Release signing in `android/app/build.gradle` reads keystore path, passwords and alias from env vars; with none set, the release build still works unsigned for local checks
- [ ] `versionName` from `package.json`, `versionCode` from env `VERSION_CODE` (default 1)
- [ ] Privacy and mailto links open outside the WebView
- [ ] Runs on an emulator: all four Games, both Modes, theme and language switch, the name is remembered after a restart
- [ ] `docs/android-release.md` §2 commands match the real scripts
