# 02: Design and docs without the middle theme

**Blocked by:** 01 (only the store-shots rerun; the boards and docs can start at once)

**Status:** todo

**What to build:** the design prototype and the docs match the app after 01: two themes, light and dark, and the sun/moon toggle in every header. The middle (teal) theme is gone from the boards.

**Checklist:**

- [x] `docs/design/project/theme.css`: light tokens on `:root`, dark under `[data-theme='dark']`; middle tokens and swatches removed.
- [x] Boards drawn in the middle theme move to light (or dark where a dark board is missing); every header shows the sun/moon toggle (`images/01-sun-moon-toggle.png`, row 2) instead of the swatches or the cycle button.
- [x] `Main.dc.html` shows the two themes; `gallery.html` and `canvas.json` follow; the "Темна і світла теми" row is no longer separate.
- [x] Docs: `docs/product-brief.md` (two themes, device default, the toggle; the look section no longer calls teal the default), `GLOSSARY.md` (Preferences: light or dark), CLAUDE.md status line.
- [ ] Rerun `npm run store-shots` so `docs/store/` shows the new look.
- [ ] `.scratch/README.md`: the batch row and its PR.

**Out of scope:** the teal brand colour in the icon, splash and store art.
