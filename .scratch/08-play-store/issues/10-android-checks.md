# 10: Android checks

Covers: P2, P3

**What to build:** proof the Android App is fit for review: Families-safe permissions, offline first launch.

**Blocked by:** 07, 08, 09

**Status:** done

- [x] A script (`npm run check:android` or a Gradle task) reads the merged manifest and fails if `ACCESS_*_LOCATION` or `com.google.android.gms.permission.AD_ID` appear; run it in CI (ticket 11) — `npm run check:android` after `./gradlew bundleRelease`; wiring into CI is ticket 11
- [x] Manual check, recorded in the PR: fresh install in airplane mode, first launch plays a full Round in each Game — emulator, see `docs/android-checks.md`; a real phone is still worth a look (author: OEM icon masks)
- [x] Footer Privacy and Contact open outside the app
- [x] Back button through every screen as ticket 09 says
- [x] No crash or white screen on rotate, background and resume
