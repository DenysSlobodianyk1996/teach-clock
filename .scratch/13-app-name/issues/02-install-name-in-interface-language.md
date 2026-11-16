# 02: The installed Web App takes the Game Name in the interface language

**Blocked by:** 01

**Status:** done

**What to build:** when a Player installs the Web App to a home screen, it is named with the full Game Name in the interface language at that moment: "Teach Clock" or "Вчимо годинник", never "Годинник" (decision 8). Switching УК/EN before installing changes what the browser would install. An already installed name is not changed afterwards.

**Checklist:**

- [x] The build writes an English and a Ukrainian manifest: name and short name both the full Game Name, `lang`, description in that language; everything else (icons, colours, start URL, scope) the same, from one definition.
- [x] The page's manifest link follows the interface language, from the first paint (pre-paint script, ticket 01's rule) and on every УК/EN tap.
- [x] The service worker precaches both manifests; installing offline still works.
- [x] Tests: unit check that both manifests carry the full Game Name and differ only in language fields; Playwright on the built app that the manifest link and its `name` follow a УК/EN tap, and the install check in `offline.spec.ts` covers both languages.
- [x] The Android App build writes no manifest (unchanged).

**Out of scope:** renaming an installed Web App after a language switch.
