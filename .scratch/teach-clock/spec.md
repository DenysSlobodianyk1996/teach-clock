---
title: Teach Clock — first playable version
status: done
---

# Teach Clock — first playable version

Terms follow [`GLOSSARY.md`](../../GLOSSARY.md). Decisions: [`docs/adr/`](../../docs/adr/). Full design: [`docs/product-brief.md`](../../docs/product-brief.md).

## Problem Statement

Children aged about 6–10 find the analogue clock hard. The hour hand creeping between numbers, "past"
and "to", and which hand is which only make sense through practice. Parents and teachers have few
simple, free, ad-free tools for that practice that work on a tablet or phone, offline, without
signing a child up for anything. The 2019 "Time Teacher" thesis project covered the idea, but it
needs a server and login, uses an outdated stack, and treats wrong answers as a score penalty
instead of a teaching moment.

## Solution

Teach Clock is an installable, offline web game with three Games:
- **Drag Numbers**: put 1–12 on an empty face.
- **Drag Arrows**: drag the hands to a given Clock Time.
- **Set Time**: read the clock and enter the time.

Each Game runs in one of two Modes:
- **Teach**: a wrong Answer shows the right one, and the Player must fix it before moving on.
- **Test**: every Answer moves on with no feedback until the Summary.

How it works:
- The Player types a name and picks a Game, Mode and Level (minute step 1/5/15, 1 by default).
- A Round is 10 Tasks, or the 12 numbers in Drag Numbers.
- The Round ends with a read-only Summary of what was right and what was wrong.
- Nothing is stored except Preferences (language, theme) and the last name.

## User Stories

### Welcome and Settings

1. As a Player, I want to see a short explanation of what the app teaches on the first screen, so that I (or my parent) know what it's for.
2. As a Player, I want to type my name, so that the game greets me by name.
3. As a returning Player on the same device, I want my last name pre-filled, so that I can start quickly.
4. As a Player, I want to start without any account, password or e-mail, so that nothing stands between me and playing.
5. As a Player, I want to choose one of three Games on the Settings screen, so that I can practise the skill I need.
6. As a Player, I want a one-line description under each Game, so that I know what it asks me to do.
7. As a Player, I want to choose Teach or Test, with a one-line description of each, so that I can choose between learning with help and checking myself.
8. As a Player, I want to choose a Level (1, 5 or 15 minutes) for Drag Arrows and Set Time, so that I can start easy and make it harder.
9. As a Player, I want the Level choice hidden for Drag Numbers, so that I'm not confused by an option that doesn't apply.
10. As a Player, I want to go back from Settings to Welcome, so that I can change my name.

### Preferences

11. As a Player, I want the interface in Ukrainian by default, so that I can play in my language.
12. As a Player, I want to switch the interface to English from any screen, so that I can play in English.
13. As a Player, I want to switch between middle, dark and light themes from any screen, so that the colours are comfortable for me.
14. As a returning Player, I want my language and theme remembered on this device, so that I don't set them every time.

### Playing a Round (all Games)

15. As a Player, I want a row of progress dots, so that I can see how many Tasks are done and how many are left.
16. As a Player, I want each finished Task's dot coloured by its result, so that I can see how I'm doing.
17. As a Player, I want the Round to only move forward, so that it feels like a clear sequence.
18. As a Player, I want to leave a Round from the header, after confirming, so that I can stop without losing my place by accident.
19. As a Player who left a Round, I want to land back on Settings, so that I can pick something else.
20. As a Player, I want no timer, so that I can think without pressure.
21. As a Player, I want short animations (shake on wrong, snap, gentle celebrations), so that the game feels alive without sound.

### Drag Numbers

22. As a Player, I want an empty clock face with 12 slots and a tray of shuffled numbers 1–12, so that I can rebuild the clock.
23. As a Player, I want to drag a number with a finger or the mouse and drop it on a slot, so that it works on any device.
24. As a Player in Teach, I want a number dropped on the wrong slot to go straight back to the tray, so that I can try again right away.
25. As a Player in Teach, I want a hint like "7 goes between 6 and 8" after a wrong drop, so that I learn where it belongs.
26. As a Player in Teach, I want "12 goes between 11 and 1" (wrapping around), so that the hint is correct at the top of the clock.
27. As a Player in Teach, I want a correctly dropped number to lock in place, so that the face fills up as I learn.
28. As a Player in Test, I want to drop any number on any slot with no feedback, so that I'm really tested.
29. As a Player in Test, I want to move a placed number to another slot, swapping if the slot is taken, so that I can change my mind before submitting.
30. As a Player in Test, I want Submit to become available only when all 12 numbers are placed, so that I can't submit half a clock.
31. As a Player, I want the Round to end when all 12 numbers are correctly placed (Teach) or submitted (Test), so that I reach the Summary.

### Drag Arrows

32. As a Player, I want to see a target Clock Time like "4:15" and a clock with hands at 12:00, so that I know what to set.
33. As a Player, I want the short hand to be the Hour Hand and the long hand the Minute Hand, so that the clock looks like a real one.
34. As a Player, I want to drag the Minute Hand around the face, so that I can set the minutes.
35. As a Player, I want the Minute Hand to snap to the Level step, so that I can hit exact times on a small screen.
36. As a Player, I want the Hour Hand to creep forward as I move the Minute Hand, so that I learn how a real clock moves.
37. As a Player, I want the hour to roll forward when the Minute Hand passes 12 clockwise, and back when it passes anticlockwise, so that the clock behaves like a real one.
38. As a Player, I want to drag the Hour Hand on its own to change only the hour, so that I don't have to spin the Minute Hand twelve times.
39. As a Player, I want the hands to never show an impossible combination, so that I'm never taught something wrong.
40. As a Player, I want to press Submit even if I didn't touch the hands, so that the game never blocks me.
41. As a Player, I want the target never to be 12:00, so that an untouched clock is never accidentally right.
42. As a Player, I want the hands to reset to 12:00 for each new Task, so that every Task starts the same.

### Set Time

43. As a Player, I want a clock showing a Clock Time, so that I can read it.
44. As a Player, I want the Hour Hand drawn between the numbers as on a real clock, so that I learn to read it properly.
45. As a Player, I want a big on-screen number pad with digits and delete, so that a phone keyboard doesn't cover the clock.
46. As a Player on desktop, I want to type with my physical keyboard too, so that it feels natural.
47. As a Player, I want hour and minute boxes (`H : MM`), so that I know where each part goes.
48. As a Player, I want an impossible value (hour 0 or 13+, minute 60+) to show an error when I press Submit and not count as an Answer, so that a typo never costs me a Task.
49. As a Player, I want Submit enabled only when both boxes have a digit, so that I don't submit by accident.
50. As a Player, I want minutes shown with two digits ("4:05"), so that I learn the usual way to write time.

### Teach Mode (Drag Arrows, Set Time)

51. As a Player in Teach, I want a popup with the correct Answer (digits and a small clock) after a wrong Answer, so that I see what's right.
52. As a Player in Teach, I want my hands or digits to stay where they were after the popup, so that I can compare and fix them myself.
53. As a Player in Teach, I want a "Set correct answer" button to appear after my first wrong try, with the Hint shown under it, so that I can get unstuck.
54. As a Player in Teach, I want "Set correct answer" to animate the hands (or fill the digits) to the right Answer, so that I see how it should look.
55. As a Player in Teach, I want to still press Submit myself after using the button, so that I finish the Task actively.
56. As a Player in Teach, I want unlimited tries, so that I'm never stuck or punished.
57. As a Player in Teach, I want the Round to move on only after a right Answer, so that every Task ends with me seeing it right.
58. As a Player in Teach, I want a green dot for right first time and a yellow dot for needing help, so that I can see where I struggled.

### Test Mode (Drag Arrows, Set Time)

59. As a Player in Test, I want every Submit to move on with no hint, so that the Round measures what I know.
60. As a Player in Test, I want dots to turn green or red as I go, so that I see progress without being told the answers.

### Tasks and Levels

61. As a Player, I want Clock Times to use only minutes that are multiples of my Level step, so that the difficulty matches my choice.
62. As a Player, I want hours from 1 to 12 only, with no 24-hour times, so that it matches an analogue clock.
63. As a Player, I want no Clock Time repeated within a Round, so that the Round feels varied.

### Summary

64. As a Player, I want a headline like "7 of 10 right", so that I know my result at a glance.
65. As a Player, I want Tasks grouped into Right and Wrong, so that I can focus on mistakes.
66. As a Player, I want Tasks that needed a Hint listed under Wrong, so that I'm honest with myself about what I need to practise.
67. As a Player, I want each wrong Task to show my first Answer next to the correct one, both as clocks, so that I can see the difference.
68. As a Player who played Drag Numbers, I want to see my face next to the correct face with misplaced numbers marked, so that I can see which ones I got wrong.
69. As a Player, I want the Summary to be read-only, so that it's a calm review, not more Tasks.
70. As a Player, I want a small celebration on the Summary, so that finishing feels good.
71. As a Player, I want "Play again" (same Settings) and "Back to Settings" buttons, so that I can continue easily.

### Device, offline, accessibility

72. As a Player on a tablet, I want big touch targets (at least 48 px), so that small fingers can hit them.
73. As a Player on a phone held upright, I want the clock above the answer area, so that everything fits.
74. As a Player on desktop, I want the play area capped at about 1024 px and centred, so that it doesn't stretch across a wide screen.
75. As a parent, I want to install the app and use it offline, so that it works in the car or a classroom with bad Wi-Fi.
76. As a Player, I want readable text contrast in every theme, so that I can read comfortably.
77. As a parent, I want no personal data stored or sent anywhere, so that I don't have privacy worries.

## Implementation Decisions

- **Stack**: Vue 3 + TypeScript + Vite, Vue Router, Pinia, vue-i18n, VueUse, vite-plugin-pwa, canvas-confetti; CSS transitions for animation, GSAP only if needed. Everything is drawn as SVG (ADR 0001). No backend, no stored results (ADR 0002). There is no language game (ADR 0003).

- **Game rules module (deep module, no Vue, no DOM).** It owns all rules, and the UI only renders its state and forwards Player actions. Its public interface, in prose:
  - **Clock Time**: an hour 1–12 and a minute 0–59, with:
    - validation and `H:MM` formatting,
    - hand angles (the hour angle includes the minute fraction, so it creeps),
    - equality.
  - **Hand dragging**:
    - Given the current Clock Time, a pointer angle and the Level step, return the new Clock Time for a Minute Hand drag: snapped to the step, rolling the hour forward or back when crossing 12, based on the previous minute.
    - For an Hour Hand drag, change only the hour and keep the minutes. The hand never sits exactly on a number unless the minutes are 00: at 1:30 it is halfway between 1 and 2, whichever hand was dragged first.
    - **Which hour an Hour Hand drag picks: the nearest drawn position.** With minutes `m`, hour `h` draws the hand at `h × 30° + m × 0.5°`. The new hour is the one whose drawn hand is closest to the pointer: `round((pointerAngle − m × 0.5°) / 30°)`, wrapped into 1–12 (0 becomes 12). An exact tie goes to the later hour. So the hand jumps in 30° steps, never moves away from the finger, and pointing right at a number with minutes 30 gives that number's hour (pointer on 1 at :30 → 1:30, hand between 1 and 2).
  - **Time entry** (Set Time number pad): the hour and minute boxes (up to two digits each) and which one is selected. Actions: type a digit into the selected box (a full hour box hands over to the minutes), clear the selected box, select a box. Reports whether both boxes have a digit, and reads the entry as a Clock Time (one digit reads as 0X) or says which boxes hold an impossible value.
  - **Task generation**:
    - Given the Game, Level, count and a random source, return unique Clock Times on the Level step with hours 1–12.
    - Drag Arrows never uses 12:00.
    - Drag Numbers produces a shuffled tray of 1–12.
  - **Round**:
    - Start from Settings (Game, Mode, Level) and a random source.
    - Each action returns a new Round state plus an outcome.
    - Actions:
      - submit an Answer (a Clock Time),
      - use "Set correct answer",
      - drop a number on a slot (Drag Numbers),
      - submit placements (Drag Numbers Test).
    - Outcomes say what the UI should show:
      - right, then move on,
      - wrong, with the correct Answer, staying on the Task (Teach),
      - wrong and move on (Test),
      - a number rejected with its neighbour hint (Drag Numbers Teach),
      - the Round finished.
    - Each Task records:
      - its correct Answer,
      - the Player's first Answer,
      - a status: pending, right, helped (Teach) or wrong.
  - **Summary**: built from a finished Round. It contains:
    - the right count and the total,
    - the Right list,
    - the Wrong list (helped Tasks included), each with the first Answer and the correct Answer,
    - for Drag Numbers, the Player's placements against the correct ones.
  - The random source is passed in, so Rounds can be reproduced in tests.

- **Neighbour hint** for Drag Numbers wraps around: 12 sits between 11 and 1, and 1 between 12 and 2.

- **Drag Numbers rules**:
  - Teach: only a correct drop is accepted, and wrong drops are rejected with the neighbour hint.
  - Test: placements are free, and dropping on an occupied slot swaps the numbers. Submit is allowed only when all 12 slots are filled, and the result counts each number as one Task (12 dots).

- **App state (Pinia)** holds:
  - Preferences: language (`uk` default, `en`) and theme (`middle` default, `dark`, `light`).
  - The last name, persisted to `localStorage`.
  - The current Settings.
  - The current Round from the rules module, kept in memory only.

  Leaving a Round throws it away.

- **Routes / screens**:
  - Welcome, Settings, Round, Summary.
  - Opening Round or Summary directly, with no Round in memory, redirects to Settings.
  - Settings with no name goes to Welcome.

- **UI components**: each one only renders and forwards Player actions.
  - **Clock face** (SVG): shows a Clock Time. It has three variants, and the same component draws the small Summary clocks:
    - hands visible and draggable,
    - hands visible and read-only,
    - an empty face with number slots.
  - **Number tray**
  - **Number pad**
  - **Progress dots**
  - **Hint panel**, with the "Set correct answer" button
  - **Correct-answer popup**
  - **Summary lists**
  - **Header**, with the language switch, theme switch and Home/Leave

- **Pointer input**: Pointer Events cover mouse and touch alike. Hand angles are measured from the clock centre, with 0° at 12 going clockwise.

- **Theming**: CSS custom properties per theme. The default "middle" theme uses mid-tone, soft but saturated colours. All three themes meet WCAG AA text contrast.

- **Layout**:
  - The play area keeps a 4:3 shape, scales to fit, and is capped at about 1024 px wide.
  - In portrait on a phone, the clock sits above the answer area.
  - Touch targets are at least 48 px.

- **PWA**: precache all assets so the game works fully offline after the first visit. Installable, with an app name and icons for "Teach Clock".

## Testing Decisions

- **Good tests check what the Player can observe, not how it's built.** Tests drive the public interfaces only (rules module functions, component props, emitted events and rendered output, pages in a browser) and never reach into internal state.
- **Rules module (Vitest), most tests, written test-first:**
  - **Clock Time:** angle maths, including how far the hour hand creeps.
  - **Minute Hand drag:** snapping at each Level, plus hour rollover both ways across 12.
  - **Hour Hand drag:** changes only the hour, picking the nearest drawn position. Cases:
    - minutes 00, pointer 30° → 1:00; pointer 44° → 1:00; pointer 46° → 2:00.
    - minutes 30, pointer 30° (on the 1, a tie between 12:30 and 1:30) → 1:30.
    - minutes 30, pointer 0° (on the 12, a tie between 11:30 and 12:30) → 12:30.
    - minutes 30, pointer 350° → 11:30 (wraps without crossing into 12).
    - minutes 45, pointer 100° → 3:45 (hand at 112.5°, nearest to the pointer).
    - set 1:30 either way: hour to 1 then minutes to 30, or minutes to 30 then hour to 1, ends with the same Clock Time and hand angles (hour hand 45°).
  - **Time entry:** box selection, clearing, and reporting impossible values instead of a Clock Time.
  - **Task generation:** uniqueness, the Level step, no 12:00 in Drag Arrows, reproducible with a seeded random source.
  - **Teach flow:** wrong, then Hint, then help used, then right, with the Task ending as "helped".
  - **Test flow:** a wrong Answer moves on.
  - **Drag Numbers:** Teach rejection with neighbour hints, including the 12/1 wrap; Test swaps and Submit only when all 12 are placed.
  - **Summary:** grouping, with helped Tasks under Wrong and first Answers kept.
- **Vue component tests (Vitest + Vue Test Utils):**
  - **Clock face:** renders hand angles for a given Clock Time, emits drag events from simulated pointer events, and shows the right variant.
  - **Number pad:** emits keys, and Submit is disabled until the entry is complete.
  - **Progress dots:** colour by status.
  - **Hint panel:** appears only after a wrong try in Teach.
  - **Header:** switches language and theme.
- **Browser tests (Playwright), a handful of full flows on the built app, with touch and mouse:**
  - Welcome, then Settings, then a Teach Round of each Game, then the Summary.
  - A Test Round of Drag Arrows with one deliberately wrong Answer, which shows under Wrong in the Summary.
  - Leaving a Round mid-way returns to Settings.
  - Preferences survive a reload.
  - One offline check of the PWA.
- **Prior art:** none yet, since the repo has no code. The first rules-module tests set the pattern.

## Out of Scope

- Accounts, login, admin, roles; stored results, history or statistics; e-mail (ADR 0002).
- Telling the time in a foreign language / the 2019 LanguageTime game (ADR 0003).
- Timers, countdowns, scores beyond right/wrong counts.
- Sound and voice-over.
- 24-hour times, AM/PM, seconds hand.
- Automatic Level progression.
- App-store packaging (Capacitor) and any backend.
- Languages beyond Ukrainian and English.

## Further Notes

- The 2019 thesis and screenshots in `docs/original/` show the original mechanics only. Their stack, code, palette and art are not to be reused; all art is original SVG.
- A design prototype of every screen and Game comes before any code, and needs the user's approval for all features. If the design changes anything important, update this spec and the tickets before building.
- Suggested build order after design approval: the rules module first (it is most of the logic and fully testable), then
  1. Set Time,
  2. Drag Arrows,
  3. Drag Numbers,
  4. Summary,
  5. Preferences and themes,
  6. PWA.
