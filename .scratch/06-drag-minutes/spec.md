---
title: Drag Minutes, and Drag Numbers becomes Drag Hours
status: planned
---

# Drag Minutes, and Drag Numbers becomes Drag Hours

Terms follow [`GLOSSARY.md`](../../GLOSSARY.md). Raw input: [`request.md`](request.md). This batch builds on [05-drag-help](../05-drag-help/), which must be merged first.

## Problem Statement

Drag Numbers teaches where the hours sit on the face. It does not teach the other half of reading a clock: each number also stands for minutes (the 1 is 5 minutes, the 6 is 30, the 12 is 60). Children learn that mapping by heart, and there is no Game that practises it.

## Solution

- Drag Numbers is renamed **Drag Hours**.
- A new Game, **Drag Minutes**, works the same way, but its tray holds 5, 10, … 55, 60, and the minute N×5 belongs on the slot of hour N (60 at the top).
- Each slot on the Drag Minutes face has a small **Hour Badge** (variant C, inner badges): the hour 1–12 in a soft circle on an inner ring, towards the centre from its slot. It shows the Player which hour place each minute goes beside.
- Both drag Games share one set of rules, one board and one Summary face. Each Game only says what value tile N shows.

## User Stories

### Settings

1. As a Player, I see four Games in this order: Drag Hours, Drag Minutes, Drag Arrows, Set Time.
2. As a Player, I see an original icon for Drag Minutes that sets it apart from Drag Hours.
3. As a Player picking Drag Minutes, I see no Level, the same as Drag Hours. Drag Hours in Teach stays the default.

### Drag Minutes

4. As a Player, I see an empty face with 12 slots, an Hour Badge 1–12 by each slot, and a shuffled tray of 5, 10, … 60.
5. As a Player, I drag (or tap, then tap) each minute onto its slot, with the same controls, sizes and orange slots as Drag Hours.
6. As a Player in Teach, a wrong drop sends the minute back to the tray with "10 goes between 5 and 15" (wrapping: "60 goes between 55 and 5", "5 goes between 60 and 10"). The Place-It button beside it puts the minute in its place, and it counts as helped.
7. As a Player in Test, I move minutes freely with no feedback. Submit appears when all 12 are on the face.
8. As a Player, the Hour Badges stay visible after a minute tile is placed, in Teach and in Test. They are part of the face, not a Hint.
9. As a Player, I see 12 progress dots, and the Round ends when all 12 are placed (Teach) or at Submit (Test).

### Summary

10. As a Player, the Summary of Drag Minutes looks like Drag Hours. In Teach it shows chips; in Test it shows my face next to the correct one. Both faces show the minute tiles and the Hour Badges.

### Drag Hours

11. As a Player, Drag Hours plays exactly as Drag Numbers did, under its new name: en "Drag Hours", uk "Розстав години".

## Implementation Decisions

- **Rename.** The Game id `dragNumbers` becomes `dragHours` everywhere: `src/game/settings.ts` (`GAMES`, `DEFAULT_SETTINGS`, `hasLevel`, `taskCount`), `round.ts`, `summary.ts`, the play store, the views, the i18n keys, the tests and the e2e specs. Settings are not saved (ADR 0002: only Preferences and the last name live in `localStorage`), so nothing stored needs migrating.
- **One rules module for both drag Games.** `src/game/dragNumbers.ts` keeps the shared rules. The name stays because it still describes what the Player does: drag numbers onto the face. The Round type (`NumbersRound`) gets `game: 'dragHours' | 'dragMinutes'`. A new type `NumbersGame` sits next to `ClockGame`, and `ClockGame` becomes `Exclude<Game, NumbersGame>`.
- **Slots, not values, in the rules.** Tasks, slots, tray, drop, swap, Submit, the Place-It rule and the neighbour Hint all work on slot ids 1–12, as today. A single pure function turns a slot id into what the tile shows: `tileValue(game, n)`, which is `n` for Drag Hours and `n * 5` for Drag Minutes. The view and the Hint text call it. The rules and the Summary maths never deal with minutes, so Drag Minutes adds no new rules logic.
- **Board and face.** `NumberBoard.vue` and `NumberFace.vue` take the Game (or a `value(n)` function) to label tiles, and an `hourBadges` flag. Hour Badges are drawn at radius ~40 in face units: a circle r≈8.5 filled with the tick colour at low alpha, and the hour in the tick colour (`--tick`), weight 800, about 11 units, as in variant C of the design sketch. They take no pointer events and sit under the tiles and the lifted tile. Their colours come from theme tokens and are checked in all three themes.
- **Hint text.** The existing `numbers.between` key is reused with values from `tileValue`, so "10 goes between 5 and 15" needs no new key. The tray and slot aria labels use the value too.
- **Settings.** `GAMES` order: `dragHours`, `dragMinutes`, `dragArrows`, `setTime`. The Games row in `SettingsView.vue` must fit four cards on desktop, on a 768 px tablet and on a 360 px phone. The Drag Minutes icon is original SVG (a face with tiles showing minutes, for example "5" and "30"), drawn next to the existing Drag Hours icon.
- **i18n.** en: "Drag Hours" / "Drag the numbers 1–12 to their places." and "Drag Minutes" / "Drag the minutes 5–60 to their places." uk: "Розстав години" and "Розстав хвилини", with descriptions to match.

## Testing Decisions

- Rules (`src/game/__tests__/dragNumbers.spec.ts`, `round.spec.ts`, `summary.spec.ts`): the shared behaviour is tested once and checked for both Games where the Game matters (`tileValue`, starting a Round, the Summary game id).
- Components: `NumberBoard` and `NumberFace` show minute values and Hour Badges only for Drag Minutes.
- Playwright: a Drag Minutes Teach flow (a wrong drop, the Hint, the Place-It button, finishing) and a Test flow (place all, Submit, Summary), on desktop and phone. The existing Drag Numbers specs are renamed to Drag Hours and keep passing unchanged apart from names.
- Tests never hardcode interface text (use `t` from `src/test/i18n.ts` / `e2e/i18n.ts`).

## Out of Scope

- A Level for Drag Minutes (for example 1-minute ticks). It always uses 5-minute steps.
- Hour Badges on Drag Hours, Drag Arrows or Set Time.
- Showing "00" instead of "60".

## Further Notes

- Glossary changes, made in ticket 04: **Drag Numbers** becomes **Drag Hours** (_Avoid_: Drag Numbers). Add **Drag Minutes** and **Hour Badge** ("The small hour 1–12 by each slot on the Drag Minutes face. It is part of the face, so it shows in both Modes; it is not a Hint." _Avoid_: hint, label). **Game** now lists four Games. **Level** and **Round** mention both drag Games.
