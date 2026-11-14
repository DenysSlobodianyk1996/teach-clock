# 05: Hold-to-open Support Button component

Covers: P6

**What to build:** the Support Button on its own, without wiring: hold 2 s to open a URL, with a filling ring. See the spec, Support Button.

**Blocked by:** none

**Status:** done

- [x] `SupportButton.vue` takes `url`; pointer down starts a 2 s hold, a ring (SVG stroke) fills around a heart icon (original SVG), release or pointer leave cancels and resets
- [x] Enter or Space held does the same; focus ring visible; `aria-label` and a visible hint "Утримуй, щоб відкрити" (`support.hold`)
- [x] On the release after a full hold (a user gesture, so Safari and touch allow it): `window.open(url, '_blank', 'noopener')`, once per hold
- [x] `prefers-reduced-motion`: ring fills linearly, no bounce
- [x] i18n `support.button`, `support.hold` in `uk.ts` and `en.ts`
- [x] Vitest with fake timers: a 1.9 s hold opens nothing, the release after a 2 s hold opens once, an early release resets, keyboard hold works
