# 04: Sync design and docs with the app

Covers: D1–D4 (closing step for the batch)

**What to build:** once tickets 01–03 are done, the design and docs describe what the app now does. The app is the reference, so change the docs, not the code. This is the same approach as 04-clear-hands ticket 03. Each ticket updates its own boards; this ticket checks every board against the app and fills any gaps.

- Local design boards: `docs/design/project/*`. They say Drag Hours instead of Drag Numbers, Settings has four Games, and there are Drag Minutes boards for Teach, Test and the Summary, with Hour Badges, on desktop and phone.
- Online design canvas: republish from `docs/design` (root `docs/design`, files `project/*`) to https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu
- `docs/product-brief.md` (Settings, the Games table, the Teach and Test rules), `GLOSSARY.md` (see the spec's Further Notes: Drag Hours, Drag Minutes, Hour Badge, and Game, Level and Round updated), `CLAUDE.md` status line, and `.scratch/README.md` (batch status: done, PRs)

**Blocked by:** 01, 02, 03

**Status:** todo

- [ ] Boards match the app in all three themes: the new names, four Games, Drag Minutes in both Modes, Hour Badges, the Summary
- [ ] Every board string is in `src/i18n/uk.ts`
- [ ] Screenshots of the changed screens compared with the running app, desktop and phone
- [ ] Online canvas republished from the updated boards
- [ ] Product brief, glossary and CLAUDE.md updated; no "Drag Numbers" left in the docs except history (`.scratch/0[1-5]-*`, `docs/original/`)
- [ ] `.scratch/README.md` marks 06-drag-minutes done with its PRs
