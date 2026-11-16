# Request

From the author, 2026-11-16:

> We should have en version "Teach Clock" and uk "Вчимо Годинник". It should be everywhere. Also, for loaded icon via pwa or installed android app - name should be the same, not cropped, possible in 2 lines etc. Also, I have question about android app name - would it be always uk name or always en? I saw android app loader with uk name, independently from selected lang later inside app itself. So I need consistency everywhere. Also, in android store, will we always have uk description, name etc, or en is possible too for en users? Can't we publish 2 versions as 2 apps or 1 app with different descriptions in store

Today: the Android name (`strings.xml`, `capacitor.config.ts`) and the PWA manifest are Ukrainian only (manifest `short_name` "Годинник", Android window title "Годинник"); the interface language always starts in Ukrainian; the Play listing's default language is Ukrainian with an English translation; the feature graphic has the Ukrainian name.

## Decisions (grilling, 2026-11-16)

See `GLOSSARY.md` (Game Name, Preferences) and `docs/adr/0005-one-app-name-follows-device-language.md`.

1. One Google Play app, not two.
2. Game Name: "Teach Clock" (en), "Вчимо годинник" (uk, lowercase г). Never shortened.
3. Under the icon (Android launcher, installed Web App): the full Game Name; a cut-off on one-line launchers is accepted.
4. Android name (launcher label and window title) follows the phone's language list: "Вчимо годинник" when Ukrainian comes before English, "Teach Clock" for every other phone (default resources English, `values-uk` Ukrainian).
5. Interface language follows the device until the Player taps УК/EN: the first of uk/en in the browser's language list, else English. Same in the Android App.
6. Players with `uk` already saved keep it (the old default was saved automatically and can't be told from a choice). From now on only a tap on УК/EN saves a language.
7. `index.html` static text becomes English (`lang="en"`, title, description); the pre-paint script sets `lang` and the title by rule 5, so the tab never shows the wrong name.
8. Web App manifest follows the interface language at install time (name, short_name = full Game Name, lang, description). An installed name is not changed afterwards.
9. Play: English is the default listing, Ukrainian a translation. Titles are "Game Name — tagline". Screenshots per language (exist). Feature graphic per language; English: "Teach / Clock", tagline "Four games to learn to read and set the time".
10. The Play Console default-language swap is a person's step: add it to `scripts/release-wizard.sh` and `docs/store`.
11. The Android splash is icon only: no change.
