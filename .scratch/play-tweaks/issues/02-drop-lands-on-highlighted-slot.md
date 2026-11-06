# 02: Drag Numbers: a drop lands on the highlighted slot

**What to build:** while a number is dragged, the slot under it is highlighted. Letting go while a slot is highlighted always places the number there, with a mouse or a finger. Today the drop is sometimes lost: the highlight follows the last pointer move, but the drop is worked out again from where the pointer is released, and a small slip as the finger lifts can miss the slot.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A test reproduces the lost drop first (highlighted slot, release just outside its reach) and fails before the fix
- [ ] Releasing with a highlighted slot drops on that slot, in Teach and Test
- [ ] Releasing with no highlighted slot behaves as today (back to where the number came from, or to the tray in Test)
- [ ] If drops still go missing on a real device after this, the Player's DevTools recording is the next lead
