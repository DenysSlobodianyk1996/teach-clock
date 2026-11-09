# 04: The clock stays put during a Round

Covers: A4

**What to build:** the clock never jumps up or down during a Round, in every Game and both Modes. Anything that appears above or below the clock has its space reserved from the first Task, empty until it is needed. Seen today: in Drag Arrows Teach the "Set correct answer" panel and the Hint push the clock up; in Drag Numbers Teach the Hint "7 goes between 6 and 8" pushes the clock down. See `../images/04-drag-arrows-hint-under-clock.png` and `../images/04-drag-numbers-hint-above-clock.png`.

**Blocked by:** 03 (the new tray size changes the layout this ticket pins)

**Status:** done

- [x] Drag Arrows and Set Time, Teach: the clock stays in place when the Hint panel appears
- [x] Drag Numbers, Teach: the clock stays in place when a Hint appears and goes
- [x] Drag Numbers, Test: the clock stays in place as the tray empties and Submit appears
- [x] Set Time: the clock stays in place when the error under the time boxes appears
- [x] Playwright measures the clock's position before and after each case, on desktop and phone
- [x] Product brief (Look) says the clock never moves during a Round
