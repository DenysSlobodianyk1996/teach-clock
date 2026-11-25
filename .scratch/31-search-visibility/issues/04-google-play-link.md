# 04: Google Play link behind a flag

**What to build:** Once the Android App is in production, Welcome in the Web App shows a translated
"Get it on Google Play" link to its listing, and the JSON-LD adds the app as a `MobileApplication`.
Until a flag is turned on, neither appears. Decision 7 in `request.md`.

**Blocked by:** 02 Prerendered English Welcome, 03 Structured data, robots.txt, privacy canonical, Search Console tag

**Status:** todo

- [ ] `GOOGLE_PLAY_URL` from the app id and `GOOGLE_PLAY_LIVE = false` in `src/config.ts`; a test
      keeps the URL on `capacitor.config.ts`'s app id
- [ ] `welcome.googlePlay` in all six locales
- [ ] Welcome shows the link only when live and not in the Android App; tests for off, on, and Android
- [ ] The JSON-LD adds a `MobileApplication` (`operatingSystem` `Android`) when live; tests for both
- [ ] The turn-on step in `docs/android-release.md`'s production release
