# Request

From the author, 2026-11-16:

> I have some feeling that drag numbers process itself works but with bugs. I need you to test drag & drop process with all possible cases. Drag drop number nearby in each corner etc. In teach mode, I put in wrong place, circle moved back, I move it again to correct place, but it jumps back again, even I drop it in the middle of circle, where it should be.

## What the probe found (2026-11-16)

Drags were driven in Chromium (desktop, Pixel 7, 360 × 720, with real touch events) and WebKit (desktop
Safari): wrong drop → popup closed by Got it, the scrim or Escape → drag again, with every number, Drag
Hours 1–12, 13–24 and Drag Minutes, fast and slow drags, off-centre drops, slips as the finger lifts, a
hover sweep of the whole face, long presses, the eye popup, and Test moves. A right drop after a wrong one
always held. Two things did make a number jump back:

1. **A second finger steals the drag.** While one finger drags a tile onto its own slot, a second touch on
   another tray tile (the hand holding the phone) took over the drag, and the first tile went back to the
   tray when lifted dead centre on its slot.
2. **A drop on a filled slot went back silently in Teach.** No popup, no hint: it looked like the jump
   back the author describes.

The author approved fixing both. A jump back seen with a mouse on desktop did not reproduce; it stays open
until it can be watched live.

## Decisions

1. While a drag is held, a press by any other, non-primary pointer is ignored.
2. In Teach, a drop on a filled slot is a wrong drop like any other: back to the tray, the popup with the
   neighbour hint, and the number ends helped. The filled slot rings while the tile is over it.
