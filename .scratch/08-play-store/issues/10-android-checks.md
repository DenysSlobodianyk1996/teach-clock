# 10: Android checks

Covers: P2, P3, P6

**What to build:** proof the Android App is fit for review: Families-safe permissions, offline first launch, no Support Button.

**Blocked by:** 06, 07, 08, 09

**Status:** todo

- [ ] A script (`npm run check:android` or a Gradle task) reads the merged manifest and fails if `ACCESS_*_LOCATION` or `com.google.android.gms.permission.AD_ID` appear; run it in CI (ticket 11)
- [ ] Manual check, recorded in the PR: fresh install in airplane mode, first launch plays a full Round in each Game
- [ ] No Support Button anywhere in the Android App; Footer Privacy and Contact open outside the app
- [ ] Back button through every screen as ticket 09 says
- [ ] No crash or white screen on rotate, background and resume
