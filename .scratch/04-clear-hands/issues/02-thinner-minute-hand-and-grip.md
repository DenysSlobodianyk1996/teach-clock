# 02: Thinner Minute Hand, numbers above the Grips

Covers: B1, B2

**What to build:** the numbers stay readable where the Minute Hand and its Grip cross them.

- The Minute Hand is thinner on every clock (Round, Summary, wrong-answer popup): about 4 units instead of 7. Its length stays (it reaches past the numbers, so it must be thin enough to read the number through). The Hour Hand is unchanged.
- In Drag Arrows every number is drawn above the Grips, not only the lit one.
- The visible minute Grip gets smaller to match the thinner hand. The touch area around each Grip keeps its size, so grabbing on a phone is as easy as today.

See `../images/02-grip-covers-number.png` (Drag Arrows, the Grip hides the 3) and `../images/01-set-time-test-lit.png` (Set Time, the hand over the 2).

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] Minute Hand about 4 units wide on every clock; Hour Hand as today
- [ ] Drag Arrows: the number under the minute Grip is readable at 3:15, 6:30 and 12:00
- [ ] Visible minute Grip smaller; touch area unchanged (Playwright drag tests still pass on the phone project)
- [ ] Looks right in the three themes, desktop and phone
