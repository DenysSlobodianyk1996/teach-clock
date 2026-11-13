# 09: Android back button

Covers: P3

**What to build:** the hardware back button acts per screen and never drops a Player out of a Round. See the spec, Back button.

**Blocked by:** 07

**Status:** todo

- [ ] A plain function `backAction(state)` → `exit | goWelcome | openLeaveDialog | closePopup`, tested without Capacitor
- [ ] Welcome: exit; Settings: Welcome; Round: open `LeaveRoundDialog`, or close it if open; Summary: Welcome; any open popup closes first
- [ ] Wired with `@capacitor/app` `backButton` only in the Android App
- [ ] Vitest for every row of the table; checked on the emulator
