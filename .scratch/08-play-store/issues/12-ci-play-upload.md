# 12: CI uploads to closed testing; manual production release

Covers: P7

**What to build:** each merge's `.aab` goes to Play closed testing; production is a "Run workflow" button with release notes.

**Blocked by:** 11

**Status:** todo

- [ ] Upload with a maintained action (for example `r0adkll/upload-google-play`), package `vars.ANDROID_PACKAGE_ID`, service account `PLAY_SERVICE_ACCOUNT_JSON`
- [ ] Push to `main`: track `alpha` (closed testing), release notes uk "Покращення та виправлення", en "Improvements and fixes"
- [ ] `workflow_dispatch` with inputs `notes_uk`, `notes_en`: release to `production` (promote the latest closed build if the action supports it cleanly, otherwise build and upload)
- [ ] Upload step skipped with a clear message while `PLAY_SERVICE_ACCOUNT_JSON` is not set (before the first manual upload)
- [ ] Release-notes files written per locale in the job (`uk-UA`, `en-US`), not committed
