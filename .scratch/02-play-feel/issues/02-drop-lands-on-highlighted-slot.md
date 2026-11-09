# 02: Drag Numbers: a drop lands on the highlighted slot

Covers: A3

**What to build:** while a number is dragged, the slot under it is highlighted. Letting go while a slot is highlighted always places the number there, with a mouse or a finger. Today the drop is sometimes lost: the highlight follows the last pointer move, but the drop is worked out again from where the pointer is released, and a small slip as the finger lifts can miss the slot.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] A test reproduces the lost drop first (highlighted slot, release just outside its reach) and fails before the fix
- [x] Releasing with a highlighted slot drops on that slot, in Teach and Test
- [x] Releasing with no highlighted slot behaves as today (back to where the number came from, or to the tray in Test)
- [x] Checked on a real device: drops no longer go missing
