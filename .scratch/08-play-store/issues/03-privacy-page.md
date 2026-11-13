# 03: Privacy Page

Covers: P4

**What to build:** a static `public/privacy.html`, Ukrainian then English, saying nothing is collected. Text: the draft from the grilling (see the spec).

**Blocked by:** none

**Status:** todo

- [ ] Plain HTML outside the Vue app; colours copied from the `src/styles/theme.css` tokens, light and dark via `prefers-color-scheme`; readable at 360 px
- [ ] Sections: no data collected; no accounts, ads, analytics or third parties; only Preferences and the last name stay on the device, erased by clearing app/site data; results not kept after a Round; contact email; updated date
- [ ] `lang` attributes per section; a link back to the game
- [ ] In the service-worker precache (html is already in `globPatterns`), so it opens offline after the first visit
- [ ] Playwright: `/privacy.html` loads and has both languages (headings by stable ids, not text)
