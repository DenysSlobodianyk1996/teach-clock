# 04: The clock stays put during a Round

**What to build:** the clock never jumps up or down during a Round, in every Game and both Modes. Anything that appears above or below the clock has its space reserved from the first Task, empty until it is needed. Seen today: in Drag Arrows Teach the "Set correct answer" panel and the Hint push the clock up; in Drag Numbers Teach the Hint "7 goes between 6 and 8" pushes the clock down.

**Blocked by:** 03 (the new tray size changes the layout this ticket pins)

**Status:** ready-for-agent

- [ ] Drag Arrows and Set Time, Teach: the clock stays in place when the Hint panel appears
- [ ] Drag Numbers, Teach: the clock stays in place when a Hint appears and goes
- [ ] Drag Numbers, Test: the clock stays in place as the tray empties and Submit appears
- [ ] Set Time: the clock stays in place when the error under the time boxes appears
- [ ] Playwright measures the clock's position before and after each case, on desktop and phone
- [ ] Product brief (Look) says the clock never moves during a Round
