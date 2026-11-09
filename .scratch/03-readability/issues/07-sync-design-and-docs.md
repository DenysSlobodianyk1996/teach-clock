# 07: Sync design and docs with the app

Covers: A1–A7 (closing step for the batch)

**What to build:** once tickets 01–06 are done, the design and docs say what the app now does. The app is the reference: change the docs, not the code. Same approach as #19.

- Local design boards: `docs/design/project/*` (text against `src/i18n/uk.ts`, theme tokens against `src/styles/theme.css`, layout against screenshots of the running app)
- Online design canvas: republish from `docs/design` (root `docs/design`, files `project/*`) to https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu
- `docs/product-brief.md`, `GLOSSARY.md` if a term changed, and `.scratch/README.md` (batch status: done, PRs)

**Blocked by:** 01, 02, 03, 04, 05, 06

**Status:** todo

- [ ] Boards show Drag Numbers as the default Game, the Mode icons, the phone layout up to 768px, the Set Time ranges, the lit tick and number, and the bigger Summary clocks
- [ ] Every board string is in `src/i18n/uk.ts`; theme tokens match the app in all three themes
- [ ] Screenshots of the changed screens compared with the running app, desktop and phone
- [ ] Online canvas republished from the updated boards
- [ ] Product brief updated; `.scratch/README.md` marks 03-readability done with its PRs
