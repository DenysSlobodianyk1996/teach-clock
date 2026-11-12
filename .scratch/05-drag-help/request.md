# 05 Drag help: request

The Player-tester's notes as given on 2026-11-12, after 04-clear-hands shipped. They are unedited apart from the ids and a short line on what each points to. The ids (C1–C2) are used by the tickets.

- **C1** "In teach mode, when we selected number, or dragging it, placement circles change dash color to orange." Later: "When we selected, all circles changed to orange, but when we dragging, it doesn't, but should." (Drag Numbers: the free slots turn orange after a tap on a tray number, but not while a number is being dragged.)
- **C2** "We drag/drop some number, right now we show warning like '2 goes between 1 and 3'. So near this message, add some icon which do next - put last selected number to correct place and help user." (This replaces a first idea of lighting the right slot green while a number is held; that idea was dropped.)

Decided while planning:

- C1 applies in Teach and Test.
- C2 is in Teach only. It is a round 48 px button with a lightbulb (the Teach icon), beside the Hint toast. The number it places stays **helped**, because there was already a wrong drop. The slot flashes green (`--good`) when the number lands, and the toast closes.
- The button is called the **Place-It button** in the glossary.
- Batch 06-drag-minutes renames Drag Numbers to Drag Hours. Both drag Games get this help.
