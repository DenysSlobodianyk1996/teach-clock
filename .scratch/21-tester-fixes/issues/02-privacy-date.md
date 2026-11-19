# 02: The Privacy Page's date is the deploy's date

**Blocked by:** none

**Status:** done

**What to build:** the Privacy Page's "Updated" date changes with every deploy by itself, with nothing to bump by hand and no CLAUDE.md rule to remember.

**Decision:** the date is the date of the commit being built (`git log -1 --format=%cs`). A merge to `main` is the deploy, so GitHub Pages and the Android App built from it show that day, the same date in both, and a local build shows the last commit's date. `VITE_PRIVACY_UPDATED` set from outside wins (to rebuild an old release with its own date); without git it is today (UTC).

**Checklist:**

- [x] `scripts/privacyUpdated.ts` works the date out; `vite.config.ts` puts it in `VITE_PRIVACY_UPDATED` before Vite reads the environment, so the app, the static `privacy.html` and Vitest all print it. No workflow change: both workflows build from the merged commit.
- [x] `PRIVACY_UPDATED` moves from `src/config.ts` to `src/privacy.ts` (the e2e tests import `config.ts` in Node, where `import.meta.env` does not exist).
- [x] Tests: `scripts/__tests__/privacyUpdated.spec.ts`; `src/__tests__/privacy.spec.ts` checks the app's and `privacy.html`'s date are the built commit's.
