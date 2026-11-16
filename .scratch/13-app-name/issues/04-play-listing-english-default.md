# 04: Play listing in English by default, a feature graphic per language

**Blocked by:** none

**Status:** todo

**What to build:** Google Play shows the English listing to everyone whose language has no translation, and the Ukrainian one to Ukrainian users (decisions 9–10 in `request.md`). Each listing has its own title ("Game Name — tagline"), texts, screenshots and feature graphic. Only the author can switch the default language in Play Console, so the release wizard and the release doc walk them through it.

**Checklist:**

- [ ] `docs/store/listing.en.md` is the default listing and `listing.uk.md` its translation; titles start with the exact Game Name; character counts rechecked against Play's 30 / 80 / 4000.
- [ ] An English feature graphic ("Teach / Clock", "Four games to learn to read and set the time") beside the Ukrainian one, same layout, both made by `npm run store-shots`; the Ukrainian one unchanged in look.
- [ ] `scripts/release-wizard.sh`: steps to make English the default language, add Ukrainian as a translation, and upload each language's screenshots and feature graphic; `--dry-run` runs through.
- [ ] `docs/android-release.md` (store listing section) says the same.

**Out of scope:** Android string resources (ticket 03); new screenshots beyond rerunning `store-shots`.
