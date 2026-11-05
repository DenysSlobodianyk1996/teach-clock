# 07: Drag Numbers in Teach mode

**What to build:** the Player rebuilds a clock face by dragging the numbers 1–12 from a shuffled tray onto empty slots, and learns from every wrong drop.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Empty face with 12 slots and a shuffled tray of 1–12
- [ ] Drag and drop with touch and mouse
- [ ] A correct drop locks the number in place
- [ ] A wrong drop sends the number straight back to the tray with "N goes between N-1 and N+1"; 12 sits between 11 and 1, 1 between 12 and 2
- [ ] 12 progress dots; the Round ends when all 12 are placed, then Summary
- [ ] Rules-module tests: rejection, neighbour hints including the 12/1 wrap, Round end
