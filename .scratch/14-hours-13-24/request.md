# Request

From the author, 2026-11-16:

> 1 more feature I want to add. This config will be selected on settings page. So, we have drag hours - 1-12. I want to have possibility to have drag hours for 13-24. In this case, nearby we will have grey circles with numbers 1-12 as we have the same in drag minutes mode. So, for now I want such mode in drag hours only. For drag arrows, set time I guess it could be complicated but you can propose your thoughts too.

Today: Drag Hours always places 1–12; only Drag Minutes has Hour Badges.

## Decisions (grilling, 2026-11-16)

See `GLOSSARY.md` (Hours).

1. **Hours** is a choice inside Drag Hours only, not a fifth Game. Values: 1–12 (default) and 13–24.
2. Settings shows it when Drag Hours is picked, in place of Level: heading "Години" / "Hours"; cards **1–12** "перша половина доби" / "first half of the day" and **13–24** "друга половина доби" / "second half of the day". No AM/PM wording (aimed at Ukrainian children, who learn that a доба has 24 hours).
3. In 13–24, slot N takes tile N + 12; 24 sits at the top.
4. 13–24 shows the Hour Badges (1–12) by every slot, in both Modes, exactly as Drag Minutes does. The Hint reads "15 goes between 14 and 16", with the badges on the Hint face.
5. Teach and Test rules are unchanged: 12 tiles, a Round of 12.
6. Summary: the line names Hours where other Games name Level ("Drag Hours · Teach · 13–24"); the faces show the 13–24 tiles with badges. No "try 13–24" suggestion.
7. Hours is kept like Game, Mode and Level: "Play again" and "Choose game" both keep it; a reload starts at 1–12.
8. **Clock Time** stays 1–12: Hours only changes the tiles.
9. The Drag Hours card's description follows Hours: "Перетягни числа 1–12 на їхні місця." or "…13–24…" (asked after review, 2026-11-16).

## Later (out of scope)

- **Drag Arrows, 24-hour**: the Task shows e.g. 15:40 and the Player sets the hands to 3:40. Clock maths stays 1–12; only the Task's display adds 12 after noon. Teaches converting 24-hour time to the clock. The easier of the two; do it first, as its own batch.
- **Set Time, 24-hour**: a face cannot tell 3:40 from 15:40, so a Task needs a cue (sun/moon by the clock, or "in the afternoon"); the hours box would accept 13–24 (or 0–23) with its Range changed. Needs an ADR, because the glossary says there are no 24-hour times.
