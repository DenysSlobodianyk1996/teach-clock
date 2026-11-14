# 03: Icons and splash on the dark background

**Blocked by:** none

**Status:** todo

**What to build:** the icons a Player installs (PWA, Apple, Android launcher) and the Play listing icon sit on the middle theme's teal (`#1d4b5c`), which no longer exists after 01. They move to the dark theme's background (`#121a24`, `--bg` under `[data-theme='dark']`). The Android splash uses the same colour, so it moves too. The clock mark itself (`public/favicon.svg`) doesn't change.

From the author, 2026-11-14: "also check current icon for downloading. if it has middle theme on bg - change to dark one".

**Checklist:**

- [ ] `pwa-assets.config.ts`: background is the dark `--bg`; rerun `npm run generate-pwa-assets` (maskable and Apple icons in `public/`).
- [ ] `scripts/generate-android-assets.ts`: `THEME_COLOR` is the dark `--bg` (comment names the dark theme); rerun `npm run generate-android-assets` (launcher icons, `ic_launcher_background.xml`, splash, `docs/store/icon-512.png`). `scripts/__tests__/android-assets.test.ts` still passes.
- [ ] Look at the regenerated icons: the clock reads clearly on the dark background at 48 px and in the round mask.

**Out of scope:** the store feature graphic and screenshots (ticket 02 reruns them); the browser bar colour (ticket 01).
