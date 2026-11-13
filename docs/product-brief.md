# Teach Clock — product brief

A browser game (installable PWA) that teaches children to read and set an analogue clock.
Rebuild of the 2019 thesis project "Time Teacher" (`docs/original/`, in Ukrainian). From 2019 only the
idea and game mechanics carry over. The old stack, code, accounts, results tracking and the
"say the time in English" game are dropped.

Terms are defined in [`GLOSSARY.md`](../GLOSSARY.md). Decisions are in [`docs/adr/`](adr/).

## Principles

- **Teaching first.** A wrong Answer is a moment to show what's right, not a penalty.
- **No accounts, nothing stored about the Player.** The name is typed in only for greetings (ADR 0002).
- **No timer, no sound.** Animations are welcome.
- **Works everywhere.** Phone, tablet, desktop; touch and mouse; offline.

## Screens

1. **Welcome**: a short description of what the app teaches, a name field, Start.
2. **Settings**: choose the Game, Mode and Level. Four Games, in this order: Drag Hours, Drag
   Minutes, Drag Arrows, Set Time (no Level for Drag Hours or Drag Minutes). Each option has a
   one-line description; each Game and Mode also has an icon (Teach: a lightbulb, Test: a check
   mark in a circle). Drag Hours in Teach is picked when Settings opens; picking Drag Arrows
   or Set Time shows the Level, set to 1 minute. Back returns to Welcome.
3. **Round**: the Game itself. A row of dots shows progress; a Round only moves forward. Under the
   dots, "Task 1 of 10 · Teach" with the Mode's icon before its name.
   Leaving asks "Leave this Round?" and returns to Settings; nothing is kept.
4. **Summary**: read-only. A line with the Player's name, Game, Mode and Level, the score and the
   Round's dots; then Tasks grouped into **Right** (first) and **Wrong**. Right Tasks are drawn as
   big clocks with their times. Each wrong Task shows the Player's first Answer next to the correct
   one, both as big clocks (on a phone the pair stacks: the Player's Answer, a down arrow, then the
   correct one). Buttons: Play again, back to Settings.

A small header on every screen holds the Preferences: interface language (Ukrainian first,
English second) and theme (middle by default, dark, light). The device remembers Preferences and
the last name typed.

## Games

| Game             | Player sees                                                                                   | Player does                                                             | Round          | Levels         |
| ---------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------- | -------------- |
| **Drag Hours**   | An empty clock face with 12 slots and a tray of shuffled numbers                              | Drags each number 1–12 onto its slot                                    | All 12 numbers | —              |
| **Drag Minutes** | An empty clock face with 12 slots, an Hour Badge 1–12 by each, and a tray of shuffled minutes | Drags each minute 5, 10, … 60 onto the slot of its hour (60 at the top) | All 12 minutes | —              |
| **Drag Arrows**  | A target Clock Time `H:MM` and a clock with hands at 12:00                                    | Drags the hands to show the target, presses Submit                      | 10 Tasks       | 1 / 5 / 15 min |
| **Set Time**     | A clock showing a Clock Time                                                                  | Enters `H:MM` on an on-screen number pad, presses Submit                | 10 Tasks       | 1 / 5 / 15 min |

2019 screenshots of the original games are in `docs/original/screenshots/` (reference for mechanics
only, not for look).

Drag Hours and Drag Minutes share one set of rules and one board, in both Modes: a number is moved
by dragging it, or by tapping it and then a slot. While a number is picked by a tap or held in a
drag, every free slot turns from grey dashes to orange; the slot under the finger gets a stronger
orange ring. Letting go or cancelling turns them grey again. On the Drag Minutes face each slot has
an Hour Badge (the hour 1–12 in a soft circle, towards the centre from the slot). The Badges are
part of the face, not a Hint: they stay visible after a minute is placed, in Teach and in Test, and
in the Summary.

The Summary of Drag Minutes looks like Drag Hours, with the minute tiles and the Hour Badges on
every face. In Teach the right numbers are listed as chips, and each helped number shows the
Player's first drop next to its slot. In Test the Player's face sits next to the correct one.

Rules shared by Drag Arrows and Set Time:

- A Clock Time has hours 1–12 and minutes 00–59. No seconds, no 24-hour times, no AM/PM.
- Minutes are multiples of the Level step. A Round never repeats a Clock Time.
- In Teach the clock shows the Lit Place, a Teach help: the Minute Hand's tick in the Minute
  Hand's colour, a little thicker, with a glow; and the number of the hour the Hour Hand has passed
  (at 2:55 the 2, at 12:40 the 12) in the Hour Hand's colour, with a glow. The lit number is drawn
  over the Grips, so it stays readable where a Grip sits on it (at 3:15 the 3). In Test nothing is
  lit at any point, before or after dragging. Clocks in the Summary and the wrong-answer popup light
  nothing.

### Drag Arrows: how the hands move

- One Clock Time drives both hands, so the hands can never disagree.
- The short Hour Hand moves gradually between numbers as minutes pass, like a real clock.
- Dragging the long Minute Hand changes minutes and snaps to the Level step. Passing 12 rolls the
  hour forward or back.
- Dragging the Hour Hand changes only the hour. It jumps to the hour whose position (with the
  current minutes) is nearest the finger. At 1:30 the Hour Hand is between 1 and 2, whichever
  hand was set first.
- In Teach the lit tick and number follow the hands while they are dragged and stay lit after
  letting go.
- Hands start at 12:00 for every Task. 12:00 is never a target, so an untouched submit is wrong.

### Set Time: input

- Hour and minute boxes, up to two digits each. The Player taps a box to select it; the hour box
  hands over to the minutes after its second digit. One digit reads with a leading zero
  (`1` → 01, `5` minutes → 05).
- Under each box its range, in every Mode and Level: "1–12" under the hours, "0–59" under the
  minutes. It only tells the Player which numbers fit; any digits can still be typed. The number pad
  sits close under the ranges.
- On-screen number pad (0–9, clear). Clear empties the whole selected box. A physical keyboard
  also works: digits, Backspace/Delete to clear, ←/→ or Tab to switch boxes, Enter to submit.
- Submit is enabled once both boxes have a digit. An impossible value (hour outside 1–12, minute
  outside 00–59) shows an error under the boxes (on a wide screen in place of the ranges) and is
  not submitted; the Player fixes it first.

## Modes

### Teach

- Every Game shows a wrong Answer the same way: a popup ("Almost! Here's how it is:") with the
  Hint and two buttons. Nothing about the Hint is added to the Round's layout.
- Set Time and Drag Arrows: the popup shows the correct Answer (a small clock with the Lit Place,
  plus the digits) and a teaching line for the kind of mistake. The Player's hands or digits stay
  where they were.
- **Got it** (first and focused) closes the popup; the Player fixes it themselves. Escape or a tap on
  the scrim does the same. Another wrong try opens the popup again.
- **Set correct answer** closes the popup and puts it right: in Set Time the digits appear, in Drag
  Arrows the hands animate; the Player still presses Submit.
- The Round moves on only after a right Answer. Dots: green = right first time, yellow = needed help.
  A Task that needed help is listed under **Wrong** in the Summary.
- Drag Hours and Drag Minutes: a number dropped on the wrong slot goes straight back to the tray
  and the same popup opens. Its picture is a small face with that number's slot lit green between
  its two neighbours (Hour Badges in Drag Minutes), and its line is "7 goes between 6 and 8" (Drag
  Minutes: "10 goes between 5 and 15"; across the top it wraps: "60 goes between 55 and 5", "5 goes
  between 60 and 10"). **Got it** leaves the number in the tray. **Set correct answer** puts it on
  its slot for the Player: the slot rings green for a moment (a still ring with reduced motion) and
  focus moves to the next tray tile. Either way the number stays helped (yellow dot, under
  **Wrong** in the Summary), since the wrong drop already happened.

### Test

- No feedback during the Round. Every Submit moves on; dots turn green or red.
- Drag Hours and Drag Minutes: numbers can be placed and swapped freely, with no feedback. Submit
  becomes available when all 12 are placed. The Summary shows the Player's face next to the correct
  one.

## Look

- Mid-tone, soft but saturated palette as the default "middle" theme (for example deep teal/navy
  background, warm cream clock face, coral Hour Hand, teal Minute Hand, mustard highlights,
  softened green/red for right/wrong). Dark and light themes as alternatives.
- Both hands are thin on every clock, so a number they cross stays readable; they differ by length
  and colour. In Drag Arrows each hand ends in a Grip: both Grips are the same small ring in their
  hand's colour, with a bigger invisible touch area around them, and every number is drawn over the
  hands and Grips, so a Grip never hides a number. On clocks without Grips the numbers stay under
  the hands.
- Text meets WCAG AA contrast. Touch targets at least 48 px.
- The play area keeps a 4:3 landscape shape, scales to fit, and is capped at about 1024 px wide on
  desktop. Every screen switches to the phone layout when the window is 768 px wide or less, taller
  than wide (an upright tablet too), or 500 px tall or less (a phone held sideways). There the
  screen stacks and scrolls, and the clock sits above the answer area (beside it on a sideways
  phone wider than 600 px). The breakpoint is defined once, in `src/styles/media.ts`.
- The clock never moves during a Round, on any screen. The Hint opens in a popup over it, so no
  space is kept around the clock for it. Anything else that can appear beside it (a Set Time error,
  the drag Games' Submit) has its space kept from the first Task, empty until needed.
- On a phone the clock is as big as the screen allows, one size for the whole Round. Everything
  still fits a 360 × 720 screen without scrolling.
- All art is original SVG. The 2019 palette and images are not reused.

## Out of scope

Accounts, admin, stored results and statistics, e-mail, timers, sound, telling the time in a
foreign language.
