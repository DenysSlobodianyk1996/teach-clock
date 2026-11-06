# 05: Drag Arrows: arrowheads that show where a hand lands

**What to build:** each hand ends in a small arrowhead that touches the exact spot on the face's edge it points at: the Minute Hand reaches the minute ticks, the Hour Hand its hour position. The hands look like this on every clock (Drag Arrows, Set Time, the correct-answer popup, the Summary). On the draggable clock, the 48 px drag circle stays but moves 5–10 px towards the centre, so it sits behind the arrowhead, and while a hand is dragged the tick it will land on lights up.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Both hands end in an arrowhead at their exact Clock Time position, on every clock
- [ ] The drag circle keeps its 48 px touch area and sits 5–10 px nearer the centre than today
- [ ] While dragging, the tick for the snapped minute (Minute Hand) or hour (Hour Hand) is highlighted; it clears on release
- [ ] Highlight and arrowheads read clearly in all three themes
- [ ] Clock face component tests cover the arrowheads and the highlight
