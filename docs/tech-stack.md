# Tech stack

Decided in the design interview. The rendering choice is recorded in ADR 0001, the lack of a
backend and storage in ADR 0002.

## What the game needs

Three small clock puzzles: one SVG clock, draggable number tiles, rotatable hands, a number pad,
progress dots, a Summary. Normal app UI around it (Welcome, Settings, header with Preferences).
No physics, no game loop, no backend.

## Stack

| Need | Choice | Notes |
|---|---|---|
| App | **Vue 3** (`<script setup>`) + **TypeScript** | |
| Build | **Vite** via `npm create vue@latest` | Add Router, Pinia, Vitest, Playwright, ESLint, Prettier |
| Clock | **Plain SVG** in Vue components | Hands are `transform: rotate()`. The same component draws the play clock and the small Summary clocks |
| Clock maths | **Own TypeScript module**, no Vue imports | Clock Time ↔ hand angles, snapping to the Level step, hour rollover, Task generation. Fully unit-tested |
| Dragging (numbers, hands) | **Pointer Events**, with **VueUse** helpers where useful | Hand rotation = angle from the clock centre to the pointer |
| Animation | **CSS transitions** and keyframes | Hands turning to the correct Answer, the green rim on a right Answer, the dragged number following the pointer |
| Confetti | **Own SVG pieces** with a CSS drop (`SummaryConfetti.vue`) | Summary celebration; no library needed |
| State | **Pinia** | Current Round, Settings, Preferences |
| Routing | **Vue Router** | Welcome, Settings, Round, Summary |
| Interface text | **vue-i18n** | `uk` default, `en` |
| Preferences + last name | `localStorage` (via VueUse `useStorage`) | The only thing kept on the device |
| Themes | CSS custom properties per theme (`middle`, `dark`, `light`) | |
| Offline / install | **vite-plugin-pwa** | |
| Tests | **Vitest** (+ Vue Test Utils), **Playwright** for drag flows | Clock maths and Round rules test-first |

## Rejected

- **PixiJS / Phaser / Konva**: canvas engines. More work for scaling, hit areas and text input,
  with no benefit for three small puzzles (ADR 0001).
- **IndexedDB / Dexie, Supabase, charts**: nothing is stored and there are no statistics (ADR 0002).
- **Howler / audio**: no sound in this version.
- **Nuxt**: no server rendering or SEO needs.

## Possible later

- **Capacitor**: wrap the PWA for app stores.
- A canvas or GSAP layer for richer celebration effects, kept separate from the clock maths.
