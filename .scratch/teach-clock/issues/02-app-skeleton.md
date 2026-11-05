# 02: App skeleton — Welcome → Settings → empty Round

**What to build:** the project scaffold and the first walkable path. A Player opens the app, reads what it teaches, types a name, picks a Game, Mode and Level on Settings, and reaches an empty Round screen. Visuals follow the approved design (01).

**Blocked by:** 01 (design approved)

**Status:** ready-for-agent

- [ ] Vue 3 + Vite + TypeScript project with Vue Router, Pinia, vue-i18n, Vitest, Playwright, ESLint, Prettier (`docs/tech-stack.md`)
- [ ] Welcome with app description and name field; last name remembered on the device and pre-filled
- [ ] Settings with Game, Mode, Level and their descriptions; Level hidden for Drag Numbers; back to Welcome
- [ ] Header with Home
- [ ] Opening Round without a Round in memory redirects to Settings; Settings without a name redirects to Welcome
- [ ] All text through vue-i18n, Ukrainian only for now
- [ ] "middle" theme colours as CSS custom properties
- [ ] Play area keeps 4:3, scales to fit, capped at ~1024 px; portrait phone layout as designed
- [ ] Playwright test: Welcome → Settings → Round screen
