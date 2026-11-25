# 01: One digit completes a box (#87)

**What to build:** In Set Time, a first hour digit of 2–9 hands over to the minutes at once, and a first
minute digit of 6–9 completes the minutes as `0X`. A complete box takes no more digits while it stays
selected. Two-digit typing works exactly as now. Rules in `spec.md`, "A box is complete".

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Hours: `2`–`9` selects the minutes and shows as typed (`8`); `0` and `1` wait for a second digit; two digits hand over as now
- [x] Minutes: `6`–`9` shows `06`–`09` at once and the minutes stay selected; `0`–`5` wait
- [x] A complete box ignores further digits while it stays selected
- [x] Clear, Backspace and Delete still empty the selected box, which then takes digits again
- [x] `13` and `00` still hand over and are reported only on Submit; nothing submits by itself
- [x] Number pad and physical keyboard behave the same, in Teach and Test
- [x] The rule lives in `src/game/timeEntry.ts` (plain TypeScript); unit tests in `timeEntry.spec.ts`
- [x] `SetTimeAnswer.spec.ts` covers the pad and the keyboard; one Playwright check runs the #87
      acceptance steps (`8`; `1` `1`; `0` `8`; minutes `7`) on the phone layout
