# 04: Google Play link behind a flag

**What to build:** Once the Android App is in production, Welcome in the Web App shows a translated
"Get it on Google Play" link to its listing, and the JSON-LD adds the app as a `MobileApplication`.
Until a flag is turned on, neither appears. Decision 7 in `request.md`.

**Blocked by:** 02 Prerendered English Welcome, 03 Structured data, robots.txt, privacy canonical, Search Console tag

**Status:** done

- [x] `GOOGLE_PLAY_URL` from the app id and `GOOGLE_PLAY_LIVE = false` in `src/config.ts`; a test
      keeps the URL on `capacitor.config.ts`'s app id
- [x] `welcome.googlePlay` in all six locales (Google's badge wording in each language)
- [x] Welcome shows the link only when live and not in the Android App; tests for off, on, and Android
      (`src/views/__tests__/WelcomeGooglePlay.spec.ts`)
- [x] The JSON-LD adds a `MobileApplication` (`operatingSystem` `Android`) when live; tests for both
- [x] The turn-on step in `docs/android-release.md`'s production release (step 14), with the checks
      to run then: the small-phone fit, store screenshots, the Welcome boards
      Note: the 360 × 640 fit with the link shown is not checked yet; it is part of the turn-on step.
