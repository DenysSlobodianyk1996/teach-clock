# 06: Regroup the store folder by language

**What to build:** The author finds everything for one Play listing in one language folder. English and Ukrainian assets move there with plain filenames, and generation, checks, the release wizard and docs all use the new tree. Icon, feature graphic template and closed-test tracker stay in the store root.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Each language folder holds `listing.md`, `feature-graphic.png`, `phone/`, `tablet-7/` and `tablet-10/`
- [x] English and Ukrainian also hold `testers.md`
- [x] Filenames carry no language key, and files are moved so their history follows them
- [x] The icon, feature graphic template and closed-test tracker remain in the store root
- [x] Store-shots writes only to the new tree and recreates no old path
- [x] Listing and feature graphic tests read the new tree
- [x] The release wizard's dry run prints paths that exist and opens the right folders
- [x] Links in the release docs, product brief and moved files resolve
- [x] No reference to the old layout remains outside historical batch notes
