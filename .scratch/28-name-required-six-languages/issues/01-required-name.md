# 01: Required name

**What to build:** On Welcome, Start is always enabled and the name label has a red asterisk. Starting with an empty or spaces-only name, by tap or Enter, marks the field red, focuses it and shows a short message under it. The first typed letter clears the error. A saved name still starts straight away.

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] Start never looks or behaves disabled, with or without a name
- [ ] The name label shows a red asterisk, readable in the light and dark themes
- [ ] Tapping Start with an empty name shows the red border and message and focuses the field
- [ ] Enter on an empty field behaves the same as tapping Start
- [ ] A name of only spaces counts as empty
- [ ] The first typed letter clears the border and message
- [ ] A prefilled saved name starts with no error
- [ ] Screen readers get the field as required and hear its error
- [ ] Welcome with the error showing does not scroll the app at 360 × 728, 360 × 640 or 320 × 640
- [ ] Label and message text exist in English and Ukrainian, looked up by key in tests
- [ ] Playwright covers tap, Enter, spaces-only, clearing and a saved name
