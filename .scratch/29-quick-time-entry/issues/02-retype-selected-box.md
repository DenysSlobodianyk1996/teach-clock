# 02: A selected box is retyped (#88)

**What to build:** In Set Time, the first digit typed into a box after it is selected replaces what it
holds, so a Player retypes a box without pressing Clear. Selecting alone loses nothing, and the
digits look highlighted until the first key. Rules in `spec.md`, "A selected box is retyped".

**Blocked by:** 01 One digit completes a box

**Status:** done

- [x] After a tap, ←/→, Tab, an auto hand-over or "Set correct answer", the next digit replaces the box's value
- [x] Later digits add to the new value, and ticket 01's complete-box rules apply to it
- [x] Selecting without typing keeps the digits and Submit's state
- [x] A box that will be replaced shows its digits highlighted, like selected text, readable in the
      light and dark themes; the first digit or Clear removes it
- [x] Clear still empties the box at once
- [x] Number pad and physical keyboard behave the same, in Teach and Test, including after the
      wrong-Answer popup closes
- [x] The rule lives in `src/game/timeEntry.ts`; unit tests in `timeEntry.spec.ts`; the "Set correct
      answer" test now expects a typed digit to replace the minutes
- [x] `SetTimeAnswer.spec.ts` covers tap, arrows and the highlight; one Playwright check runs the #88
      acceptance steps (8:30 → tap hours, `1` `1` → 11:30; tap minutes, `4` `5` → 8:45) on the phone layout
