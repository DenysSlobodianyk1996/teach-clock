# 03: Drag Numbers: one number size

**What to build:** a number looks the same size wherever it is: in the tray, under the finger while dragged, and placed on the face. The size follows the clock, so on a phone the numbers are smaller than on a desktop. Each number in the tray keeps a 48 px tap area, so small fingers still grab the right one.

**Blocked by:** 02 (same board; avoids two branches changing it at once)

**Status:** done

- [x] Tray numbers, the dragged number and placed numbers have the same visible diameter, on desktop and phone
- [x] Each tray number can be grabbed anywhere in a 48 × 48 px area, and the tray spaces numbers so these areas don't overlap
- [x] The tray still fits next to (desktop) or under (phone) the clock without scrolling sideways
- [x] Playwright checks the sizes match on desktop and phone
