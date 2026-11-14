# 02: Web deploy only on app changes

Covers: P7

**What to build:** `deploy.yml` runs only when the app changes, and passes the Support link to the build.

**Blocked by:** none

**Status:** done

- [x] `on.push.paths`: `src/**`, `public/**`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `tsconfig*`, `env.d.ts`, `.github/workflows/deploy.yml`; `workflow_dispatch` kept
- [x] Build step gets the support link from a repo variable (removed in batch 10)
- [ ] Checked: a docs-only push does not deploy; a `src/` push does (note the run links in the PR) (author: after merge to `main`)
