# 15: Release wizard for the human steps

Covers: P1, P7

**What to build:** a `/wizard` script that walks the author through every step only they can do, following `docs/android-release.md`.

**Blocked by:** 03, 11, 13

**Status:** done

`scripts/release-wizard.sh` (17 stages, `--dry-run` runs and changes nothing). `docs/android-release.md` is now a day-by-day timeline that maps each step to a wizard stage.

- [x] Steps: developer account and $25, ID and phone checks; JDK 21 and SDK 36; upload key (`keytool`) and the four signing secrets; Create app and every App content answer; first manual upload of the CI artifact; closed test, Google Group, opt-in link; prints the testers' message with the links filled in
- [x] Service account: Cloud project, enable the API, JSON key, invite in Play Console, `gh secret set PLAY_SERVICE_ACCOUNT_JSON`, delete the file
- [x] `gh variable set VITE_SUPPORT_URL` with the author's monobank link (author: run the wizard; the variable is still `unset`)
- [x] Key dates go into `docs/store/closed-test.md` (labels only, no names or emails; the repo is public)
- [x] Reminders: day 14 "Apply for production"; after the first production release, Teacher Approved opt-in
- [x] Re-runnable: skips steps already done (checks existing secrets and variables)
- [ ] `docs/android-release.md` corrected wherever the real console differs (author: only a real Play account shows the console; the guide now matches the repo's files, workflow and ticket 12's upload)
