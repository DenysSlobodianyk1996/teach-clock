# 02: Place-It button in Teach

Covers: C2

**What to build:** in Drag Numbers in Teach, a wrong drop shows the Hint toast "2 goes between 1 and 3", as it does now. Beside the toast, a round button with a lightbulb now appears: the **Place-It button**. Pressing it puts that number on its slot for the Player. The slot flashes green (`--good`) as the number lands, and the toast closes. The number counts as **helped** (wrong in the Summary), because the wrong drop already happened. If it was the last number, the Round ends as after any right drop.

The rules belong in `src/game/dragNumbers.ts`, for example a `placeForMe(round, number)` that returns the same `{ round, outcome }` shape as `dropNumber`. It must not change a number's status from `helped` to `right`. The view (`src/views/DragNumbersRound.vue`) calls it through the play store (`src/stores/play.ts`). The board (`src/components/NumberBoard.vue`) only shows the flash on the slot it is told about.

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] The button is shown only while a Hint shows, in Teach only; Test never shows it
- [ ] It is a 48 px round button to the right of the toast (on a phone too, and the face does not jump), drawn as an original SVG lightbulb (the Teach icon, `ModeIcon`)
- [ ] Its accessible name says which number it places, for example "Put 2 in its place"; it works with Enter and Space; uk and en text are added in `src/i18n/`
- [ ] Pressing it places the number, flashes its slot green, clears the Hint and the marked tray tile, and ends the Round if all 12 are placed
- [ ] The number ends as `helped`; a Summary after using it lists it under Wrong
- [ ] Rules tests in `src/game/__tests__/dragNumbers.spec.ts`: places only the hinted number, keeps `helped`, refuses in Test, refuses a number already placed, ends the Round on the last one
- [ ] Component or view test for show/hide and press; a Playwright Teach flow (`e2e/drag-numbers-teach.spec.ts`) using `t` for every text, desktop and phone
- [ ] The flash respects `prefers-reduced-motion` (a plain green ring, no animation)
- [ ] The design boards this changes (`DragNumbersTeachHint.dc.html`, `PhoneDragNumbers.dc.html`) are updated to match the app; ticket 03 does the final check
