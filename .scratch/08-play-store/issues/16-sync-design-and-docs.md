# 16: Sync design and docs with the app

Covers: P1–P7 (closing step for the batch)

**What to build:** once tickets 01–15 are done, the design and docs describe what the app now does. The app is the reference, so change the docs, not the code.

**Blocked by:** 01–15

**Status:** done

- [x] Local design boards (`docs/design/project/*`): Welcome and Settings show the Footer (with and without the Support Button), in all three themes, desktop and phone; every board string is in `src/i18n/uk.ts`
- [x] Online design canvas republished from `docs/design` to https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu
- [x] `docs/product-brief.md`: Web App and Android App, Footer, Privacy Page, Support Button (Web App only)
- [x] `docs/tech-stack.md`: Capacitor, and TWA under rejected
- [x] `CLAUDE.md`: status line, Android commands, `docs/android-release.md` under Where things are
- [x] `.scratch/README.md`: 08-play-store done with its PR; spec status done (PR #47 is the batch PR; author: open/merge it to `main`)

Notes: the Footer is on every Welcome and Settings board (without the Support Button); the new row "Футер з кнопкою підтримки" has six `Support*.dc.html` boards (middle, dark, light × desktop, phone). The phone boards grew taller to show the Footer below the fold. Follow-ups found during the batch are listed in the spec's "Follow-ups" section.
