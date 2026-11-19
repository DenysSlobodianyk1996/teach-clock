---
title: Welcome, Settings and every Round fit one small phone screen
status: planned
labels: [ready-for-agent]
---

# Welcome, Settings and every Round fit one small phone screen

Terms follow [`GLOSSARY.md`](../../GLOSSARY.md). Raw input: [`request.md`](request.md).

## Problem Statement

On a small phone (the author's Oppo A series in Chrome, where the toolbars leave about 360 × 640 for the page), the Player has to scroll before they can go on:

- **Welcome**: a 230 px clock, the heading, a 30-word intro, the name field and then Start. Start can end below the screen, and the intro explains the four Games that Settings shows anyway.
- **Settings**: a greeting, four Game cards with icons and descriptions, two Mode cards with descriptions, then Level or Hours, then Back and Play. Play ends below the screen.
- **Set Time** (and any Round sized the same way): the clock is sized for a 360 × 720 phone, so on a shorter screen the page scrolls a little and Submit sits at the edge.

A child shouldn't have to find a hidden button by scrolling.

## Solution

On the phone layout, Welcome, Settings and every Round fit one screen of 360 × 640 or larger, up to their main button (Start, Play, Submit or Done), with nothing scrolled. On short screens the screen shows as much as fits: the clock takes the height left, and text that does not fit moves into an **Info Popup** behind an ⓘ by its heading. The Footer may sit just below the fold. Desktop doesn't change.

- **Welcome** on a phone: the heading "Привіт! Навчимося читати годинник" with an ⓘ after it, the name field and Start. The intro moves into the Info Popup. The clock shrinks to the height left.
- **Settings** on a phone: a smaller greeting; Game and Mode as compact cards (a small icon beside the title, no description), each heading with an ⓘ that opens that section's Info Popup; Level and Hours show their titles only.
- **Every Round** on a phone: the clock is as big as the height left allows, so Submit or Done is always on screen, in Teach and Test, also through the wrong-Answer popup.
- **Design**: the phone boards show the new layouts and the Info Popups at 360 × 640.
- **Play Store screenshots**: the store screenshots are portrait, so they get the phone layout too. All of them are redrawn (phone, 7-inch and 10-inch tablet, Ukrainian and English) and uploaded to the Play listing, so the store shows the app as it now looks.

## User Stories

1. As a Player on a small phone, I want to see the name field and Start without scrolling, so that I can begin right away.
2. As a Player on a small phone, I want the Welcome heading to greet me as before, so that the app still feels friendly.
3. As a Player on a small phone, I want the Welcome clock to shrink rather than push Start off the screen, so that the picture never hides the button.
4. As a parent on a small phone, I want an ⓘ by the Welcome heading, so that I can still read what the four Games are.
5. As a parent, I want the ⓘ on Welcome to open a popup with the intro and one Got it button, so that reading it never changes anything.
6. As a Player on a desktop, I want Welcome unchanged, so that the intro still shows beside the big clock.
7. As a Player on a small phone, I want every Settings choice and the Play button on one screen, so that I can pick and play without scrolling.
8. As a Player on a small phone, I want the Game cards to show their icon and name only, so that all four fit in two rows.
9. As a Player on a small phone, I want the Mode cards to show their icon and name only, so that Teach and Test fit side by side in one row.
10. As a Player on a small phone, I want an ⓘ by the Game heading, so that I can read what each Game asks of me.
11. As a Player on a small phone, I want an ⓘ by the Mode heading, so that I can read how Teach and Test differ.
12. As a Player, I want the Game Info Popup to list each Game by name with its description, so that I can compare them in one place.
13. As a Player who picked 13–24, I want the Drag Hours line in the Game Info Popup to say "13–24", so that it matches what I will place.
14. As a Player, I want the Mode Info Popup to list Teach and Test by name with their descriptions, so that I know what help I will get.
15. As a Player, I want an Info Popup to close with one Got it button and leave my Settings as they were, so that reading never picks anything.
16. As a Player on a small phone, I want Level to show "15 хв", "5 хв", "1 хв" only, so that the row stays short.
17. As a Player on a small phone, I want Hours to show "1–12" and "13–24" only, so that the row stays short.
18. As a Player on a small phone, I want my name in the Settings greeting, a bit smaller, so that it is still mine but leaves room for the cards.
19. As a Player on a small phone, I want Back and Play side by side and in view for every Game, so that the extra Level or Hours row never pushes them off.
20. As a Player on a desktop, I want Settings unchanged, with descriptions on the cards and no ⓘ, so that nothing I know moves.
21. As a Player on an upright tablet, I want the same phone layout, so that the tablet also shows as much as fits.
22. As a Player in Set Time on a small phone, I want the clock, the time boxes, the pad and Submit on one screen, so that I never scroll to check my Answer.
23. As a Player in Drag Arrows on a small phone, I want the clock and Submit on one screen, so that I can drag and check without scrolling.
24. As a Player in Drag Hours on a small phone, I want the face, the tray and Done on one screen, so that I can place every number without scrolling.
25. As a Player in Drag Minutes on a small phone, I want the face, the tray and Done on one screen, so that I can place every minute without scrolling.
26. As a Player in Teach on a small phone, I want Submit or Done to stay on screen through the wrong-Answer popup, so that I can try again straight away.
27. As a Player on a taller phone, I want the clock to grow into the room there is, so that a bigger screen still gets a big clock.
28. As a Player on a very short screen, I want the clock never smaller than about 150 px, so that it stays readable.
29. As a Player using a screen reader, I want each ⓘ named as an info button and the Info Popup announced as a dialog, so that I can reach the hidden text.
30. As a Player using a keyboard, I want the ⓘ to be focusable and the Info Popup to close with Escape, as other popups do, so that I am never trapped.
31. As an English-speaking Player, I want the ⓘ, the Info Popups and their headings in English, so that the phone layout works in both languages.
32. As the author, I want the phone design boards to show the new Welcome, Settings and Round layouts and both Info Popups at 360 × 640, so that the design matches the app.
33. As a parent browsing Google Play, I want the phone screenshots to show the new Welcome, Settings and Rounds, so that what I install looks like what I saw.
34. As a parent browsing Google Play on a tablet, I want the 7-inch and 10-inch screenshots redone too, so that they also match the app.
35. As a Ukrainian or English-speaking parent, I want the screenshots in my language redone, so that both listings are up to date.
36. As the author, I want the screenshots to show the main screens with nothing cut off and no Info Popup covering them, so that the listing sells the Games rather than the help text.
37. As the author, I want a short checklist of what to upload where in Play Console, so that I replace every old screenshot and none are left behind.

## Implementation Decisions

- **One rule, the existing breakpoint.** Everything here applies inside the shared `--phone` custom media (upright phone, upright tablet, any portrait window, sideways phone). No new breakpoint. The desktop layout is untouched.
- **Fit by height.** On the phone layout, sizes that can give (the Welcome clock and every Round's clock) take the height left after everything else, measured in dynamic viewport units (`dvh`), so the browser's toolbars are accounted for. Each has a floor: about 120 px on Welcome and about 150 px in a Round. The existing Round sizing (a `clamp` with a height budget calibrated on 360 × 720) is recalibrated so Submit or Done is in view at 360 × 640 in all four Games. Prefer a layout where the clock is the flexible part of the column over hand-tuned pixel budgets, where the existing structure allows it.
- **The Footer** stays where it is, after the main button. It may be below the fold.
- **Info Popup** (new term in the glossary): a small component built on the existing `PopupDialog`, like the Filled Clock and the leave-Round dialog. It takes a heading and a list of items (name and description, or a single paragraph) and has one Got it button. It changes no state. The ⓘ that opens it is an original SVG icon button with an accessible name ("Докладніше" / "More info"; final wording in i18n), shown on the phone layout only.
- **Welcome on a phone:** the intro paragraph is hidden; an ⓘ after the heading opens an Info Popup headed by the Game Name or the Welcome heading, holding the existing intro text. The text key stays (desktop uses it).
- **Settings on a phone:**
  - Card descriptions are hidden in every section. `ChoiceCard` keeps its description for desktop; the phone layout hides it, as Level already does today.
  - Game and Mode headings each get an ⓘ. The Game Info Popup lists the four Games' names and descriptions, with the Drag Hours line filled from the picked Hours, as the card is. The Mode Info Popup lists Teach and Test. Text only, no icons. They reuse the existing `games.*` and `modes.*` keys.
  - Game and Mode cards become one compact row each: a ~36 px icon beside the title, less padding. Game stays 2×2; Mode stays two side by side.
  - Level and Hours: titles only, no ⓘ.
  - The greeting stays, at about 22 px.
- **New interface text** (uk and en): the ⓘ accessible name and the Got it label. Reuse the existing Got it key if there is one.
- **Desktop and sideways:** the desktop layout is untouched. The sideways phone layout follows the same `--phone` rules and must not get worse. Existing sideways checks keep passing.
- **Design sync (last ticket):** update the phone boards in `docs/design/` (Welcome, Settings, Set Time, Drag Arrows, Drag Hours, Drag Hours 13–24, Drag Minutes) and add boards for Welcome with its Info Popup, Settings with the Game Info Popup, Settings for Drag Hours (with Hours) and Settings for Set Time (with Level), all at 360 × 640; put them on the gallery and the online design canvas. Update the product brief, the batch index row and the CLAUDE.md status.
- **Play Store screenshots (own ticket, after the layout tickets):**
  - The store script shoots the Android build in portrait at 468 × 832 (phone), 608 × 1080 (7-inch) and 810 × 1440 (10-inch), so every size now gets the phone layout. Rerun it for all three sizes and both languages: the same 8 shots each (Welcome, Settings, Set Time Teach and Test, Drag Arrows Teach, Drag Hours Test, Drag Minutes Teach, Summary), same file names, 48 PNGs in all.
  - Adjust the script where the new layout needs it (for example a Round now reached with less scrolling, or the clock sized differently) so each shot still shows its moment in full. The shots show the screens themselves; no Info Popup open.
  - Look at every new shot before committing: nothing cut off, nothing awkwardly empty on the taller store sizes. If a tall store size looks empty because the phone layout no longer fills it, the layout tickets get the fix (the clock grows into the room), not the script.
  - The feature graphic is drawn from its own SVG, not from the screens, so it is not redrawn.
  - Uploading is a step only the author can do: the ticket ends with the exact Play Console steps (Main store listing, each language, phone, 7-inch and 10-inch screenshots: delete the old 8, add the new 8 in order), added to the store docs if they are not already there. The new screenshots go to the listing after the app update with the new layout reaches the same track.

## Testing Decisions

- **A good test checks what the Player sees**: a button inside the screen, a popup's text, a choice left unchanged. Never class names, CSS values or component internals. Interface text is looked up by key with `t` (`src/test/i18n.ts` in Vitest, `e2e/i18n.ts` in Playwright); Player names stay literal.
- **Seam 1, the browser (Playwright):** only a browser can measure layout, so every "fits" check lives here, in the existing small-phone suite (`e2e/fits-small-phone.spec.ts`, which already sets a 360 × 640 viewport and has `bottomFromPageTop` and `sidewaysScroll`). At 360 × 640, with nothing scrolled:
  - Welcome: Start ends within the screen; the intro text is not visible; the ⓘ opens the Info Popup with the intro, and Got it closes it.
  - Settings, for each of the four Games (so both the Level and the Hours row are covered): Play ends within the screen and Back and Play sit side by side; no description is visible; each ⓘ opens its Info Popup and Got it leaves the picked Game and Mode unchanged.
  - Each Game's Round in Teach and Test: Submit or Done ends within the screen, also with the wrong-Answer popup open in Teach.
  - The existing 360 × 720, 320-wide and 768 px checks keep passing.
  - Desktop: one check that Welcome and Settings show their descriptions and no ⓘ.
- **Seam 2, the view component tests (Vitest):** the existing `SettingsView.spec.ts` (and a new `WelcomeView.spec.ts` next to it) check the Info Popups' content: the Game Info Popup lists all four Games, the Drag Hours line follows the picked Hours (1–12 or 13–24), the Mode one lists Teach and Test, and Got it changes no Settings. Prior art: `WrongAnswerPopup.spec.ts`, `LeaveRoundDialog.spec.ts`.
- No new seam. No unit tests for CSS.
- **Store screenshots are not tests.** The store script is run by hand and its output is checked by looking at the 48 PNGs. It must still finish without errors in both languages and all three sizes.

## Out of Scope

- A short desktop window (wide but short, such as a 1280 × 650 laptop): it keeps the desktop layout and may still scroll. That could be a later batch.
- New breakpoints, or a separate "small phone" layout.
- The Summary screen and the Privacy Page.
- Moving or shrinking the Footer, the header or the theme and language toggles.
- Changing any game rule, Settings default or text other than the new ⓘ and Info Popup strings.
- Redrawing the feature graphic or the app icon, and changing the store listing text.
- Adding new store screenshots (such as one with an Info Popup open) or changing which moments the 8 show.

## Further Notes

- Tablets in portrait get the phone layout by the existing breakpoint. The author accepted that: on any short screen, show as much as fits.
- The Info Popup is not a Hint: it never helps with a Task and appears only on Welcome and Settings.
