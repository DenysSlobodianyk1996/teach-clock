# 01: Description from the Play listing

**What to build:** The game's description in every language is its Play short description, word for
word, so the search result, the link preview, the install prompt and the store agree.

**Blocked by:** None (can start immediately)

**Status:** todo

- [ ] `app.description` in all six locales equals the short description in `docs/store/<lang>/listing.md`
- [ ] `scripts/__tests__/store-listing.test.ts` fails when they drift
- [ ] `app.previewAlt`, the manifests, the static and runtime meta description still read well
