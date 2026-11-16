# 01: A drop on the board never vanishes

**Blocked by:** none

**Status:** done

**What to build:** decisions 1 and 2 in `request.md`.

**Checklist:**

- [x] Tests first: `NumberBoard.spec.ts` (a second finger keeps the drag; a taken slot rings and takes
      the drop) and `dragNumbers.spec.ts` (a filled slot in Teach is a wrong drop with the hint).
- [x] `NumberBoard.vue`: `press` ignores a non-primary pointer while a drag is held; `takes` is any slot
      but the number's own, in both Modes.
- [x] `dragNumbers.ts`: `dropNumber` in Teach counts a filled slot as wrong; `setCorrectNumber` still
      leaves a taken right slot alone.
- [x] Playwright `e2e/drag-drops-hold.spec.ts`: a filled-slot drop opens the popup; a second finger on
      another tile leaves the dragged one on its slot (touch, `e2e/numbers.ts` `touchDragNumber`).
      Both fail on the old code.

**Out of scope:** tapping a filled slot after picking a tile in Teach (placed numbers there are not
buttons); the desktop jump back that did not reproduce.
