# 06: Bigger Summary clocks

Covers: A7

**What to build:** the clocks in the Summary are big enough to read easily: roughly twice today's size (wrong-answer pairs 70px, the "Right" list 64px), sized by eye. On a phone each wrong-answer pair stacks: the Player's answer on top, a down arrow, then the correct one. Drag Numbers pairs grow the same way. The Teach wrong-answer popup clock (150px) is already big enough. See `../images/06-summary-clocks.png`.

**Blocked by:** 03 (the phone layout changes first)

**Status:** done

- [x] Summary clocks are about 2× bigger on desktop and readable on a phone
- [x] On a phone each pair stacks vertically with a down arrow
- [x] Drag Numbers pairs and the "Right" list grow too
- [x] No other screen has clocks this small (checked: Round, Hint panel, wrong-answer popup)

**Result:** wrong-answer pairs 70px → 140px (120px on a phone), the "Right" list 64px → 128px (108px on a phone, two per row). On desktop each side shows its caption and time under the clock; on a phone the pair stacks with a down arrow under the clocks. Other screens checked: the Round clock fills its side; the Hint panel has no clock (text only); the Teach wrong-answer popup clock is 150px (110px on a phone). None needed a change.
