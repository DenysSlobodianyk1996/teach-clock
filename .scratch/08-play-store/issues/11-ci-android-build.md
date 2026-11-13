# 11: CI builds a signed app bundle

Covers: P7

**What to build:** `.github/workflows/android.yml` builds a signed `.aab` on each app-changing merge to `main`.

**Blocked by:** 07, 10

**Status:** todo

- [ ] Trigger: push to `main` with the spec's path filter plus `android/**`, `capacitor.config.ts`, its own file; `workflow_dispatch`
- [ ] Node 24, JDK 21, Android SDK 36; `npm ci`, `npm run build:android`, permission check from ticket 10, Gradle `bundleRelease`
- [ ] Keystore from `ANDROID_KEYSTORE_BASE64` and the other three secrets; `VERSION_CODE = github.run_number`
- [ ] The `.aab` kept as a workflow artifact (14 days) so the first upload can be done by hand from it
- [ ] If the secrets are missing, the job builds unsigned and says so instead of failing
