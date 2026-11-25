# Spec: quick time entry

Parent of this batch, for GitHub issues #87 and #88 (`request.md`) and the grilling that followed.

## Problem

Set Time asks a child for keystrokes that carry no meaning:

- **#87** A Player who wants 8 o'clock types `8` and then has to tap the minute box, although no
  second hour digit could follow. The same goes for a minute digit of 6–9. A leading zero (`08`) is
  a step a child should not need.
- **#88** To retype a box, for example after a wrong Answer in Teach, the Player taps it and finds
  the old digits still there: they must press Clear before typing.

## Rules

### A box is complete

A box is **complete** when no further digit could make a value in its Range:

| Box     | Range | Complete after                       | Waits after          |
| ------- | ----- | ------------------------------------ | -------------------- |
| Hours   | 1–12  | a first digit 2–9, or any two digits | a first digit 0 or 1 |
| Minutes | 0–59  | a first digit 6–9, or any two digits | a first digit 0–5    |

- A complete hour box hands over to the minutes, as two digits already do (`8` → minutes). The hour
  shows as typed: `8`, not `08`.
- A complete minute box shows two digits at once (`7` → `07`) and stays selected. Nothing is
  submitted on its own: the Player checks the Answer and presses Submit (or Enter).
- A complete box takes no more digits while it stays selected. Clear, or selecting it again, lets
  the Player retype it.
- Two-digit values are unchanged, impossible ones included: `1` `3` → `13` and `0` `0` → `00`
  still hand over, and the error shows only on Submit. The Range under each box stays the guide.

### A selected box is retyped

- The first digit typed into a box after it is selected replaces what it holds; later digits add to
  it as usual. The complete-box rules then apply to the new value.
- Selecting is any of: a tap, ←/→, Tab, an auto hand-over from the hours, and "Set correct answer"
  (which leaves the minutes selected).
- Selecting alone empties nothing: a tap to look loses no digits, and Submit stays as it was until
  a digit is typed.
- While a selected box will be replaced, its digits look highlighted, like selected text, in both
  themes. The first digit, or Clear, removes the highlight.
- Example: the Player answered 8:30 and must fix the hour to 9. Tap the hours (`8` highlighted),
  type `9`: the hours read 9 and the minutes are selected with `30` highlighted. Submit, or type
  new minutes.

### Everywhere

One rule for the number pad and a physical keyboard; Teach and Test alike; every Level.

## Acceptance

- `8` → the hour box shows 8, the minutes are selected (#87).
- `1` → the hours stay selected; `1` again → 11, the minutes are selected (#87).
- `0` `8` → 08, the minutes are selected (#87).
- In the minutes, `7` → 07 and a further digit changes nothing; `3` waits for a second digit (#87).
- With 8:30 entered, tapping the hours and typing `1` `1` gives 11:30, with no Clear (#88).
- With 8:30 entered, tapping the minutes and typing `4` `5` gives 8:45, with no Clear (#88).

## Out of scope

- No glossary change: Set Time and Range already name everything here.
- 24-hour Set Time (noted in batch 14) is later work; these rules are for 1–12.

## When done

Close GitHub issues #87 and #88 with a comment linking the batch PR, once the PR is open and its
checks pass. The PR body also says `Closes #87, closes #88`.
