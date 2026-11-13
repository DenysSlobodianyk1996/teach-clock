# 02: The same popup in Drag Hours and Drag Minutes

Covers: P1, P2, P4

**What to build:** a wrong drop in Drag Hours or Drag Minutes opens the popup from ticket 01 instead of the pill and lightbulb above the face. The popup shows a small number face with the right slot lit and "7 goes between 6 and 8". Got it closes it (the number is back in the tray); Set correct answer places the number as the Place-It button did. The row above the face is removed, so the face never moves. See the spec.

**Blocked by:** 01

**Status:** done

- [x] `WrongAnswerPopup` takes a drag picture: a small `NumberFace` with the right slot lit in green showing its value (Hour Badges in Drag Minutes), its neighbours visible, and `numbers.between` as the line
- [x] `DragRound.vue`: a wrong drop opens the popup; `placeIt()` runs from Set correct answer (green flash, focus to the next tray tile); `.toast-row`, the Place-It button and the `NumberBoard` `.board.hinted` sizing are gone
- [x] Desktop and 4:3 too: the 48 px row above the face is gone; the face and tray use the freed room, and the face still never moves during a Round
- [x] Got it, Escape and the scrim close it; the number counts as helped either way; a new wrong drop opens it again
- [x] `numbers.placeIt` removed from `en.ts` and `uk.ts`
- [x] Vitest: `RoundView.spec.ts` Drag Hours, Drag Minutes and Place-It blocks rewritten against the popup
- [x] Playwright: `drag-hours-teach` and `drag-minutes-teach` use the popup buttons via `t`; `clock-stays-put` covers both drag Games on desktop and phone; the `fits-small-phone` tray check passes
- [x] All three themes; design boards `DragHoursTeachHint` and `DragHoursPlaceIt` replaced by a wrong-drop popup board for Drag Hours and Drag Minutes, desktop and phone (`DragHoursTeachWrong`, `PhoneDragHoursTeachWrong`; `DesktopDragMinutes` and `PhoneDragMinutes` now show the popup; the hint row is gone from `PhoneDragHours` and `theme.css`)
