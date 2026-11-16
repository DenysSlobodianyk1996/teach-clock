# 01: Right numbers on a green face in the Teach Summary

**Blocked by:** none

**Status:** todo

**What to build:** in Teach, the **Правильно** card of a Drag Hours or Drag Minutes Summary shows a face with each right number on its slot, filled green, instead of the chips (decisions 1–6 in `request.md`; board `SummaryDragHoursTeach`).

**Checklist:**

- [ ] Tests first (`SummaryView.spec.ts`): Drag Hours Teach with helped numbers shows a face in the Правильно card; the right numbers sit on their slots with the green `good` tiles, the helped ones' slots are empty; no `.chip` is left.
- [ ] Same for Drag Hours 13–24 and Drag Minutes, with the Hour Badges.
- [ ] A perfect Round shows all 12 green.
- [ ] The face's `aria-label` names the right numbers as the tiles show them ("Правильно: 14, 15, …"), text looked up with `t`.
- [ ] Reuse `NumberFace` (`tiles`, `slots`, `good`) at the size of the Test faces (`big-face`); remove the `.chips` / `.chip` styles if nothing else uses them.
- [ ] Test Summary unchanged; Set Time and Drag Arrows unchanged.
- [ ] Playwright: a Drag Minutes Teach Round ends with the green face (update `e2e/drag-minutes-teach.spec.ts`, which looks for a chip today).

**Out of scope:** the Потренуймо ще card; Test Mode.
