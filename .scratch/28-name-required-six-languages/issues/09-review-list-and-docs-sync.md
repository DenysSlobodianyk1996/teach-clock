# 09: Translation review list and docs sync

**What to build:** The author has one list of what a native speaker should check first, and the project's docs and design match the shipped app. This closes the batch.

**Blocked by:** 01, 02, 03, 04, 05, 06, 07, 08

**Status:** todo

- [x] A review list in the batch folder covers clock vocabulary, day-half labels, Game Names, store listings and Privacy text, per language
- [x] The glossary covers the language menu and the six Game Names, and its Privacy Page entry is current
- [x] The product brief describes the required name, language menu and six languages
- [ ] Local design boards and the online design canvas show the new Welcome error and language menu
  - Local boards are done (`PhoneWelcomeNameError`, `PhoneWelcomeLanguageMenu`, the asterisk on every Welcome board). The online canvas is **not synced**: the publish was denied by the permission check, so it still shows batch 27. Publish the changed `project/` files as in `docs/design/README.md`, then tick this item and set Status to done.
- [x] Project instructions and the release docs describe the new store tree and languages
- [x] The batch index shows this batch's status and PR
- [x] Type-check, lint, unit tests, browser tests, the build and a debug Android APK all pass
- [x] The release wizard's dry run passes
