# 01: Footer with Privacy and Contact only

**Blocked by:** none
**Status:** done

**What to build:** the Footer holds Privacy and Contact, nothing else, in both builds. Code, CI, release wizard, docs and design describe only those two.

- [x] `AppFooter.vue`: the two links, centred.
- [x] `src/platform.ts` and `env.d.ts`: only `VITE_TARGET` / `isAndroidApp`.
- [x] `deploy.yml`: the build takes no repo variables.
- [x] Docs and design follow: product brief, glossary, ADR 0004, CLAUDE.md, android-release, android-checks, store listings, `docs/design`.
