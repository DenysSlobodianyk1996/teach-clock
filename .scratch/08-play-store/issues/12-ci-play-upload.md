# 12: CI uploads to closed testing; manual production release

Covers: P7

**What to build:** each merge's `.aab` goes to Play closed testing; production is a "Run workflow" button with release notes.

**Blocked by:** 11

**Status:** done

- [x] Upload with a maintained action (for example `r0adkll/upload-google-play`), package `vars.ANDROID_PACKAGE_ID`, service account `PLAY_SERVICE_ACCOUNT_JSON` (`r0adkll/upload-google-play@v1`, v1 = v1.1.5, April 2026)
- [x] Push to `main`: track `alpha` (closed testing), release notes uk "Покращення та виправлення", en "Improvements and fixes"
- [x] `workflow_dispatch` with inputs `notes_uk`, `notes_en`: release to `production` (promote the latest closed build if the action supports it cleanly, otherwise build and upload) (the action only uploads, so the run builds from `main` and uploads to production; runs on other branches fail)
- [x] Upload step skipped with a clear message while `PLAY_SERVICE_ACCOUNT_JSON` is not set (before the first manual upload)
- [x] Release-notes files written per locale in the job (`uk-UA`, `en-US`), not committed
- [ ] First real upload through CI (author: needs the app in Play Console, `PLAY_SERVICE_ACCOUNT_JSON` and `ANDROID_PACKAGE_ID`)
