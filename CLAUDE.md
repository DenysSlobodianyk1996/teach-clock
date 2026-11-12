# Teach Clock

Browser game (offline PWA) that teaches children to read and set an analogue clock.
Rebuild of a 2019 master's-thesis project ("Time Teacher") as an HTML5 game.

## Status

Design approved (ticket 01). App skeleton in place (ticket 02). All three Games playable in Test and Teach (tickets 03–08), full Summary (ticket 09), English and themes (ticket 10), offline and installable (ticket 11): Welcome → Settings → Round → Summary. Stack: Vue 3 + Vite + TypeScript + SVG (see `docs/tech-stack.md`).
Work is tracked in batches under `.scratch/NN-<outcome>/`: `.scratch/README.md` lists every batch with its status and PRs, and sets the naming and file rules. Last done: `05-drag-help` (orange free slots while dragging, the Place-It button beside a Drag Numbers Hint in Teach).

## Commands

- `npm run dev`: dev server on http://localhost:4200
- Push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`, `GITHUB_PAGES=1` sets base `/teach-clock/`): https://denysslobodianyk1996.github.io/teach-clock/
- `npm run type-check`, `npm run lint`, `npm run format`
- `npx vitest run [file]`: unit and component tests
- `npx playwright test`: browser flows (desktop + phone, plus an offline check on a fresh build)
- `npm run build`: type-check and build (with the offline service worker)
- `npm run generate-pwa-assets`: redraw the app icons in `public/` from `public/favicon.svg`

## Where things are

- `GLOSSARY.md` — the project's terms (Player, Game, Mode, Level, Round, Task, Hint, Summary…). Use them in code and docs.
- `docs/product-brief.md` — screens, the three Games, Teach/Test rules, look. Read this first.
- `docs/tech-stack.md` — libraries and what was rejected.
- `docs/adr/` — decisions that are hard to reverse.
- `src/game/` — game rules, plain TypeScript (no Vue). `src/stores/` — Pinia. `src/i18n/` — interface text (every ticket from 03 adds `en` next to `uk`).
- `docs/design/` — ticket 01 design prototype: open `gallery.html` locally; `project/theme.css` has the theme tokens.
- `docs/original/` — the 2019 thesis (PDF), deck (PPTX) and screenshots, in Ukrainian. Large; prefer the brief.

## Rules

- Use the 2019 docs only for game mechanics. Their stack (ASP.NET Core, Angular, MySQL), code, palette and images are not a reference.
- No accounts, no stored results, no backend (ADR 0002). Only Preferences and the last name live in `localStorage`.
- Keep clock maths in plain TypeScript, separate from Vue and SVG (ADR 0001).
- Art must be original SVG.
- Tests never hardcode interface text: look it up by key with `t` from `src/test/i18n.ts` (Vitest) or `e2e/i18n.ts` (Playwright). Player names and other test data stay literal.
