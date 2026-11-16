# Request

From the author, 2026-11-16 (screenshot: `images/00-chips-today.png`):

> This summary place. We can show correct places on clock filled green. Instead of just numbers. You can create scratch 15. So this is valid for drag hours / minutes.

Today: in Teach, the Summary of Drag Hours and Drag Minutes lists the right numbers in the **Правильно** card as orange chips (14, 15, 16…), with no clock.

## Decisions (grilling, 2026-11-16)

1. Teach only. Test already shows the Player's face next to the correct one; it does not change.
2. Drag Hours (1–12 and 13–24) and Drag Minutes alike.
3. The **Правильно** card shows one face instead of the chips: each right number on its own slot, its tile filled green. The chips are gone; a screen reader still hears "Правильно: 14, 15, …".
4. The slots of the numbers under **Потренуймо ще** (wrong or helped) stay empty dashed rings, so the gaps match that list.
5. The face is the size of the Test Summary faces, with the Hour Badges in Drag Minutes and 13–24, and is all green after a perfect Round.
6. The **Потренуймо ще** card does not change.

Board: `docs/design/project/SummaryDragHoursTeach.dc.html` (rendered: `images/01-right-on-face-board.png`).
