# 01: Two themes and a sun/moon toggle

**Blocked by:** none

**Status:** todo

**What to build:** the game has two themes, light and dark; the middle (teal) theme is gone. The header's three swatch buttons, and the phone's cycle button, become one sun/moon toggle: a track with a sun on the left and a moon on the right, and a round knob under the chosen one (`images/01-sun-moon-toggle.png`, row 2). One tap switches. Same toggle on tablet, desktop and phone.

**Which theme a Player sees:**

- A saved `light` or `dark` (`localStorage` key `teach-clock.theme`) is used.
- Anything else (nothing saved, the old `middle`, junk) follows the device: dark when `prefers-color-scheme: dark`, otherwise light. Until the Player taps the toggle, the theme follows the device live if its setting changes.
- Tapping the toggle saves the choice; from then on the device setting no longer matters.

**Checklist:**

- [ ] `src/stores/preferences.ts`: `THEMES = ['light', 'dark']`; no stored choice means "follow the device"; `toggleTheme()` replaces `cycleTheme()`.
- [ ] `index.html` pre-paint script: same rule (saved light/dark, else `matchMedia`), so the first frame is already in the right theme and the browser bar colour matches.
- [ ] `src/styles/theme.css`: light tokens on `:root`, dark under `[data-theme='dark']`; middle tokens and `--swatch-*` removed. `src/styles/__tests__/theme.spec.ts` checks contrast for the two themes.
- [ ] `vite.config.ts`: the PWA theme colour is the light background (it named the middle one).
- [ ] `PreferenceSwitches.vue`: the toggle. A `button` with `role="switch"`, `aria-checked` true in dark, `aria-label` "Темна тема" / "Dark theme"; the sun and moon icons are original SVG; the knob slides (no motion with `prefers-reduced-motion`); 44 px or more to tap; visible focus ring.
- [ ] i18n `uk` and `en`: drop `themes.middle` and `header.nextTheme.*`; keep only what the toggle needs.
- [ ] Tests (Vitest and Playwright): saved light/dark is kept; nothing saved or `middle` follows the device (`colorScheme` in Playwright, a stubbed `matchMedia` in Vitest); one tap switches and is remembered after a reload; the toggle is the same on phone and desktop. Text looked up with `t`.
- [ ] `e2e/store-shots.ts`: shoot in light (it forced middle); rerun `npm run store-shots` so `docs/store/` shows the new look.
- [ ] Docs: `docs/product-brief.md` (two themes, device default, the toggle; the look section no longer calls teal the default), `GLOSSARY.md` (Preferences: light or dark), CLAUDE.md status line.
- [ ] Design: `docs/design/project/theme.css` and the boards drawn in the middle theme move to light (or dark where a dark board is missing); every header shows the toggle; `Main.dc.html` shows the two themes; `gallery.html` and `canvas.json` follow; the "Темна і світла теми" row is no longer separate.
- [ ] Android: check on the emulator that dark mode on the phone opens the game dark and light mode opens it light; the splash and launcher icon stay teal (brand, not a theme).

**Out of scope:** new colours for light or dark; the teal brand colour in the icon, splash and store art.
