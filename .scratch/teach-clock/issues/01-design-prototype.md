# 01: Design prototype of every screen and Game

**What to build:** a visual prototype (Claude Design or similar design artifact, no app code) that shows how Teach Clock looks and feels on every screen, so the Player experience is agreed before any code is written. See `docs/product-brief.md` and `GLOSSARY.md`.

**Blocked by:** None (can start immediately)

**Status:** awaiting-approval

**Gate:** no application code (tickets 02–11) starts until the user explicitly approves this design for **all** features. Approval is recorded in this ticket.

## Where the design lives

- Canvas (private, comment there): https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu
- Local copy: open `docs/design/gallery.html` in a browser. Each board is also a plain file in `docs/design/project/*.dc.html`; the shared look is `docs/design/project/theme.css`.
- 34 boards: style sheet, 15 tablet screens/states, 6 phone, 6 desktop, 6 dark/light theme boards.

## Checklist

- [x] Original clock art in SVG style: face, Hour Hand (short), Minute Hand (long), number tiles, empty slots
- [x] Welcome: short app description, name field, Start
- [x] Settings: Game, Mode, Level choices with one-line descriptions; Level hidden for Drag Numbers; back to Welcome
- [x] Header on every screen: language switch (uk/en), theme switch, Home / Leave Round with its confirmation
- [x] Set Time Round: clock, `H : MM` boxes, number pad, Submit, progress dots
- [x] Drag Arrows Round: target Clock Time, draggable hands at 12:00, Submit, progress dots
- [x] Drag Numbers Round: empty face with slots, number tray, a number mid-drag, partly filled face
- [x] Teach states: wrong-Answer popup (correct digits + small clock), "Set correct answer" button with Hint, Drag Numbers neighbour hint ("7 goes between 6 and 8"), green/yellow dots
- [x] Test states: green/red dots; Drag Numbers Submit when all 12 placed
- [x] Summary: "7 of 10 right", Right and Wrong groups, first Answer vs correct as small clocks, Drag Numbers face comparison, celebration, Play again / Back to Settings
- [x] Themes: middle (default), dark, light, with readable contrast
- [x] Layouts: phone portrait (clock above answer area), tablet landscape, desktop capped at ~1024 px
- [x] Ukrainian copy for all screens (English can follow the same layout)
- [ ] User approves the full design
- [ ] After approval: review tickets 02–11, the brief, glossary and ADRs; update any ticket whose behaviour or scope changed during design, and note the changes here

## Design choices to confirm

These go a little beyond the brief. If approved, the matching tickets need updating:

1. **App name in Ukrainian:** "Вчимо годинник". Game names: "Розстав числа" (Drag Numbers), "Постав стрілки" (Drag Arrows), "Який час?" (Set Time). Modes: "Навчання" / "Перевірка". Level is labelled "Крок хвилин".
2. **Drag Numbers progress:** 12 dots, one per number. Teach colours them green/yellow. Test shows only neutral "placed" dots (green/red would give away answers before Submit).
3. **Drag Numbers Test Submit** is labelled "Готово" and appears once all 12 are placed. Other Games use "Перевірити".
4. **Teach popup adds one teaching line**, for example "Коротка стрілка ще не дійшла до 8 — отже, зараз 7 годин." This is optional: it needs a short rule-based message per mistake type, or it can be dropped.
5. **"Right" feedback in Teach:** a short green "Правильно! Далі…" toast and a green rim on the clock before the next Task (desktop Drag Arrows board). The brief doesn't cover this.
6. **Phone header:** the theme switch is a single button that cycles middle → dark → light (three swatches don't fit at 390 px). Tablet and desktop show all three.
7. **Wrong group title** is "Потренуймо ще" ("let's practise more") rather than "Помилки", in line with "teaching first". In Teach it is labelled "Перша спроба" (first try), in Test "Твоя відповідь".
8. **Perfect Round:** the Summary shows "Помилок немає" with a nudge to try a smaller Level, in place of the Wrong group.
9. **Leave Round dialog** buttons: "Грати далі" (primary) / "Вийти".
10. **Drag Arrows hands** have round grips at the tips to make them easy to grab. The dragged hand's grip turns mustard.
