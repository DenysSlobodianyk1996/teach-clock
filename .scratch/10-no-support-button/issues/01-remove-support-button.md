# 01: Remove the Support Button

**Blocked by:** none
**Status:** done

**What to build:** the Footer holds only Privacy and Contact, in both builds. No heart, no donation link, no `VITE_SUPPORT_URL`. Undoes batch 08's tickets 05 and 06.

- [x] Delete `SupportButton.vue`, its unit test and `e2e/support-button.spec.ts`.
- [x] `AppFooter.vue`: no Support Button, plain centred links.
- [x] `src/platform.ts` and `env.d.ts`: only `VITE_TARGET` / `isAndroidApp`; tests updated.
- [x] i18n: drop `support.*` in `uk` and `en`.
- [x] `deploy.yml`: no `VITE_SUPPORT_URL` from repo variables. Delete the repo variable itself (`gh variable delete VITE_SUPPORT_URL`).
- [x] `scripts/release-wizard.sh`: no support-link step.
- [x] Docs: product brief, glossary (no Support Button term), ADR 0004, CLAUDE.md, android-release, android-checks, store listings (no donation or payment wording).
- [x] Design: drop the `Support*.dc.html` boards, their gallery row and the `.support`/`.hold` styles in `theme.css`.

Kept on purpose: the US$25 Google Play developer fee in `docs/android-release.md` and the wizard. It is what publishing costs, not a payment in the app.
