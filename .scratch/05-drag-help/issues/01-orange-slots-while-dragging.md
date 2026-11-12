# 01: Orange slots while dragging

Covers: C1

**What to build:** in Drag Numbers, every free slot turns orange (`--accent`, the same look as after a tap on a tray number) as soon as a number is held and moving, in both Modes. Today the `ready` look in `src/components/NumberBoard.vue` (`slotClasses`) depends only on `selected`, so a drag only lights up the one slot under the pointer. The slot under the pointer keeps its stronger `target` look. When the drag ends or is cancelled, the slots go back to grey dashes.

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] While a tray number is being dragged, every free slot has the orange ring, in Teach and Test
- [ ] Test: dragging a number that is already on the face lights the same slots the drop would accept (free ones and other filled ones keep their own look)
- [ ] The slot under the pointer still shows the stronger target look
- [ ] Drop, cancel (`pointercancel`, lost capture) and a drop back on the tray all clear the orange
- [ ] A short press (tap) still behaves as today
- [ ] Component test in `src/components/__tests__/` covers drag start, move and end; a Playwright check in an existing drag spec, desktop and phone
- [ ] The design boards this changes (`docs/design/project/DragNumbersDrag.dc.html`, `PhoneDragNumbers.dc.html` if it shows a drag) are updated to match the app; ticket 03 does the final check
