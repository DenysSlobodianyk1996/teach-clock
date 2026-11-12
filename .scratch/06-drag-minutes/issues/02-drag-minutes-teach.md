# 02: Drag Minutes in Teach

Covers: D2, D3, D4

**What to build:** a new Game, **Drag Minutes**, playable in Teach from Settings. The tray holds 5, 10, … 60, and the minute N×5 belongs on slot N. The face shows the Hour Badges (variant C, inner badges). A wrong drop shows the neighbour Hint and the Place-It button from 05-drag-help. See the spec for the rules, the badge look and the i18n text.

**Blocked by:** 01

**Status:** todo

- [ ] `GAMES` is `dragHours`, `dragMinutes`, `dragArrows`, `setTime`; `NumbersGame` includes `dragMinutes`; no Level and 12 Tasks for both drag Games
- [ ] `startRound` makes a Drag Minutes Round; `tileValue('dragMinutes', n)` is `n * 5`
- [ ] Settings shows the Drag Minutes card right after Drag Hours, with an original SVG icon; four cards fit on desktop, on a 768 px tablet and on a 360 px phone
- [ ] The face shows the Hour Badges 1–12 (a soft circle r≈8.5 at radius ~40, digit in `--tick`); they stay visible under and around placed tiles and never take a pointer or a drop
- [ ] Teach: a wrong drop shows "10 goes between 5 and 15", wrapping as 60 between 55 and 5, and 5 between 60 and 10; the Place-It button places the minute (helped)
- [ ] The tray, the lifted tile and the placed tiles show minute values at the same size as Drag Hours; two-digit values fit the tile
- [ ] Summary for Teach: chips show minute values
- [ ] en and uk text ("Drag Minutes" / "Розстав хвилини" and descriptions)
- [ ] Rules and component tests; a Playwright Teach flow, desktop and phone, using `t` for every text
- [ ] Badge colours are readable in all three themes
- [ ] New and changed design boards (Settings with four Games, a Drag Minutes Teach board, desktop and phone); ticket 04 does the final check
