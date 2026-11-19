# 02: Settings fits a small phone, with Game and Mode Info Popups

**Blocked by:** 01 (it builds the Info Popup and the ⓘ button)

**Status:** done

**What to build:** on the phone layout, Settings fits a 360 × 640 screen up to Back and Play, for every Game (so with the Level row or the Hours row). No card shows a description. Game and Mode cards become compact (a ~36 px icon beside the title, less padding; Game stays 2×2, Mode two side by side), and each of those two headings gets an ⓘ that opens its Info Popup. Level and Hours show their titles only, no ⓘ. The greeting stays, at about 22 px. Desktop is unchanged. See [`../spec.md`](../spec.md).

**Checklist:**

- [x] Tests first (Settings view test): the Game Info Popup lists all four Games by name with their descriptions; the Drag Hours line follows the picked Hours (1–12 or 13–24); the Mode Info Popup lists Teach and Test; Got it changes no Settings.
- [x] Info Popup headed by the section name ("Гра" / "Режим"), text only, no card icons, reusing the existing Game and Mode text keys.
- [x] Phone layout: descriptions hidden in every section, compact Game and Mode cards, Level and Hours titles only, smaller greeting.
- [x] Desktop: cards with descriptions as now, no ⓘ.
- [x] Playwright at 360 × 640, for each of the four Games: Play ends within the screen with nothing scrolled, Back and Play side by side, no description visible; each ⓘ opens and closes its Info Popup and the picked Game and Mode stay picked.
- [x] Existing Settings checks (four cards fit at 360 / 768 / desktop, 320-wide header) keep passing.

**Out of scope:** Welcome (01), the Rounds (03), any change to Settings choices or defaults.
