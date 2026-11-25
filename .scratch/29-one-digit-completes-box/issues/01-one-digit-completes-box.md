# 01: One digit completes a box

**What to build:** In Set Time, a first hour digit of 2–9 hands over to the minutes at once, and a first
minute digit of 6–9 completes the minutes as `0X`. A complete box takes no more digits until it is
cleared. Two-digit typing works exactly as now. Rules in `spec.md`.

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] Hours: `2`–`9` selects the minutes; `0` and `1` wait for a second digit; two digits hand over as now
- [ ] Minutes: `6`–`9` shows `06`–`09` at once and the minutes stay selected; `0`–`5` wait
- [ ] A complete box ignores further digits, also after the Player taps, arrows or tabs back into it
- [ ] Clear, Backspace and Delete still empty the selected box, which then takes digits again
- [ ] `13` and `00` still hand over and are reported only on Submit; nothing submits by itself
- [ ] Number pad and physical keyboard behave the same, in Teach and Test
- [ ] "Set correct answer" still fills both boxes with the minutes selected
- [ ] The rule lives in `src/game/timeEntry.ts` (plain TypeScript); unit tests in `timeEntry.spec.ts`
- [ ] `SetTimeAnswer.spec.ts` covers the pad and the keyboard; one Playwright check runs the issue's
      acceptance steps (`8`; `1` `1`; `0` `8`) on the phone layout
