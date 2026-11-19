# 01: Play's update screen when the Android App opens

**Blocked by:** none

**Status:** done (the check on a phone with two Play builds is left to the author: `docs/android-checks.md`)

**What to build:** when Google Play has a newer version, the Android App opens Play's own "Update available" screen (an immediate in-app update, `@capawesome/capacitor-app-update`), which downloads it and restarts the app.

**Checklist:**

- [x] Offered at start and each time the app comes back to the front (`resume`), on Welcome or Settings only, like the Web App's update (`src/pwa.ts`); never in a Round, on a Summary or the Privacy Page.
- [x] Once per start: after ✕, nothing until the app is started again.
- [x] An update Play had started and was cut off is finished.
- [x] Not installed from Play, offline, or Play refuses: nothing shows, no error, tried again on the next resume.
- [x] Only in the Android App: the Web App bundle has no trace of the plugin.
- [x] `npm run android:check` still passes (INTERNET only).
- [x] Tests: `src/android/__tests__/playUpdate.spec.ts`.
- [ ] Seen on a phone with a closed-testing install and a newer build.

**Out of scope:** an update button or banner of our own; a flexible (background) update.
