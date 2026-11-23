# 02: One language list

**What to build:** Prefactor with no visible change for a Player. One ordered list of supported languages drives messages, device-language detection, the first-paint script, web manifests, Privacy output and test loops. Adding a language to it later reaches all of them, and no code assumes "not English means Ukrainian".

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] The list is still English and Ukrainian, in the order EN, УК, and is the single source for supported languages
- [ ] Language keys and own names live once beside the list, not in every message file
- [ ] Device detection picks the first device language on the list, otherwise English
- [ ] A saved language still wins, and existing saved values stay valid
- [ ] The first-paint script receives the list from the build, so title, `lang` and manifest are right before Vue starts
- [ ] Privacy text and dates are chosen by language with no Ukrainian fallback for other languages
- [ ] Test helpers look up text by locale and loop over the list
- [ ] Tests that use German as unsupported move to a language that stays unsupported
- [ ] The English "1 minutes" message is fixed
- [ ] Existing unit and browser tests pass
