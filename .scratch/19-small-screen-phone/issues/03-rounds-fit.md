# 03: Every Round fits a small phone

**Blocked by:** none (can start immediately)

**Status:** todo (ready-for-agent)

**What to build:** on the phone layout, every Game's Round fits a 360 × 640 screen with nothing scrolled. The clock takes the height left after the header, the progress dots and the answer area (sized in dynamic viewport units), never below about 150 px, so Submit (Set Time, Drag Arrows) or Done (Drag Hours, Drag Minutes) is always in view, in Teach and in Test, also with the wrong-Answer popup open. On taller phones the clock grows into the room. This fixes the small scroll in Set Time on an Oppo A in Chrome. See [`../spec.md`](../spec.md).

**Checklist:**

- [ ] Tests first: Playwright at 360 × 640 fails today for Set Time (Submit below the screen).
- [ ] Set Time and Drag Arrows: the clock's height budget is recalibrated, preferring a layout where the clock is the flexible part of the column over a hand-tuned pixel budget.
- [ ] Drag Hours and Drag Minutes: the face, the tray and Done fit; if they already do, they only gain the check.
- [ ] Playwright at 360 × 640 for all four Games in Teach and Test: the main button ends within the screen with nothing scrolled; in Teach also with the wrong-Answer popup open; no sideways scroll.
- [ ] Existing 360 × 720, sideways and 768 px checks keep passing; the clock still never changes size during a Round.

**Out of scope:** the Summary, the desktop layout, any game rule.
