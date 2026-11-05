# 02: App skeleton — Welcome → Settings → empty Round

**What to build:** the project scaffold and the first walkable path. A Player opens the app, reads what it teaches, types a name, picks a Game, Mode and Level on Settings, and reaches an empty Round screen. Visuals follow the approved design (01).

**Blocked by:** 01 (design approved)

**Status:** ready-for-agent

- [ ] Vue 3 + Vite + TypeScript project with Vue Router, Pinia, vue-i18n, Vitest, Playwright, ESLint, Prettier (`docs/tech-stack.md`)
- [ ] Welcome with app description and name field; last name remembered on the device and pre-filled
- [ ] Settings with Game, Mode, Level and their descriptions; Level hidden for Drag Numbers; back to Welcome
- [ ] Header with brand (mini clock + "Вчимо годинник") and Home (on Settings and Round, not Welcome); language and theme switches wait for ticket 10
- [ ] Opening Round without a Round in memory redirects to Settings; Settings without a name redirects to Welcome
- [ ] All text through vue-i18n, Ukrainian only for now (English for this text comes in ticket 10)
- [ ] "middle" theme colours as CSS custom properties
- [ ] Play area keeps 4:3, scales to fit, capped at ~1024 px; portrait phone layout as designed
- [ ] Playwright test: Welcome → Settings → Round screen
- [ ] Names from the design: app "Вчимо годинник"; Games "Розстав числа", "Постав стрілки", "Який час?"; Modes "Навчання" / "Перевірка"; Level labelled "Крок хвилин"
- [ ] Settings opens with Set Time + Teach + 15 min selected; kept in memory only (Pinia), not on the device
- [ ] Name trimmed, max 20 characters, Start disabled while empty; saved when Start is pressed
- [ ] Nunito bundled locally (`@fontsource/nunito`), not loaded from Google, so it works offline
- [ ] While a Round is open, reload or close asks for the browser's standard confirmation (`beforeunload`); after a reload the Round is gone and the Player lands on Settings
- [ ] Empty Round screen: header, progress dots (10, or 12 for Drag Numbers) and an empty play area; ticket 03 replaces the placeholder Round with the rules-module Round
