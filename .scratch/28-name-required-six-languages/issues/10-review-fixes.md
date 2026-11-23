# 10: Code review fixes

**What to build:** Fix what the batch's code review found. The open language menu never acts on the Round behind it, closes when the screen changes and survives a held Enter. A space does not clear the name error, and the public Privacy Page's language links are labelled for all six languages.

**Blocked by:** 01, 02, 03, 04, 05, 06, 07, 08, 09

**Status:** done

- [x] Keys pressed in the open menu do not reach the Round's Answer
- [x] Clicking the menu's padding keeps focus in it, so Escape and the arrows still work and Enter cannot submit the Answer
- [x] Any navigation, including browser Back, closes the menu without moving focus to the button
- [x] Holding Enter on the language button does not open and immediately close the menu
- [x] A space keeps the name error; a letter clears it
- [x] The public Privacy Page's language links have a label covering all six languages, with no JavaScript
- [x] `startRound` in `e2e/round.ts` waits for the Round, removing the race behind the flaky `e2e/system-bars.spec.ts:153`
- [ ] The flaky test's fix is confirmed by running `e2e/system-bars.spec.ts` in its `small-phone` project

**Checked:** type-check, the CSS floor and Welcome unit tests, and the language menu and required name specs on the phone project. By the author's choice, the full suites were not rerun after these fixes.
