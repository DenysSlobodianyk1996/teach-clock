# 02: Privacy Page names the author, no website link

**Blocked by:** none
**Status:** done

**What to build:** the Privacy Page (app screen and the static `privacy.html`) drops the "Web version of the game" link and gains a line with the author: "Створив Денис Слободяник" / "Created by Denys Slobodianyk", above the date.

- [x] i18n: `privacy.webVersion` replaced by `privacy.createdBy` in `uk` and `en`.
- [x] `PrivacyView.vue` and `src/privacy.ts`: no website link; author line before "Updated". `WEB_APP_URL` removed from `src/config.ts`.
- [x] `PRIVACY_UPDATED` bumped to 2026-11-14.
- [x] Unit and e2e tests: the author line shows in both languages; the email (and, on the static page, the way back) are the only links.
- [x] Product brief and `docs/android-checks.md` follow.
- [x] Design: new `Privacy.dc.html` board in the first row of the gallery and `canvas.json`; every board's Footer Privacy link opens it.
