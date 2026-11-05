# 04: Teach mode for Set Time

**What to build:** Set Time in Teach. A wrong Answer teaches: the Player sees the correct time, gets a "Set correct answer" button with the Hint, and must submit a right Answer before moving on.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Wrong Answer → popup with the correct time as digits and a small clock; the Player's digits stay
- [ ] After the first wrong try, "Set correct answer" button appears with the Hint under it
- [ ] Pressing it fills the correct digits; the Player still presses Submit
- [ ] Unlimited tries; the Round moves on only after a right Answer
- [ ] Dots: green = right first time, yellow = needed help
- [ ] A helped Task counts as wrong in the Summary; the Player's first Answer is kept
- [ ] Rules-module tests for the Teach flow (wrong → Hint → help → right ⇒ helped); component test: Hint panel only after a wrong try
