# 01: Rename Drag Numbers to Drag Hours, shared drag rules

Covers: D1

**What to build:** Drag Numbers is now called **Drag Hours** everywhere the Player sees it and in code (Game id `dragHours`). The code is also prepared for a second drag Game: add a `NumbersGame` type and `tileValue(game, n)`, and let the board and Summary face label tiles through it. Nothing changes for the Player except the name. See the spec, Implementation Decisions.

**Blocked by:** None (can start immediately; 05-drag-help must be merged first)

**Status:** done

- [x] Game id `dragNumbers` → `dragHours` in `src/game/`, `src/stores/`, `src/views/`, `src/i18n/` and every test and e2e spec; e2e files renamed (`drag-numbers-*.spec.ts` → `drag-hours-*.spec.ts`), and `DragNumbersRound.vue` renamed to fit
- [x] en "Drag Hours", uk "Розстав години"; descriptions unchanged
- [x] `NumbersGame = 'dragHours'` (widened in ticket 02), `ClockGame = Exclude<Game, NumbersGame>`, and `tileValue(game, n)` with tests
- [x] `NumberBoard` and `NumberFace` take their tile labels from `tileValue`; Hint text and aria labels use it too
- [x] `npm run type-check`, `npm run lint`, `npx vitest run` and `npx playwright test` all pass with no behaviour change
- [x] Design boards renamed or retitled to Drag Hours (`docs/design/project/*DragNumbers*`); ticket 04 does the final check
