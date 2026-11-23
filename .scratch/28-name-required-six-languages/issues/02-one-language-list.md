# 02: One language list

**What to build:** Prefactor with no visible change for a Player. One ordered list of supported languages drives messages, device-language detection, the first-paint script, web manifests, Privacy output and test loops. Adding a language to it later reaches all of them, and no code assumes "not English means Ukrainian".

**Blocked by:** None (can start immediately)

**Status:** done

- [x] The list is still English and Ukrainian, in the order EN, УК, and is the single source for supported languages
- [x] Language keys and own names live once beside the list, not in every message file
- [x] Device detection picks the first device language on the list, otherwise English
- [x] A saved language still wins, and existing saved values stay valid
- [x] The first-paint script receives the list from the build, so title, `lang` and manifest are right before Vue starts
- [x] Privacy text and dates are chosen by language with no Ukrainian fallback for other languages
- [x] Test helpers look up text by locale and loop over the list
- [x] Tests that use German as unsupported move to a language that stays unsupported
- [x] The English "1 minutes" message is fixed
- [x] Existing unit and browser tests pass
