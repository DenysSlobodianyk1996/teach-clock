# 01: Design prototype of every screen and Game

**What to build:** a visual prototype (Claude Design or similar design artifact, no app code) that shows how Teach Clock looks and feels on every screen, so the Player experience is agreed before any code is written. See `docs/product-brief.md` and `GLOSSARY.md`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

**Gate:** no application code (tickets 02–11) starts until the user explicitly approves this design for **all** features. Approval is recorded in this ticket.

- [ ] Original clock art in SVG style: face, Hour Hand (short), Minute Hand (long), number tiles, empty slots
- [ ] Welcome: short app description, name field, Start
- [ ] Settings: Game, Mode, Level choices with one-line descriptions; Level hidden for Drag Numbers; back to Welcome
- [ ] Header on every screen: language switch (uk/en), theme switch, Home / Leave Round with its confirmation
- [ ] Set Time Round: clock, `H : MM` boxes, number pad, Submit, progress dots
- [ ] Drag Arrows Round: target Clock Time, draggable hands at 12:00, Submit, progress dots
- [ ] Drag Numbers Round: empty face with slots, number tray, a number mid-drag, partly filled face
- [ ] Teach states: wrong-Answer popup (correct digits + small clock), "Set correct answer" button with Hint, Drag Numbers neighbour hint ("7 goes between 6 and 8"), green/yellow dots
- [ ] Test states: green/red dots; Drag Numbers Submit when all 12 placed
- [ ] Summary: "7 of 10 right", Right and Wrong groups, first Answer vs correct as small clocks, Drag Numbers face comparison, celebration, Play again / Back to Settings
- [ ] Themes: middle (default), dark, light, with readable contrast
- [ ] Layouts: phone portrait (clock above answer area), tablet landscape, desktop capped at ~1024 px
- [ ] Ukrainian copy for all screens (English can follow the same layout)
- [ ] User approves the full design
- [ ] After approval: review tickets 02–11, the brief, glossary and ADRs; update any ticket whose behaviour or scope changed during design, and note the changes here
