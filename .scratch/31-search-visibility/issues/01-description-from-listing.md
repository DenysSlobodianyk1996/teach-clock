# 01: Description from the Play listing

**What to build:** The game's description in every language is its Play short description, word for
word, so the search result, the link preview, the install prompt and the store agree.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `app.description` in all six locales equals the short description in `docs/store/<lang>/listing.md`
- [x] `scripts/__tests__/store-listing.test.ts` fails when they drift
- [x] `app.previewAlt`, the manifests, the static and runtime meta description still read well
      Note: `previewAlt` describes the feature graphic on its own and reuses nothing; the manifests,
      `index.html` and App.vue read `app.description` by key, so they follow.
