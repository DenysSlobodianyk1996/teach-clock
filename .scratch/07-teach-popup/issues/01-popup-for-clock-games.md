# 01: Two-button popup in Set Time and Drag Arrows

Covers: P1, P2, P4

**What to build:** the wrong-answer popup gets a second button, **Set correct answer**, next to **Got it**, and the Hint panel under the clock is removed. Set correct answer fills the digits (Set Time) or animates the hands (Drag Arrows); the Player still presses Submit. On a phone the clock keeps one size for the whole Round. See the spec.

**Blocked by:** none

**Status:** done

- [x] `WrongAnswerPopup.vue` has Got it (first, focused) and Set correct answer; emits `dismiss` and `setCorrect`; buttons side by side on desktop, stacked on a 360 px phone
- [x] `RoundView.vue` runs `setCorrectAnswer()` from the popup; `HintPanel.vue`, `.waiting`, `.has-hint` and the hint clock sizes are gone
- [x] Desktop and 4:3 too: no space is kept under the clock for a Hint any more; the clock and the layout use the freed room, and the clock still never moves during a Round
- [x] Got it, Escape and the scrim close the popup and leave the hands or digits where they were; a second wrong try opens it again; the Task ends helped either way
- [x] `teach.hint` removed from `en.ts` and `uk.ts` (and from `messages.spec.ts`)
- [x] Vitest: popup component spec; `RoundView.spec.ts` Set Time and Drag Arrows Teach blocks rewritten
- [x] Playwright: `set-time-teach` and `drag-arrows-teach` use the popup buttons via `t`; `clock-stays-put` checks the clock box on a phone too; `fits-small-phone` passes
- [x] All three themes; design boards `SetTimeTeachWrong` and `DragArrowsTeachWrong` show two buttons; the `*TeachHint` boards for these Games removed or replaced
