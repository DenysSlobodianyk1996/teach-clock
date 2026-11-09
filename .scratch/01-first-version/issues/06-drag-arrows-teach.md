# 06: Drag Arrows in Teach mode

**What to build:** the Teach flow for Drag Arrows. A wrong Answer shows the correct time, the hands stay where the Player left them, and "Set correct answer" animates the hands to the right place.

**Blocked by:** 04, 05

**Status:** done

- [x] Wrong Answer → popup with the correct time (digits + small clock); hands stay
- [x] "Set correct answer" with Hint after the first wrong try; pressing it animates both hands to the correct Clock Time
- [x] The Player still presses Submit; green/yellow dots; helped counts as wrong in the Summary
- [x] Playwright: a Teach Round of Drag Arrows with one wrong try and one use of "Set correct answer"
- [x] Wrong-Answer popup adds one teaching line from a short rule-based message per mistake type (wrong hour, wrong minutes, hands swapped…), e.g. "Коротка стрілка ще не дійшла до 8 — отже, зараз 7 годин."
- [x] Right Answer in Teach: short green "Правильно! Далі…" toast and a green rim on the clock before the next Task
- [x] English text for everything this ticket adds
