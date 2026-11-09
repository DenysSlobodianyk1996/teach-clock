# 01: Lit Place in Teach only

Covers: B3

**What to build:** the Lit Place (batch 03, ticket 05) shows only in Teach. In Test, in Set Time and Drag Arrows, the clock lights no tick and no number, before or after dragging. Teach keeps today's behaviour: always lit, following the hands while dragging. See `../images/01-set-time-test-lit.png` (Set Time in Test with the 9 lit).

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Set Time and Drag Arrows in Test: no lit tick or number at any point in the Round
- [x] Set Time and Drag Arrows in Teach: lit as today
- [x] Component tests cover both Modes in both Games
- [x] Product brief says the Lit Place is a Teach help
- [x] After the fix, the design boards this ticket changes are updated to match the app (`docs/design/project/*.dc.html`, shared styles in `docs/design/project/theme.css`); ticket 03 does the final check and republishes the canvas (Test boards changed: SetTimeTest, DesktopSetTime, DragArrowsTest, PhoneDragArrows)
