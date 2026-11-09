# 05: Drag Arrows: show the tick a dragged hand lands on

Covers: A1

**What to build:** while a hand is dragged on the Drag Arrows clock, the tick it will land on lights up: a ring on the snapped minute (Minute Hand) or on the hour's number (Hour Hand). It clears on release. The hands stay plain lines with the 48 px drag circle at the tip, as before.

Arrowheads at the hand tips were tried and dropped after review: the lit tick is enough.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] While dragging, the tick for the snapped minute (Minute Hand) or hour (Hour Hand) is highlighted; it clears on release
- [x] The highlight is drawn over the hands, so the drag circle never hides it, and it ignores the pointer
- [x] The highlight reads clearly in all three themes
- [x] Clock face component tests cover the highlight
- [x] Product brief (Drag Arrows: how the hands move) says the target tick lights up while dragging
