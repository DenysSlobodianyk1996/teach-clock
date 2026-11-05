# 08: Drag Numbers in Test mode

**What to build:** the Player places all 12 numbers freely with no feedback, can rearrange them, submits once, and sees in the Summary which numbers were misplaced.

**Blocked by:** 07, 09

**Status:** ready-for-agent

- [ ] Any number can be dropped on any slot, with no feedback
- [ ] Dropping on a taken slot swaps the two numbers; placed numbers can be moved again
- [ ] Submit appears only when all 12 slots are filled
- [ ] Each number counts as one Task (12 dots, green/red after Submit)
- [ ] Summary shows the Player's face next to the correct face, misplaced numbers marked
- [ ] Rules-module tests: swaps, Submit only when complete, scoring per number
