# 08: Drag Numbers in Test mode

**What to build:** the Player places all 12 numbers freely with no feedback, can rearrange them, submits once, and sees in the Summary which numbers were misplaced.

**Blocked by:** 07, 09

**Status:** done

- [x] Any number can be dropped on any slot, with no feedback
- [x] Dropping on a taken slot swaps the two numbers; placed numbers can be moved again
- [x] Submit, labelled "Готово", appears only when all 12 slots are filled
- [x] Each number counts as one Task: 12 dots, neutral "placed" before Submit (green/red would give answers away), green/red after Submit
- [x] Summary shows the Player's face next to the correct face, misplaced numbers marked
- [x] Rules-module tests: swaps, Submit only when complete, scoring per number
- [x] English text for everything this ticket adds
