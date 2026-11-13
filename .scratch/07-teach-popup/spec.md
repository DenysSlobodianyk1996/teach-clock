---
title: One wrong-answer popup for every Game in Teach
status: done
---

# One wrong-answer popup for every Game in Teach

Terms follow [`GLOSSARY.md`](../../GLOSSARY.md). Raw input: [`request.md`](request.md).

## Problem Statement

Teach shows a wrong Answer in two different ways:

- **Set Time and Drag Arrows** open a popup (`WrongAnswerPopup.vue`: small clock, digits, teaching line, **Got it**). After it, a **Set correct answer** button with "Hint: H:MM" (`HintPanel.vue`) enters the layout under the clock.
- **Drag Hours and Drag Minutes** open no popup. A pill ("7 goes between 6 and 8") and an icon-only round lightbulb **Place-It button** appear in a row above the face (`DragRound.vue` `.toast-row`).

So the same moment looks and acts differently per Game, and the "set it for me" action is a text button in one place and an unlabelled icon in another. On a phone neither keeps room for the hint (`RoundView.vue` `.waiting { display: none }` and the `.has-hint` clock sizes; `DragRound.vue` `.toast-row { height: auto }` and the `NumberBoard.vue` `.board.hinted` face size), so the clock shrinks and jumps when it appears.

## Solution

Every Game in Teach shows a wrong Answer in **one popup**, and nothing about the hint is added to the Round layout, so the clock never moves on any screen. The space desktop keeps for the hint today (the hidden Hint panel under the clock, the 48 px row above the number face) is removed too, and the clock gets that room.

The popup:

- Title: "Almost! Here's how it is:" (`teach.wrongTitle`).
- **Shows where the right place is**:
  - Set Time, Drag Arrows: as today, a small clock with the correct time and the Lit Place, plus the digits.
  - Drag Hours, Drag Minutes: a small number face with the right slot lit (its value shown in it, green as in the Place-It flash), its two neighbours shown for orientation, Hour Badges in Drag Minutes.
- Teaching line: `teach.mistakes.<kind>` for the clock Games, "7 goes between 6 and 8" (`numbers.between`, values from `tileValue`) for the drag Games.
- **Two buttons, the same in every Game:**
  - **Got it** (`teach.gotIt`, "Зрозуміло"), first and focused: closes the popup; the Player fixes it themselves. Escape and a click on the scrim do the same.
  - **Set correct answer** (`teach.setCorrect`): closes the popup and puts it right:
    - Set Time: fills the digits; the Player presses Submit.
    - Drag Arrows: animates the hands; the Player presses Submit.
    - Drag Hours / Drag Minutes: places the number, as the Place-It button does today (green flash, focus to the next tray tile).

After **Got it** nothing is shown in the layout. Another wrong try opens the popup again. Either way the Task (or number) counts as helped, as today.

## User Stories

1. As a Player in Teach, a wrong Answer in any Game opens the same popup with the same two buttons.
2. As a Player, the popup shows me where the right place is: the clock with the right time, or the face with the right slot lit.
3. As a Player, I press **Got it** and try again myself; if I'm wrong again, the popup comes back.
4. As a Player, I press **Set correct answer** and the app puts it right: digits, hands or the number. In Set Time and Drag Arrows I still press Submit.
5. As a Player on a phone, the clock never shrinks or moves when I answer wrong.
6. As a Player in Test, nothing changes: no popup, no hint.

## Implementation Decisions

- **One popup component.** `WrongAnswerPopup.vue` gets a second button and emits `dismiss` and `setCorrect`. Its picture depends on the Game kind: `ClockFace` + digits for clock Games, a small `NumberFace` with one lit slot for drag Games. It keeps using `PopupDialog.vue` (focus trap, Escape, scrim). Buttons sit side by side on desktop and stack on a 360 px phone.
- **Clock Games** (`RoundView.vue`): `submit()` opens the popup as today; `setCorrectAnswer()` runs from the popup's `setCorrect`. `HintPanel.vue` is deleted, with `.waiting`, `.has-hint` and the hint-sized clock rules. The clock size on a phone is one value per Game, never changed during a Round.
- **Drag Games** (`DragRound.vue`, `NumberBoard.vue`): a wrong drop opens the popup instead of setting the inline hint. `placeIt()` runs from the popup's `setCorrect`. `.toast-row`, the Place-It button and `.board.hinted` sizing go; the face gets the room the row took. The `marked` tray tile may stay (it is on the tile, not in the layout).
- **Rules** (`src/game/round.ts`, `dragNumbers.ts`): unchanged. `hint()` and the drop outcome's `hint` still supply what the popup shows.
- **i18n**: `teach.hint` and `numbers.placeIt` are no longer used and are removed from `en.ts` and `uk.ts`; `teach.gotIt`, `teach.setCorrect`, `teach.wrongTitle` and `numbers.between` are reused. No new keys unless the drag picture needs an aria label.
- **Glossary**: **Place-It button** is retired (its action is now the popup's Set correct answer). **Hint** becomes "what the wrong-answer popup shows". Done in the last ticket.

## Testing Decisions

- Component: `WrongAnswerPopup` renders both pictures, emits `dismiss` from Got it, Escape and the scrim, and `setCorrect` from the second button.
- `RoundView.spec.ts`: the Set Time, Drag Arrows, Drag Hours and Drag Minutes Teach blocks are rewritten against the popup (the Hint panel and Place-It button tests go).
- Playwright: `set-time-teach`, `drag-arrows-teach`, `drag-hours-teach`, `drag-minutes-teach` use the popup's buttons (by `t`). `clock-stays-put.spec.ts` gains phone runs and the drag Games, checking the clock box is the same before a wrong Answer, with the popup open, and after each button. `fits-small-phone.spec.ts` keeps Submit and the tray visible on 360 × 720.

## Out of Scope

- Test Mode, the Summary, the "Right! Next…" toast (it already overlays the clock).
- A way to reopen help after **Got it** (a lightbulb over the clock was offered and not taken).

## Further Notes

The product brief's phone rule (lines 141–146, "the clock may shrink or move only when a Hint … appears") changes to: the clock never moves during a Round, on any screen.
