# 03: Language menu

**What to build:** Tapping the header's round language button opens a dropdown of the languages on the list, each row showing its key and own name with the current one ticked. Choosing one switches the interface at once, closes the menu and is remembered. It ships with EN and УК and grows with the list.

**Blocked by:** 02 One language list

**Status:** done

- [x] The button shows the current language's key and opens the list instead of toggling
- [x] Rows follow the list's order and show key + own name, with the current language ticked
- [x] Choosing a language changes the interface immediately, closes the menu and persists
- [x] A tap outside or Escape closes the menu with no change
- [x] Keyboard users can open, move through and choose, and focus returns to the button
- [x] Screen readers get the button, the options and the selected language
- [x] With six rows, the menu stays fully visible and clear of the system bars at 320 × 640
- [x] Changing language wherever the button is available keeps the current Round and its progress
- [x] Works in the light and dark themes, in the Web App and Android App layouts
- [x] Playwright covers opening, choosing, dismissing, keyboard use and persistence
