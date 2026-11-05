# 03: Set Time in Test mode

**What to build:** the first playable Game. The Player picks Set Time + Test + a Level, reads 10 clocks, enters each time on the number pad, sees green/red dots, and ends on a basic Summary.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Game rules module (plain TypeScript, no Vue): Clock Time (hours 1–12, minutes 0–59, `H:MM` formatting), hand angles with the Hour Hand creeping between numbers
- [ ] Task generation: 10 unique Clock Times on the Level step (30/15/5/1), reproducible with an injected random source
- [ ] Time entry rules: impossible hour/minute keys rejected; complete only when both boxes are filled
- [ ] Round: submit an Answer → right/wrong recorded, always moves on in Test; Round finishes after 10
- [ ] Read-only SVG clock face component
- [ ] On-screen number pad (digits, delete) plus physical keyboard; Submit disabled until complete
- [ ] Progress dots green/red
- [ ] Leave Round from the header with confirmation → back to Settings, Round discarded
- [ ] Basic Summary: "N of 10 right", Right and Wrong lists as text
- [ ] Vitest tests for the rules above; component tests for clock face, number pad, dots
- [ ] Leave Round dialog: "Покинути раунд?" with "Грати далі" (primary) and "Вийти"
- [ ] English text for everything this ticket adds, plus a Vitest check that `uk` and `en` have the same keys (English shows once ticket 10 adds the switch)
