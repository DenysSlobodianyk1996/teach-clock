# 03: Language menu

**What to build:** Tapping the header's round language button opens a dropdown of the languages on the list, each row showing its key and own name with the current one ticked. Choosing one switches the interface at once, closes the menu and is remembered. It ships with EN and УК and grows with the list.

**Blocked by:** 02 One language list

**Status:** todo

- [ ] The button shows the current language's key and opens the list instead of toggling
- [ ] Rows follow the list's order and show key + own name, with the current language ticked
- [ ] Choosing a language changes the interface immediately, closes the menu and persists
- [ ] A tap outside or Escape closes the menu with no change
- [ ] Keyboard users can open, move through and choose, and focus returns to the button
- [ ] Screen readers get the button, the options and the selected language
- [ ] With six rows, the menu stays fully visible and clear of the system bars at 320 × 640
- [ ] Changing language wherever the button is available keeps the current Round and its progress
- [ ] Works in the light and dark themes, in the Web App and Android App layouts
- [ ] Playwright covers opening, choosing, dismissing, keyboard use and persistence
