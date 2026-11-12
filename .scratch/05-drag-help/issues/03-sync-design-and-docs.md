# 03: Sync design and docs with the app

Covers: C1–C2 (closing step for the batch)

**What to build:** once tickets 01 and 02 are done, the design and docs describe what the app now does. The app is the reference, so change the docs, not the code. This is the same approach as 04-clear-hands ticket 03. Tickets 01 and 02 update their own boards; this ticket checks every board against the app and fills any gaps.

- Local design boards: `docs/design/project/*`. Dragging shows orange free slots. The Teach Hint has the Place-It button. A placed slot flashes green.
- Online design canvas: republish from `docs/design` (root `docs/design`, files `project/*`) to https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu
- `docs/product-brief.md` (Teach rules for Drag Numbers), `GLOSSARY.md` (new term **Place-It button**: "In Teach, the button beside a Hint that puts the number on its right place for the Player." _Avoid_: auto-place, solve), and `.scratch/README.md` (batch status: done, PRs)

**Blocked by:** 01, 02

**Status:** todo

- [ ] Boards match the app: orange slots while dragging, the Place-It button beside the Hint, the green flash
- [ ] Screenshots of the changed screens compared with the running app, desktop and phone
- [ ] Online canvas republished from the updated boards
- [ ] Glossary has the Place-It button; the product brief says what it does and that the number counts as helped
- [ ] `.scratch/README.md` marks 05-drag-help done with its PRs
