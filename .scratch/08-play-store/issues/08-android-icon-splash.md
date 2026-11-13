# 08: Android icon and splash

Covers: P1

**What to build:** the launcher icon and splash screen come from `public/favicon.svg`, like the PWA icons.

**Blocked by:** 07

**Status:** done

- [x] Adaptive icon (foreground and background layers) and splash from `favicon.svg` via `@capacitor/assets` or a script; a `generate-android-assets` npm script next to `generate-pwa-assets`
- [x] Looks right as a circle, a squircle and a square mask; splash background is the theme colour (checked on rendered PNGs; on a device: ticket 10)
- [x] 512×512 store icon (32-bit PNG) written to `docs/store/icon-512.png`
