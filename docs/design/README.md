# Design prototype

Static boards for every Teach Clock screen and state (ticket 01). They show the design only; there is no app code here.

- **Local:** open `gallery.html` in a browser to see all boards, or open any `project/*.dc.html` on its own.
- **Online canvas** (comments, pan/zoom): https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu (private).
- `project/theme.css` holds the colour tokens for the three themes (`.tc`, `.tc.dark`, `.tc.light`) and the shared parts: clock, hands, tiles, dots, number pad, popups.
- Welcome and Settings end with the Footer (Privacy, Contact). The row "Футер з кнопкою підтримки" (`Support*.dc.html`) shows it with the Web App's Support Button in each theme, desktop and phone; the other boards show it without. Phone boards are taller than 844 px because the Footer sits below the fold.
- `project/canvas.json` is the canvas layout. Keep it in sync with `gallery.html` when boards are added or removed.

The boards are hand-written HTML + inline SVG with no build step. The real app (Vue + SVG, ticket 02 onward) should reuse the tokens and clock geometry, not the markup.
