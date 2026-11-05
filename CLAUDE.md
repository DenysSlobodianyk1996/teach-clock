# Teach Clock

Browser game (offline PWA) that teaches children to read and set an analogue clock.
Rebuild of a 2019 master's-thesis project ("Time Teacher") as an HTML5 game.

## Status

Design agreed, no code yet. Stack: Vue 3 + Vite + TypeScript + SVG (see `docs/tech-stack.md`).

## Where things are

- `GLOSSARY.md` — the project's terms (Player, Game, Mode, Level, Round, Task, Hint, Summary…). Use them in code and docs.
- `docs/product-brief.md` — screens, the three Games, Teach/Test rules, look. Read this first.
- `docs/tech-stack.md` — libraries and what was rejected.
- `docs/adr/` — decisions that are hard to reverse.
- `docs/original/` — the 2019 thesis (PDF), deck (PPTX) and screenshots, in Ukrainian. Large; prefer the brief.

## Rules

- Use the 2019 docs only for game mechanics. Their stack (ASP.NET Core, Angular, MySQL), code, palette and images are not a reference.
- No accounts, no stored results, no backend (ADR 0002). Only Preferences and the last name live in `localStorage`.
- Keep clock maths in plain TypeScript, separate from Vue and SVG (ADR 0001).
- Art must be original SVG.
