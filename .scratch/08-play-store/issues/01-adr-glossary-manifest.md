# 01: ADR 0004, new terms, Ukrainian manifest, version 1.0.0

Covers: P1, P2

**What to build:** the paper trail and the small shared changes everything else builds on. See the spec, Shared.

**Blocked by:** none

**Status:** todo

- [ ] `docs/adr/0004-android-app-via-capacitor.md`: Capacitor with the packaged game; TWA rejected (offline first launch, `assetlinks.json` at the github.io root, address bar, Chrome dependency); cost: each update is a Play release
- [ ] `GLOSSARY.md`: **Web App**, **Android App**, **Footer**, **Support Button**, **Privacy Page**
- [ ] `vite.config.ts` manifest: name "Вчимо годинник", `lang: 'uk'`, Ukrainian description, a `short_name` that fits under an icon
- [ ] `package.json` version `1.0.0`
- [ ] `src/platform.ts` (or similar): `isAndroidApp` from `VITE_TARGET`, `supportUrl` (only an `https://` value counts); the single place that reads these env vars; typed in `env.d.ts`
- [ ] Vitest for the helper; type-check, lint, existing tests pass
