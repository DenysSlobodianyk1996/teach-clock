# 03: Sync design and docs with the app

Covers: P1–P4 (closing step for the batch)

**What to build:** once tickets 01–02 are done, the design and docs describe what the app now does. The app is the reference, so change the docs, not the code.

- Local design boards: `docs/design/project/*`. Every Teach wrong-answer board shows the one popup with two buttons; no Hint panel under the clock, no pill or lightbulb above the face.
- Online design canvas: republish from `docs/design` (root `docs/design`, files `project/*`) to https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu
- `docs/product-brief.md` (the Teach section, and the phone rule in lines 141–146: the clock never moves), `GLOSSARY.md` (Hint reworded, Place-It button retired, Teach), the `CLAUDE.md` status line, and `.scratch/README.md` (batch status: done, PRs)

**Blocked by:** 01, 02

**Status:** done

- [x] Boards match the app in all three themes, desktop and phone
- [x] Every board string is in `src/i18n/uk.ts`
- [x] Screenshots of the changed screens compared with the running app
- [x] Online canvas republished
- [x] Product brief, glossary and CLAUDE.md updated; no "Place-It button" or Hint panel left in the docs except history (`.scratch/0[1-6]-*`, `docs/original/`)
- [x] `.scratch/README.md` marks 07-teach-popup done with its PRs
