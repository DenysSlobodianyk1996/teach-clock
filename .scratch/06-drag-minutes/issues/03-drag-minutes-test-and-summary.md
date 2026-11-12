# 03: Drag Minutes in Test, and its Summary

Covers: D2, D3

**What to build:** Drag Minutes in Test works the same as Drag Hours in Test: the Player moves minutes freely and sees no feedback, and Submit appears once all 12 are on the face. The Summary shows the Player's face next to the correct one. Both faces show minute tiles and the Hour Badges.

**Blocked by:** 02

**Status:** todo

- [ ] Test: free moves, swaps and back-to-tray work with minute tiles; no Hint and no Place-It button; Hour Badges still shown
- [ ] Submit appears at 12 placed and scores each minute by its slot
- [ ] Summary (Test): the Player's face and the correct face, with misplaced minutes marked as in Drag Hours, both with Hour Badges; the header line names Drag Minutes
- [ ] Summary faces stay readable at the bigger Summary size on desktop and phone
- [ ] Rules, Summary and view tests; a Playwright Test flow ending in the Summary, desktop and phone
- [ ] New or changed design boards (Drag Minutes Test, Summary for Drag Minutes); ticket 04 does the final check
