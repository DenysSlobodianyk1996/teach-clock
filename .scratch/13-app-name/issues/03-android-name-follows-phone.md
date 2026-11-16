# 03: The Android App's name follows the phone's language

**Blocked by:** none

**Status:** done

**What to build:** under the icon, in the app drawer, in settings and as the window title, the Android App is "Вчимо годинник" on a phone whose language list reaches Ukrainian before English, and "Teach Clock" on every other phone (decisions 3–4, 9 in `request.md`, ADR 0005). The full name always; a cut-off on one-line launchers is accepted.

**Checklist:**

- [x] Test first: the Android string resources have an English default and a Ukrainian translation, the launcher name and window title equal the Game Name from i18n (`app.name`) in each language, and none is shortened.
- [x] Default resources English ("Teach Clock"), Ukrainian resources "Вчимо годинник", for both the app name and the window title; the Capacitor app name in line.
- [x] `npm run build:apk` builds; the release bundle check (`check:android`) still passes.
- [x] `docs/android-checks.md`: a step to switch the phone between English and Ukrainian and read the name under the icon and in recent apps.

**Out of scope:** the interface language inside the app (ticket 01); the Play listing (ticket 04).
