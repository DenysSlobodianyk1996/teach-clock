# 09: Android back button

Covers: P3

**What to build:** the hardware back button acts per screen and never drops a Player out of a Round. See the spec, Back button.

**Blocked by:** 07

**Status:** done

- [x] A plain function `backAction(state)` → `exit | goWelcome | openLeaveDialog | closePopup`, tested without Capacitor
- [x] Welcome: exit; Settings: Welcome; Round: open `LeaveRoundDialog`, or close it if open; Summary: Welcome; any open popup closes first
- [x] Wired with `@capacitor/app` `backButton` only in the Android App
- [x] Vitest for every row of the table; checked on the emulator (Vitest: `src/android/__tests__/`; emulator check done in ticket 10, see `docs/android-checks.md`)
