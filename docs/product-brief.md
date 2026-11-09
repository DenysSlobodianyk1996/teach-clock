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
2. **Settings**: choose the Game, Mode and Level (no Level for Drag Numbers). Each option has a
   one-line description. Drag Numbers in Teach is picked when Settings opens; picking Drag Arrows
   or Set Time shows the Level, set to 1 minute. Back returns to Welcome.
3. **Round**: the Game itself. A row of dots shows progress; a Round only moves forward.
   Leaving asks "Leave this Round?" and returns to Settings; nothing is kept.
4. **Summary**: read-only. Tasks grouped into **Right** and **Wrong**. Each wrong Task shows the
   Player's first Answer next to the correct one, both drawn as clocks. Buttons: Play again,
   back to Settings.

A small header on every screen holds the Preferences: interface language (Ukrainian first,
English second) and theme (middle by default, dark, light). The device remembers Preferences and
the last name typed.

## Games

| Game | Player sees | Player does | Round | Levels |
|---|---|---|---|---|
| **Drag Numbers** | An empty clock face with 12 slots and a tray of shuffled numbers | Drags each number 1–12 onto its slot | All 12 numbers | — |
| **Drag Arrows** | A target Clock Time `H:MM` and a clock with hands at 12:00 | Drags the hands to show the target, presses Submit | 10 Tasks | 1 / 5 / 15 min |
| **Set Time** | A clock showing a Clock Time | Enters `H:MM` on an on-screen number pad, presses Submit | 10 Tasks | 1 / 5 / 15 min |

2019 screenshots of the original games are in `docs/original/screenshots/` (reference for mechanics
only, not for look).

Rules shared by Drag Arrows and Set Time:

- A Clock Time has hours 1–12 and minutes 00–59. No seconds, no 24-hour times, no AM/PM.
- Minutes are multiples of the Level step. A Round never repeats a Clock Time.

### Drag Arrows: how the hands move

- One Clock Time drives both hands, so the hands can never disagree.
- The short Hour Hand moves gradually between numbers as minutes pass, like a real clock.
- Dragging the long Minute Hand changes minutes and snaps to the Level step. Passing 12 rolls the
  hour forward or back.
- Dragging the Hour Hand changes only the hour. It jumps to the hour whose position (with the
  current minutes) is nearest the finger. At 1:30 the Hour Hand is between 1 and 2, whichever
  hand was set first.
- While a hand is dragged, a ring lights up the tick it will land on: the snapped minute, or the
  hour's number.
- Hands start at 12:00 for every Task. 12:00 is never a target, so an untouched submit is wrong.

### Set Time: input

- Hour and minute boxes, up to two digits each. The Player taps a box to select it; the hour box
  hands over to the minutes after its second digit. One digit reads with a leading zero
  (`1` → 01, `5` minutes → 05).
- On-screen number pad (0–9, clear). Clear empties the whole selected box. A physical keyboard
  also works: digits, Backspace/Delete to clear, ←/→ or Tab to switch boxes, Enter to submit.
- Submit is enabled once both boxes have a digit. An impossible value (hour outside 1–12, minute
  outside 00–59) shows an error under the boxes and is not submitted; the Player fixes it first.

## Modes

### Teach

- Wrong Answer → a popup shows the correct Answer (digits plus a small clock). The Player's hands or
  digits stay where they were.
- After the first wrong try a **Set correct answer** button appears, with the Hint (the correct
  Answer) under it. Pressing it fills in the Answer (digits appear or hands animate); the Player
  still presses Submit.
- The Round moves on only after a right Answer. Dots: green = right first time, yellow = needed help.
  A Task that needed help is listed under **Wrong** in the Summary.
- Drag Numbers: a number dropped on the wrong slot goes straight back to the tray with a hint
  "7 goes between 6 and 8".

### Test

- No feedback during the Round. Every Submit moves on; dots turn green or red.
- Drag Numbers: numbers can be placed and swapped freely, with no feedback. Submit becomes available
  when all 12 are placed. The Summary shows the Player's face next to the correct one.

## Look

- Mid-tone, soft but saturated palette as the default "middle" theme (for example deep teal/navy
  background, warm cream clock face, coral Hour Hand, teal Minute Hand, mustard highlights,
  softened green/red for right/wrong). Dark and light themes as alternatives.
- Text meets WCAG AA contrast. Touch targets at least 48 px.
- The play area keeps a 4:3 landscape shape, scales to fit, and is capped at about 1024 px wide on
  desktop. Every screen switches to the phone layout when the window is 768 px wide or less, taller
  than wide (an upright tablet too), or 500 px tall or less (a phone held sideways). There the
  screen stacks and scrolls, and the clock sits above the answer area (beside it on a sideways
  phone wider than 600 px). The breakpoint is defined once, in `src/styles/media.ts`.
- In the 4:3 layout (desktop, landscape tablet) the clock never moves during a Round. Anything that
  can appear around it (the Hint, an error, the Drag Numbers hint, Submit) has its space kept from
  the first Task, empty until needed.
- On a phone the clock is as big as the screen allows: no empty space is kept, so the clock may
  shrink or move only when a Hint, a hint note or Submit appears. Everything still fits a
  360 × 720 screen without scrolling.
- All art is original SVG. The 2019 palette and images are not reused.

## Out of scope

Accounts, admin, stored results and statistics, e-mail, timers, sound, telling the time in a
foreign language.
