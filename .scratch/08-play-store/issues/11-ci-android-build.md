# 11: CI builds a signed app bundle

Covers: P7

**What to build:** `.github/workflows/android.yml` builds a signed `.aab` on each app-changing merge to `main`.

**Blocked by:** 07, 10

**Status:** done

- [x] Trigger: push to `main` with the spec's path filter plus `android/**`, `capacitor.config.ts`, its own file; `workflow_dispatch`
- [x] Node 24, JDK 21, Android SDK 36; `npm ci`, `npm run build:android`, permission check from ticket 10, Gradle `bundleRelease`
- [x] Keystore from `ANDROID_KEYSTORE_BASE64` and the other three secrets; `VERSION_CODE = github.run_number`
- [x] The `.aab` kept as a workflow artifact (14 days) so the first upload can be done by hand from it
- [x] If the secrets are missing, the job builds unsigned and says so instead of failing
- [ ] First run on GitHub after the merge to `main` (author: check the Actions run and download the artifact)

Rehearsed locally (macOS, JDK 21, SDK 36): `npm ci`, `npm run build:android`, `./gradlew bundleRelease`, `npm run check:android`. With no secrets the bundle is unsigned; a throwaway key passed through the workflow's own "Upload key" step gives a signed one (`jar verified`). `actionlint` (with shellcheck) and `yaml valid` pass. If only some of the four key secrets are set, the job fails on purpose, since that is a typo rather than a fresh repo. Ticket 12 adds its upload at the marked spot at the end of the job.
