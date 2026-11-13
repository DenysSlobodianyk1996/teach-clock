# 01: Two-button popup in Set Time and Drag Arrows

Covers: P1, P2, P4

**What to build:** the wrong-answer popup gets a second button, **Set correct answer**, next to **Got it**, and the Hint panel under the clock is removed. Set correct answer fills the digits (Set Time) or animates the hands (Drag Arrows); the Player still presses Submit. On a phone the clock keeps one size for the whole Round. See the spec.

**Blocked by:** none

**Status:** todo

- [ ] `WrongAnswerPopup.vue` has Got it (first, focused) and Set correct answer; emits `dismiss` and `setCorrect`; buttons side by side on desktop, stacked on a 360 px phone
- [ ] `RoundView.vue` runs `setCorrectAnswer()` from the popup; `HintPanel.vue`, `.waiting`, `.has-hint` and the hint clock sizes are gone
- [ ] Got it, Escape and the scrim close the popup and leave the hands or digits where they were; a second wrong try opens it again; the Task ends helped either way
- [ ] `teach.hint` removed from `en.ts` and `uk.ts` (and from `messages.spec.ts`)
- [ ] Vitest: popup component spec; `RoundView.spec.ts` Set Time and Drag Arrows Teach blocks rewritten
- [ ] Playwright: `set-time-teach` and `drag-arrows-teach` use the popup buttons via `t`; `clock-stays-put` checks the clock box on a phone too; `fits-small-phone` passes
- [ ] All three themes; design boards `SetTimeTeachWrong` and `DragArrowsTeachWrong` show two buttons; the `*TeachHint` boards for these Games removed or replaced
