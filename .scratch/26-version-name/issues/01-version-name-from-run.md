# 01: Every Play upload has its own version name

**Blocked by:** none

**Status:** done

**What to build:** the Android App's versionName is MAJOR.MINOR from `package.json`'s `version` and the CI run number (`VERSION_CODE`, already the versionCode) as the patch, so run 22 of `1.0.0` shows as 1.0.22 in Play and the phone's app info. Major and minor are raised by hand for a big change. A local build without `VERSION_CODE` keeps `package.json`'s version.

**Checklist:**

- [x] `android/app/build.gradle` builds the versionName from `package.json` and `VERSION_CODE`.
- [x] Checked with Gradle: `VERSION_CODE=22` gives name 1.0.22, code 22; unset gives 1.0.0, code 1.
- [x] `docs/android-release.md` says how the versionName is made.
- [x] Docs synced: this batch's row in `.scratch/README.md`; no screen, design board or brief changes.

**Out of scope:** showing the version in the app; the Web App's version.
