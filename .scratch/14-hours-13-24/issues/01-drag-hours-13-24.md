# 01: Drag Hours in 13–24

**Blocked by:** none

**Status:** done

**What to build:** a Player picks Drag Hours and then Hours 13–24 in Settings, and drags 13–24 onto a face with an Hour Badge by every slot (24 at the top), in Teach and Test, through to the Summary (decisions 1–8 in `request.md`).

**Checklist:**

- [x] Tests first (`src/game`): tile N shows N + 12 in 13–24 and N in 1–12; Hour Badges show in Drag Minutes and in Drag Hours 13–24 only; the Hint's shown neighbours for 3 in 13–24 are 15 between 14 and 16, and for 12 are 24 between 23 and 13.
- [x] Settings carry Hours (default 1–12); only Drag Hours has it. Kept across "Play again" and "Choose game" like Level.
- [x] Settings screen: the Hours group with two cards, shown only for Drag Hours, uk and en text.
- [x] Round, Hint and Summary use the Round's Hours: tiles, Hour Badges, the Hint line and face, the Summary line and faces.
- [x] Playwright: Settings → Drag Hours → 13–24 → Round shows tiles 13–24 and badges; text looked up with `t`.

**Out of scope:** Drag Arrows and Set Time with 24-hour times; docs and design (ticket 02).
