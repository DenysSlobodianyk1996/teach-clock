# 05: Drag Arrows in Test mode

**What to build:** the Player is given a target Clock Time and drags the hands to show it, with a real-clock feel, then submits; 10 Tasks, green/red dots, Summary.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Hands start at 12:00 for every Task; 12:00 is never a target
- [ ] Dragging the Minute Hand (touch and mouse) snaps to the Level step
- [ ] Passing 12 clockwise rolls the hour forward, anticlockwise rolls it back; the Hour Hand creeps with the minutes
- [ ] Dragging the Hour Hand changes only the hour, choosing the hour whose drawn hand (with the current minutes) is nearest the pointer; ties go to the later hour (see spec, "Which hour an Hour Hand drag picks")
- [ ] Setting 1:30 hour-first or minutes-first gives the same result: Hour Hand between 1 and 2
- [ ] One Clock Time drives both hands, so they never disagree
- [ ] Submit always enabled; untouched hands are just a wrong Answer
- [ ] Rules-module tests: snapping per Level, rollover both ways, hour-only drag with the nearest-position cases from the spec; component test: clock face emits drags from pointer events
