# 03: Set Time in Test mode

**What to build:** the first playable Game. The Player picks Set Time + Test + a Level, reads 10 clocks, enters each time on the number pad, sees green/red dots, and ends on a basic Summary.

**Blocked by:** 02

**Status:** done

- [x] Game rules module (plain TypeScript, no Vue): Clock Time (hours 1–12, minutes 0–59, `H:MM` formatting), hand angles with the Hour Hand creeping between numbers
- [x] Task generation: 10 unique Clock Times on the Level step (30/15/5/1), reproducible with an injected random source
- [x] Time entry rules: up to two digits per box, tap a box to select it, clear empties the selected box; Submit enabled once both boxes have a digit; an impossible hour/minute shows an error and is not submitted
- [x] Round: submit an Answer → right/wrong recorded, always moves on in Test; Round finishes after 10
- [x] Read-only SVG clock face component
- [x] On-screen number pad (digits, delete) plus physical keyboard; Submit disabled until complete
- [x] Progress dots green/red
- [x] Leave Round from the header with confirmation → back to Settings, Round discarded
- [x] Basic Summary: "N of 10 right", Right and Wrong lists as text
- [x] Vitest tests for the rules above; component tests for clock face, number pad, dots
- [x] Leave Round dialog: "Покинути раунд?" with "Грати далі" (primary) and "Вийти"
- [x] English text for everything this ticket adds, plus a Vitest check that `uk` and `en` have the same keys (English shows once ticket 10 adds the switch)
