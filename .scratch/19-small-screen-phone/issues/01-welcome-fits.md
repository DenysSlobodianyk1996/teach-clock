# 01: Welcome fits a small phone, with its Info Popup

**Blocked by:** none (can start immediately)

**Status:** done

**What to build:** on the phone layout, Welcome shows the heading "Привіт! Навчимося читати годинник" with an ⓘ after it, the name field and Start, all in view on a 360 × 640 screen with nothing scrolled. The intro paragraph is hidden on phones and is read in the **Info Popup** the ⓘ opens (one Got it button, changes nothing). The Welcome clock shrinks to the height left (about 120–230 px). This ticket builds the Info Popup and its ⓘ button once, for ticket 02 to reuse. Desktop is unchanged. See [`../spec.md`](../spec.md).

**Checklist:**

- [x] Tests first: a view test for Welcome checks the ⓘ opens a dialog holding the intro text and Got it closes it, leaving the typed name as it was.
- [x] Info Popup: built on the existing popup dialog (like the Filled Clock and the leave-Round dialog); takes a heading and either one paragraph or a list of name + description items; one Got it button; Escape and the backdrop close it as other popups do.
- [x] ⓘ button: original SVG icon, an accessible name in `uk` and `en`, focusable, shown on the phone layout only.
- [x] Phone layout: intro hidden, ⓘ after the heading, clock sized by the height left with a floor of about 120 px; Start ends within a 360 × 640 screen.
- [x] Desktop: intro shown beside the big clock, no ⓘ.
- [x] New texts in `uk` and `en`, looked up with `t` in tests; reuse an existing Got it key if there is one.
- [x] Playwright at 360 × 640: Start in view with nothing scrolled, intro not visible, the ⓘ opens and closes the Info Popup; the Footer may follow Start. A desktop check: intro visible, no ⓘ.
- [x] Existing Welcome, Footer and 320-wide checks keep passing.

**Out of scope:** Settings (02), the Footer's place, the header.
