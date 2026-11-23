# 01: Required name

**What to build:** On Welcome, Start is always enabled and the name label has a red asterisk. Starting with an empty or spaces-only name, by tap or Enter, marks the field red, focuses it and shows a short message under it. The first typed letter clears the error. A saved name still starts straight away.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Start never looks or behaves disabled, with or without a name
- [x] The name label shows a red asterisk, readable in the light and dark themes
- [x] Tapping Start with an empty name shows the red border and message and focuses the field
- [x] Enter on an empty field behaves the same as tapping Start
- [x] A name of only spaces counts as empty
- [x] The first typed letter clears the border and message
- [x] A prefilled saved name starts with no error
- [x] Screen readers get the field as required and hear its error
- [x] Welcome with the error showing does not scroll the app at 360 × 728, 360 × 640 or 320 × 640
- [x] Label and message text exist in English and Ukrainian, looked up by key in tests
- [x] Playwright covers tap, Enter, spaces-only, clearing and a saved name
