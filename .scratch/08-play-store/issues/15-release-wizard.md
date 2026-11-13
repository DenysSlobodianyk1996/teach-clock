# 15: Release wizard for the human steps

Covers: P1, P7

**What to build:** a `/wizard` script that walks the author through every step only they can do, following `docs/android-release.md`.

**Blocked by:** 03, 11, 13

**Status:** todo

- [ ] Steps: developer account and $25, ID and phone checks; JDK 21 and SDK 36; upload key (`keytool`) and the four signing secrets; Create app and every App content answer; first manual upload of the CI artifact; closed test, Google Group, opt-in link; prints the testers' message with the links filled in
- [ ] Service account: Cloud project, enable the API, JSON key, invite in Play Console, `gh secret set PLAY_SERVICE_ACCOUNT_JSON`, delete the file
- [ ] `gh variable set VITE_SUPPORT_URL` with the author's monobank link
- [ ] Reminders: day 14 "Apply for production"; after the first production release, Teacher Approved opt-in
- [ ] Re-runnable: skips steps already done (checks existing secrets and variables)
- [ ] `docs/android-release.md` corrected wherever the real console differs
