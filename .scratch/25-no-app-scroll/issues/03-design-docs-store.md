# 03: Design, docs and store screenshots

**Blocked by:** 01, 02

**Status:** done (the Play listing upload is the author's, see the checklist)

**Checklist:**

- [x] `docs/design/` boards: the new header buttons; `PhoneWelcome` and `PhoneSettings` at 360 × 640 with the Footer on the screen.
- [x] The online design canvas (https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu) mirrors local `docs/design/project/`: version 52, all 45 `project/*` files with the same SHA-256 as local, the 4 batch 19 boards added (`PhoneSettingsGameInfo`, `PhoneSettingsHours`, `PhoneSettingsSetTime`, `PhoneWelcomeInfo`), nothing online only. The first try was refused by the permission check (the boards carry the contact email and the canvas is shared by link); published once the author asked for it.
- [x] `docs/product-brief.md`, `docs/android-checks.md`, `CLAUDE.md` status, `.scratch/README.md` row.
- [x] Store screenshots retaken (`npm run store-shots`): all 48 changed; the icon and feature graphics did not.
- [ ] The Play listing shows them: only a person can upload them in Play Console, once a build with batch 25 is live on that track. `bash scripts/release-wizard.sh` walks it (stage "Store listing: new screenshots (batch 25, round header buttons)").
- [x] Seen on the Oppo-sized emulator (`request.md`): no screen scrolls the app.
