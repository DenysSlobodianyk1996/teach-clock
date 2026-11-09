# 05: Light up where the hands point, in Drag Arrows and Set Time

Covers: A5, A6

**What to build:** the clock highlights the place each hand points to, always, in both Games and both Modes. The Minute Hand's tick takes the Minute Hand's colour, gets a little thicker and glows. The Hour Hand lights its number (the hour it has passed: at 2:55 the 2) in the Hour Hand's colour with a glow. This replaces today's ring, which shows only while dragging and overlaps the minute grip (see `../images/05-drag-arrows-target.png`). In Drag Arrows the highlight follows the hands as they are dragged; the hands start at 12:00, so the 12 is lit at the start. Grips stay where they are.

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] The ring is gone; nothing overlaps the grips
- [ ] Set Time: the minute tick and hour number the hands point to are lit, in Teach and Test
- [ ] Drag Arrows: the lit tick and number follow the hands while dragging and stay lit after letting go
- [ ] At 3:15 the minute tick at 3 and the number 3 are both lit and readable
- [ ] Which tick and number are lit is worked out in plain TypeScript (ADR 0001), with unit tests
- [ ] Looks right in the three themes; Summary and popup clocks show no highlight
