# 02: Web deploy only on app changes

Covers: P6

**What to build:** `deploy.yml` runs only when the app changes.

**Blocked by:** none

**Status:** done

- [x] `on.push.paths`: `src/**`, `public/**`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `tsconfig*`, `env.d.ts`, `.github/workflows/deploy.yml`; `workflow_dispatch` kept
- [x] Checked: a docs-only push does not deploy; a `src/` push does (2026-11-26: docs-only merges such as #65 and #66 started no `deploy.yml` run; app merges such as #94 did)
