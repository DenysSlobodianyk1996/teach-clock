# Tech stack proposal

Status: **proposal, not decided.** Discuss, then record the decision as an ADR.

## What the game needs technically

The four modes are UI puzzles, not action games: one clock, draggable tiles, rotatable hands,
text inputs, a timer, a score. No physics, no sprite worlds, no 60 fps game loop.
So the core needs are:

1. Crisp, scalable clock drawing (any screen size, retina).
2. Drag and drop (numbers onto slots, words into a sentence) that works with mouse **and** touch.
3. Rotating the clock hands by dragging, with snapping.
4. Forms, i18n, menus, statistics pages — normal app UI.
5. Juice: animations, sounds, confetti on success.

That points to **DOM + SVG inside an app framework**, not a canvas game engine.

## Recommended: Vue 3 + Vite + SVG

| Need | Library | Why |
|---|---|---|
| App framework | **Vue 3** (Composition API, `<script setup>`) + **TypeScript** | Your preference; reactive state maps well to "clock shows time X" |
| Build | **Vite** (`npm create vue@latest`) | Fast dev server; the official scaffold adds Router, Pinia, Vitest, Playwright, ESLint |
| Clock rendering | **Plain SVG** in a Vue component | Resolution-independent, styleable with CSS, hands are just `transform: rotate()` |
| Drag hands / tiles, animation | **GSAP** + its **Draggable** plugin (`type: "rotation"`, snapping, inertia) | Rotation-drag with snap is exactly the "set the clock" mechanic; GSAP and all its plugins are free to use |
| Simpler drag alternative | **VueUse** (`useDraggable`, `usePointer`) or raw Pointer Events | No extra dependency; enough for number/word tiles |
| Sortable word tiles (mode 4) | **vue-draggable-plus** (SortableJS) | Reorderable list with touch support out of the box |
| State | **Pinia** | Round state, profile, settings |
| Routing | **Vue Router** | Main page, modes, results |
| UI translation | **vue-i18n** | UI language switch (uk / en) |
| Time → words | **Own TypeScript module**, no library | Core domain logic ("ten to five", "чверть на п'яту"); must be fully unit-tested |
| Sound | **Howler.js** | Reliable audio sprites on mobile |
| Voice-over (optional) | Web Speech API `speechSynthesis` | Read the time aloud, no assets needed |
| Rewards | **canvas-confetti** | Cheap delight on correct answers |
| Statistics charts | **vue-chartjs** (Chart.js) | Progress per mode; ECharts if you want fancier charts |
| Local storage | **Dexie** (IndexedDB) | Profiles and results offline, no backend for the MVP |
| Offline / install on tablet | **vite-plugin-pwa** | Works in a classroom with bad Wi-Fi |
| Tests | **Vitest** + Vue Test Utils, **Playwright** for e2e drag flows | Time-to-words and scoring rules test-first |
| Backend later (accounts, teacher dashboard) | **Supabase** (Postgres + auth) or Firebase | Only when sync across devices is needed |
| Native app later | **Capacitor** | Wrap the same build for iOS/Android stores |

## Alternatives

### Canvas game engine instead of SVG

- **Phaser** (with its official Vue + Vite template). Pick it if the vision moves towards a "real game":
  sprite animation, particles, scenes, characters walking around. Costs: text input, i18n, accessibility
  and responsive layout get harder; UI is split between Phaser and Vue.
- **PixiJS** (+ `vue3-pixi`). Fast 2D renderer, no game framework. Good middle ground if you need
  many animated sprites but want Vue to own the app.
- **Konva** (`vue-konva`). Canvas shapes with built-in drag, rotate and hit-testing. Close fit for the
  clock mechanics, but SVG + GSAP already covers it without a canvas layer.

### Other app frameworks

- **Svelte 5 + Vite** — less boilerplate, very small bundles, excellent built-in transitions.
- **React + Vite** (+ `@dnd-kit`, Framer Motion) — largest ecosystem; no advantage here given your Vue preference.
- **Nuxt** — only if you want a marketing site / SEO pages alongside the game. Not needed now.

## Recommendation

Start with **Vue 3 + Vite + TypeScript + SVG + GSAP Draggable + Pinia**, all data local (Dexie),
shipped as a PWA. Add vue-i18n, Howler, canvas-confetti when the first mode works.
Revisit Phaser/Pixi only if the art direction demands character animation that SVG can't carry.
