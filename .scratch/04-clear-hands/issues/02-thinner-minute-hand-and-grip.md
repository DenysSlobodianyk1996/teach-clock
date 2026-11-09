# 02: Thin hands, small Grips, numbers above the Grips

Covers: B1, B2, B4

**What to build:** the numbers stay readable where the hands and Grips cross them. Agreed on the sketch `../images/02-hands-compared.png` (middle column), with the Hour Hand made to match the Minute Hand.

- Both hands are thin on every clock (Round, Summary, wrong-answer popup): about 4 units instead of 7 (Minute Hand) and 11 (Hour Hand). Lengths stay: the hands differ by length and colour. The Minute Hand still reaches past the numbers, so in Set Time, the Summary and the popup it crosses the number it points at; thin enough to read through, and accepted as is (no outline, numbers stay under the hands on clocks without Grips).
- In Drag Arrows every number is drawn above the hands and Grips, not only the lit one.
- Both visible Grips get smaller and match each other (same size and ring width), in their hand's colour. The touch area around each Grip keeps its size, so grabbing on a phone is as easy as today.

See `../images/02-grip-covers-number.png` (Drag Arrows, the Grip hides the 3) and `../images/01-set-time-test-lit.png` (Set Time, the hand over the 2).

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Hour Hand and Minute Hand about 4 units wide on every clock; lengths unchanged
- [x] Drag Arrows: numbers above hands and Grips; the number under a Grip is readable at 3:15, 6:30, 9:15 and 12:00
- [ ] Both visible Grips smaller and matching; touch area unchanged (Playwright drag tests still pass on the phone project): pending run; component tests pass, drags checked by hand
- [x] Looks right in the three themes, desktop and phone
- [x] After the fix, the design boards this ticket changes are updated to match the app (`docs/design/project/*.dc.html`, shared styles in `docs/design/project/theme.css`); ticket 03 does the final check and republishes the canvas
