# Spec: required name and six languages

Status: ready-for-agent

## Problem Statement

A Player who opens Teach Clock sees a dim Start button on Welcome. It looks broken, and a small child has no way to know that a name is what is missing.

The game speaks only Ukrainian and English. A family in Germany, France, Italy or Spain gets English, in the interface and in the Play listing, and a tester asked for German directly. The header's language control is a two-way toggle, so it cannot offer more languages.

The author also keeps store assets in a mixed layout: language is a filename suffix for some files, a folder for others, and sits under the device for tablets. Adding four languages to that layout would make it hard to find and upload the right files.

## Solution

Start is always enabled, and the name label carries a red asterisk. Starting with an empty name marks the field red, puts focus in it and says briefly that a name is needed. The error goes away as soon as the Player types.

Teach Clock is available in English, Ukrainian, German, French, Italian and Spanish. Tapping the header's language button opens a list of the six, each shown by its key and its own name, with the current one ticked. The game follows the device language when it is on the list and falls back to English, and a language the Player picks is remembered.

Everything a Player or parent sees follows: the Game Name, the installed app's name, the Privacy Page, and the Play listing with its feature graphic and screenshots. Store assets are grouped into one folder per language, with plain filenames.

## User Stories

### Required name

1. As a Player, I want the Start button to look ready at all times, so that I do not think the game is broken.
2. As a Player, I want a red asterisk on the name label, so that I can see the name is required before I try to start.
3. As a Player, I want tapping Start with no name to show me the name field in red, so that I know where the problem is.
4. As a Player, I want focus to move to the name field after that tap, so that I can start typing straight away.
5. As a Player on a phone, I want the keyboard to be ready for the name field after the error, so that I need no extra tap.
6. As a Player, I want a short message under the field, so that I understand what I need to do.
7. As a Player, I want the error to clear on my first typed letter, so that the screen confirms I am fixing it.
8. As a Player, I want pressing Enter on an empty field to behave the same as tapping Start, so that both ways of starting are consistent.
9. As a Player, I want a name of only spaces to count as empty, so that I cannot start with a blank name.
10. As a returning Player, I want my saved name prefilled, so that I can tap Start without seeing an error.
11. As a Player using a screen reader, I want the field announced as required and its error announced, so that I get the same explanation.
12. As a Player on a 320 × 640 phone, I want the error message to fit without the app scrolling as a whole, so that Welcome stays one screen.
13. As a Player in any of the six languages, I want the label and error in my language, so that I can understand them.
14. As a Player using either theme, I want the red asterisk, border and message to be readable, so that the error is clear in light and dark.

### Language choice

15. As a Player, I want tapping the language button to open a list of languages, so that I can reach any language in one more tap.
16. As a Player, I want the languages in the order EN, УК, DE, FR, IT, ES, so that the list is the same every time.
17. As a Player, I want each row to show a key and the language's own name, so that I can find my language even when the interface is in another one.
18. As a Player, I want the current language ticked, so that I can see which one is in use.
19. As a Player, I want the header button to show the current language's key, so that I can see it without opening the list.
20. As a Player, I want choosing a language to change the interface immediately and close the list, so that I see the result at once.
21. As a Player, I want a tap outside the list to close it without a change, so that I can back out.
22. As a keyboard Player, I want to open, move through, choose from and Escape out of the list, so that it works without touch.
23. As a Player using a screen reader, I want the button and options announced with the selected language, so that I can use the list.
24. As a Player on a small phone, I want the whole list visible and clear of the system bars, so that every language is reachable.
25. As a Player in the middle of a Round, I want changing language not to reset my Round, if the language button is available there, so that I do not lose progress.
26. As a new Player whose device prefers a listed language, I want the game to open in it, so that I need no setup.
27. As a new Player whose device has several languages, I want the first listed one used, so that my preference order is respected.
28. As a new Player whose device has no listed language, I want English, so that the game has a sensible default.
29. As a Player who picked a language, I want it remembered across visits, so that I do not choose it again.
30. As an existing Player with Ukrainian or English saved, I want to keep it after the update, so that the game does not change language unexpectedly.
31. As a Player, I want the correct language from the first paint, so that the page does not flash another language.

### Six complete languages

32. As a German, French, Italian or Spanish Player, I want every screen, popup, Hint and Summary in my language, so that I can play without English.
33. As a Player, I want the clock's hands and numbers named in the normal words of my language, so that what I learn carries over to real life.
34. As a Player, I want messages with numbers to read correctly, including 1 and other counts, so that the game does not teach bad grammar.
35. As a Player of Drag Hours in 13–24, I want the halves of the day described naturally in my language, so that the Hour Badges make sense.
36. As a Player on a 360 × 640 phone, I want longer German or French text to fit Welcome, Settings, every Round and the Summary, so that controls are not clipped.
37. As a Player, I want Settings cards and buttons to keep long words inside them, so that text never overflows.
38. As a Player, I want accented letters and ß to look like the rest of the text, so that the interface looks finished.
39. As a French Player, I want normal French punctuation, so that the text reads correctly.

### Game Name and installed app

40. As a Player, I want the Game Name in my language, so that the game feels made for me: Uhr lernen, Apprendre l'heure, Impara l'ora, Aprende la hora.
41. As an Android App user, I want the app name to follow my phone's language, so that I recognise it on my home screen.
42. As a Web App user, I want the installed name to be the one in the interface language at install time, so that the existing behaviour holds for all six.
43. As a Player, I want the browser tab title in my language, so that the Game Name is consistent.

### Privacy Page

44. As a parent, I want the in-app Privacy Page in the interface language, so that I can read what the game does with data.
45. As a parent, I want its dates in that language, so that the page reads naturally.
46. As a parent on the public page, I want links at the top to all six languages, so that I can jump to mine.
47. As the author, I want the public address to stay the same, so that the link in Play Console keeps working.
48. As a parent, I want the public page to work without JavaScript, so that it stays readable anywhere.

### Store assets

49. As the author, I want one folder per language in the store folder, so that everything for one Play listing is together.
50. As the author, I want each folder to hold the listing, feature graphic, phone, tablet-7 and tablet-10 screenshots, so that uploads follow one pattern.
51. As the author, I want filenames without language keys, so that the folder alone says the language.
52. As the author, I want the icon, feature graphic template and closed-test tracker to stay in the store root, so that language-neutral files have one copy.
53. As the author, I want tester notes only for English and Ukrainian, so that I do not maintain text the existing testers do not need.
54. As a German, French, Italian or Spanish parent, I want a Play listing in my language, so that I can decide whether to install.
55. As such a parent, I want screenshots and a feature graphic in my language, so that the listing shows what I will get.
56. As the author, I want one command to regenerate all screenshots and graphics into the new tree, so that a UI change never needs manual sorting.
57. As the author, I want listings checked against Play's limits, so that an upload is not rejected.
58. As the author, I want the release wizard to show the correct paths for each language, so that I can follow it in Play Console.
59. As a Player on closed testing or production, I want release notes in my language, so that I understand the update.

### Translation review

60. As the author, I want a list of the phrases that most need a native check, so that a later review starts with clock words and Privacy text.

### Follow-ups from review and desktop testing

61. As a Player, I want keys pressed in the open language menu to stay in the menu, so that I cannot change or submit my Answer behind it.
62. As a Player, I want the language menu to close when the screen changes, so that it never covers the next screen.
63. As a Player, I want each language on one line in the menu, so that the list is easy to scan.
64. As a Player on a desktop, I want the game to fill my window, with the content kept to a comfortable 1200 px, so that there is no empty band or scrollbar in the middle of the screen.
65. As a Player in a wide, low window, I want the Round's clock to fit the height, so that I can see it whole.
66. As a Player, I want the name field to have one border, red for an error and yellow while I am in the field, so that its state is clear.

## Implementation Decisions

- **Scope:** one batch on one integration branch, one PR to main. The how-to-play demo is not part of it.
- **Required name:** the existing non-empty-after-trim rule stays the single rule. Start is no longer disabled; the start action either proceeds or enters an error state. Native form submission keeps Enter and Start on one path. The error state clears on input. The field exposes required and invalid state and links to its message.
- **One language list:** a single ordered list of supported languages, EN, УК, DE, FR, IT, ES, drives messages, the menu, detection, the first-paint script, manifests, Privacy output, store generation and test loops. The first-paint script cannot import app modules, so the build injects the list.
- **Language names and keys:** these are the same in every interface language, so they live once beside the language list instead of being repeated in each message file.
- **Detection:** first device language whose base language is on the list, else English. A saved choice wins. Existing saved Ukrainian or English values remain valid.
- **Language menu:** a dropdown anchored to the existing round header button, replacing the toggle. It follows the menu-button pattern for keyboard and screen readers, and keeps inside the safe area.
- **Messages:** all six languages stay statically bundled, because first paint is synchronous and the full text is small. Each new message file must have the same shape as the Ukrainian source.
- **Grammar:** no plural system is introduced. Strings that place `{hour}`, `{number}` or a count are worded to avoid article, elision and count agreement. The existing English "1 minutes" error is fixed.
- **Clock vocabulary:** de `kleiner / großer Zeiger`, fr `petite / grande aiguille`, it `lancetta`, es `manecilla`. The two halves of a day are worded naturally per language, not translated literally from "доба".
- **Layout:** long-word handling and compact phone styling are fixed at shared level, with German as the first stress test. The no-app-scroll contract does not change.
- **Game Names:** Teach Clock, Вчимо годинник, Uhr lernen, Apprendre l'heure, Impara l'ora, Aprende la hora. The name is never shortened. ADR 0005 is amended from a two-language rule to the shared list and fallback.
- **Privacy:** the in-app screen renders only the interface language. The static page renders all six texts with language links at the top, without JavaScript, at the unchanged public address. Dates keep the deterministic hand-written month tables instead of `Intl`, so Node and the app print identical text.
- **Store tree:** the root keeps the icon, feature graphic template and closed-test tracker. Each language folder holds `listing.md`, `feature-graphic.png`, `phone/`, `tablet-7/` and `tablet-10/`. English and Ukrainian also hold `testers.md`. Existing files are moved so their history follows them.
- **Store generation:** the store-shots flow, feature graphic, listing checks and release wizard read the same language list and write only the new tree. The feature graphic's title must fit its two lines for each Game Name.
- **Release notes:** the Android workflow supplies notes for all six Play locales.
- **Translations:** drafted by Claude and shipped in this batch. A review list in the batch folder records clock vocabulary, the day-half labels, Game Names, listings and Privacy text for a later native check.
- **Release effect:** merging changes that touch build scripts triggers a signed upload to Play closed testing. New listings and images are added in Play Console by hand.
- **Language menu width:** no fixed width. The menu is as wide as its longest row, and every row stays on one line.
- **Desktop layout (amended after the first build):** above 768 px the play area fills the window under the header. The 4:3 card capped at 1024 px is removed. A screen's content stops at 1200 px, centred with free space left and right, while `<main>` stays full width so its scrollbar is at the window's edge. The header's brand and tools line up with that column. The cap is 1200 px rather than 1440, so the clock (at most 540 px) stays in proportion to the fixed-size text in every Game. Below 1100 px the Settings Game cards go two by two, and a Round's clock is limited by the height as well as the width.
- **Name field border:** one border, with no focus outline around it. Red with an error, yellow while focused, even with the error showing.

## Testing Decisions

- A good test drives what a Player or author can observe and survives a refactor. It looks up interface text by key, keeps Player names literal and does not assert internal state or CSS classes unless the visual state is the behaviour.
- **Seam 1, Playwright through the real app:** required-name flow, language menu, device language and fallback, persistence, first paint, Privacy Page, and fit at 360 × 728, 360 × 640 and 320 × 640 in all six languages. Prior art: the welcome-to-round, language, preferences, privacy, no-app-scroll and fits-small-phone specs.
- **Seam 2, Vitest on language data:** the ordered language list, device-language resolution, and every language having every key with the same placeholders. Prior art: the device-locale and messages specs.
- **Seam 3, Vitest on generated outputs:** web manifests, Android names, Privacy output, store listings and limits, and feature graphics. Prior art: the web manifest, Android name, privacy, store-listing and feature-graphic tests.
- Tests that use German as the unsupported language move to a language that stays unsupported, such as Polish.
- Test helpers become locale-driven, so a new language joins the loops through the shared list.
- No new test seams are introduced.
- Tickets 10–13 are checked only with the specs they touch, by the author's choice. The full suites are not rerun after the review fixes.

## Out of Scope

- The how-to-play GIF, video or demo.
- Languages beyond the six.
- Automatic upload of store listings or images to Play.
- Translated tester notes for DE, FR, IT and ES.
- Native review itself, which follows this batch.
- A plural-rules system in i18n.
- Changes to game rules, Modes, Levels or the Summary beyond their text and fit.

## Further Notes

- A Player from before batch 13 may have an auto-saved Ukrainian value that cannot be told apart from a real choice. They stay in Ukrainian and can now switch with the menu.
- CI runs neither Vitest nor Playwright, so the batch's local checks are the safety net for moved store paths.
- The Ukrainian Play title is already at 30 of 30 characters, so new titles need checking against the same limit.
- Ticket order: required name; remove two-language assumptions; language menu; German and layout; French, Italian, Spanish; Game Names; Privacy; regroup store; store assets; sync docs.
- Follow-up tickets: 10 review fixes; 11 language menu on one line; 12 desktop fills the window; 13 one border on the name field; 14 store and design after the desktop layout.
