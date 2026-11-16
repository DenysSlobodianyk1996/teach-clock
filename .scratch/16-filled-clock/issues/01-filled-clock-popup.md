# 01: The eye opens the Filled Clock

**Blocked by:** none

**Status:** done

**What to build:** in Teach, Drag Hours and Drag Minutes, an eye button by the heading opens a popup with the Filled Clock (decisions 1–7 in `request.md`).

**Checklist:**

- [x] Tests first (`RoundView.spec.ts`): the eye shows in Drag Hours and Drag Minutes Teach, not in Test.
- [x] Clicking it opens a dialog titled `numbers.filledTitle` with a face holding all 12 tiles on their own slots, as the Round shows them (1–12, 13–24, 5…60); no green or red tiles.
- [x] Got it closes it; the Round's slots, tray, statuses and the ringed tray tile are unchanged.
- [x] The eye is disabled while the wrong-drop popup is open and after the last number.
- [x] Texts in `uk` and `en`, looked up with `t` in tests.
- [x] Playwright: a Drag Minutes Teach Round opens and closes the Filled Clock (`e2e/drag-minutes-teach.spec.ts`).

**Out of scope:** Test Mode, Drag Arrows, Set Time.
