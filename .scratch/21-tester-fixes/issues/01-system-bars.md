# 01: The system bars never cover the app

**Blocked by:** none

**Status:** done (the emulator and phone checks are left to the author: `docs/android-checks.md`)

**What to build:** the Android App stays edge to edge (`viewport-fit=cover`, Capacitor 8), and the status bar, a camera cutout and the navigation bar never lie over a control. Backgrounds run under the bars; the header's controls sit below the status bar, the Footer's links above the navigation bar, nothing under a cutout on either side.

**Decisions (grilled 2026-11-19):**

1. One CSS rule for both builds, no `isAndroidApp` branch: `--inset-top/right/bottom/left` in `src/styles/theme.css` read Capacitor's `--safe-area-inset-*` (SystemBars `insetsHandling: 'css'`, right on every WebView), then `env(safe-area-inset-*)` (a browser, an installed Web App on a notched phone), then 0.
2. The page's background goes under the bars; the header grows by the top inset so the status bar sits on it.
3. The bars' icons follow the theme, not the phone's dark mode: dark icons on light, light on dark (`src/android/systemBars.ts`, `SystemBars.setStyle`).
4. Popups stay between the bars; the scrim still covers the whole screen.
5. "Fits with nothing scrolled" is measured inside the safe area. Target: every screen fits the safe area of a 360 × 720 phone with bars (the smallest edge-to-edge Android 15+ class). Welcome, Settings and the drag Games also fit 360 × 640 with bars; Set Time and Drag Arrows keep their 150 px clock and 48 px keys and may scroll a little there. The batch 19 checks at 360 × 640 without bars stay.
6. The drag face's floor goes from 200 to 190 px, so the drag Games fit 360 × 640 with bars.

**Checklist:**

- [x] `capacitor.config.ts`: `SystemBars: { insetsHandling: 'css' }`.
- [x] Inset tokens and `--safe-height` in `theme.css`; `AppFrame` pads left, right and bottom; `HeaderBar` takes the top inset; Welcome, the stage and the drag face size from the safe height.
- [x] `PopupDialog`'s scrim pads by the insets.
- [x] Bar icons follow the theme in the Android App.
- [x] Tests: `e2e/system-bars.spec.ts` (upright 360 × 640 and 360 × 720, sideways 640 × 360 with a cutout; Welcome, Settings, every Game's Round, the Info Popup, the Privacy Page), `src/android/__tests__/systemBars.spec.ts`.
- [ ] Seen on an emulator with a cutout, in 3-button and gesture navigation, light and dark, upright and sideways (`docs/android-checks.md`); before/after screenshots in the PR.

**Out of scope:** hiding the bars (immersive mode); a sticky header.
