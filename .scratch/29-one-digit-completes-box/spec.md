# Spec: one digit completes a box

Parent of this batch. Source: GitHub issue #87 (`request.md`) and the grilling that followed it.

## Problem

In Set Time, a Player who wants 8 o'clock types `8` and then has to tap the minute box, although no
second hour digit could follow: 80–89 is not an hour. The same goes for a minute digit of 6–9.
Leading zeros (`08`) are a step a child should not need.

## Rules

A box is **complete** when no further digit could make a value in its Range:

| Box     | Range | Complete after                       | Waits after          |
| ------- | ----- | ------------------------------------ | -------------------- |
| Hours   | 1–12  | a first digit 2–9, or any two digits | a first digit 0 or 1 |
| Minutes | 0–59  | a first digit 6–9, or any two digits | a first digit 0–5    |

- A complete hour box hands over to the minutes, as two digits already do (`8` → minutes).
- A complete minute box shows two digits at once (`7` → `07`) and stays selected. Nothing is
  submitted on its own: the Player still checks the answer and presses Submit (or Enter).
- A complete box takes no more digits until Clear (or Backspace/Delete) empties it, however the
  Player came back to it (a tap, ←/→, Tab). It is the same rule as a full two-digit box today.
- Two-digit values are unchanged, impossible ones included: `1` `3` → `13` and `0` `0` → `00`
  still hand over, and the error shows only on Submit. The Range under each box stays the guide.
- One rule for the number pad and a physical keyboard; Teach and Test alike; every Level.
- "Set correct answer" still fills both boxes and leaves the minutes selected.

## Acceptance (from the issue)

- `8` → the hour box shows 8, the minutes are selected.
- `1` → the hours stay selected; `1` again → 11, the minutes are selected.
- `0` `8` → 08, the minutes are selected.
- In the minutes, `7` → 07 and a further digit changes nothing; `3` waits for a second digit.

## Out of scope

- No glossary change: Set Time and Range already name everything here.
- 24-hour Set Time (noted in batch 14) is later work; these rules are for 1–12.

## When done

Close GitHub issue #87 with a comment linking the batch PR, once the PR is open and its checks
pass. The PR body also says `Closes #87`.
