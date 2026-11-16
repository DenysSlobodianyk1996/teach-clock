# 01: The starting interface language follows the device

**Blocked by:** none

**Status:** done

**What to build:** a new Player sees the game in the device's language: Ukrainian when the device's language list reaches Ukrainian before English, English otherwise (decisions 5–7 in `request.md`, ADR 0005). The Web App and the Android App (its WebView) behave the same. Until the Player taps УК/EN, the language keeps following the device; a tap saves it. Players who already have a language saved keep it. The first paint and the browser tab already carry the Game Name in that language, before the app loads.

**Checklist:**

- [x] Tests first: the rule picks the first of uk/en in the device's language list, English when neither is there ([ru, uk, en] → uk; [de, en] → en; [pl] → en; [en-GB, uk] → en; [uk-UA] → uk).
- [x] The rule lives in one place, shared by the Preferences store and the pre-paint script in `index.html` (like the theme backgrounds), so the two never drift.
- [x] Preferences: the interface language is the device's choice until the Player picks one; only a tap on УК/EN saves it; a saved `uk` or `en` still wins; an unknown saved value falls back to the device.
- [x] `index.html`: the static text is English (`lang="en"`, title "Teach Clock", English description); the pre-paint script sets `lang` and the title to the Game Name in the device's language.
- [x] `privacy.html`'s title names the game in both languages.
- [x] Playwright with `locale` set: an English browser opens Welcome in English with the tab titled "Teach Clock"; a Ukrainian browser in Ukrainian with "Вчимо годинник"; a tap on УК/EN survives a reload. Text looked up with `t`.
- [x] Existing e2e that assume Ukrainian by default run with a Ukrainian browser locale (or set it), not with literal text.

**Out of scope:** the install manifest (ticket 02); the Android launcher name (ticket 03).
