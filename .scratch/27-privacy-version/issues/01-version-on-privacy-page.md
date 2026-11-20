# 01: The Privacy Page shows the app's version

**Blocked by:** none

**Status:** done

**What to build:** under the Privacy Page's "Updated" date, "Версія: 1.0.23" / "Version: 1.0.23", in the app screen and the static `privacy/index.html`, in the Web App and the Android App. One rule for every build, `scripts/appVersion.ts`: package.json's major.minor and `VERSION_CODE` as the patch, the same as Google Play's versionName (batch 26). The Android workflow sets `VERSION_CODE` to its run number; the Pages deploy sets it to the Android push run of the same commit, or the latest Android run when there is none. A local build shows package.json's version.

**Checklist:**

- [x] `scripts/appVersion.ts` with its test; `vite.config.ts` sets `VITE_APP_VERSION`; `src/privacy.ts` exposes `APP_VERSION`.
- [x] `PrivacyContent.vue` shows it; `privacy.version` in `uk` and `en`.
- [x] Tests: the app screen and the static page show it in both languages; `APP_VERSION` follows `VERSION_CODE` (checked with and without it; a `VERSION_CODE=23` build prints 1.0.23 in `privacy/index.html`).
- [x] `deploy.yml`: the Version step (`actions: read`); its `gh run list` query checked against the batch 26 merge (run 22).
- [x] Docs synced: product brief, `docs/android-release.md`, `docs/design/project/Privacy.dc.html`, this batch's row. The online design canvas is left to the author, as in batch 25.

**Out of scope:** the Footer (the first ask, dropped); a production release from Run workflow gets a new Android run number, while the Web App keeps the closed-test one until its next deploy.
