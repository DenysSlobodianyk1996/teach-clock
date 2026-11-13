# Tech stack

Decided in the design interview. The rendering choice is recorded in ADR 0001, the lack of a
backend and storage in ADR 0002, the Android App's wrapper in ADR 0004.

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
| Breakpoints | **Custom media** such as `@media (--phone)`, expanded at build time by a few-line PostCSS plugin in `src/styles/media.ts` | One definition for every screen. No new dependency: `postcss-custom-media` / `postcss-preset-env` would add packages for one replace, and Lightning CSS custom media can't see a definition from another `<style>` block |
| Offline / install | **vite-plugin-pwa** | Web App only; left out of the Android build |
| Android App | **Capacitor** (`@capacitor/android`, `@capacitor/app` for the back button) | Packages the same Vite build inside the app (ADR 0004). `VITE_TARGET=android` marks that build; `src/platform.ts` is the one place that reads it. `android/` is committed; Gradle builds the signed `.aab` in CI (`.github/workflows/android.yml`) and uploads it to Play with `r0adkll/upload-google-play` |
| Store art | **Playwright** + **sharp** scripts | `npm run store-shots` (Play screenshots, feature graphic), `npm run generate-android-assets` (launcher icons, splash, 512 px icon) |
| Tests | **Vitest** (+ Vue Test Utils), **Playwright** for drag flows | Clock maths and Round rules test-first |

## Rejected

- **PixiJS / Phaser / Konva**: canvas engines. More work for scaling, hit areas and text input,
  with no benefit for three small puzzles (ADR 0001).
- **IndexedDB / Dexie, Supabase, charts**: nothing is stored and there are no statistics (ADR 0002).
- **Howler / audio**: no sound in this version.
- **Nuxt**: no server rendering or SEO needs.
- **Trusted Web Activity** (Bubblewrap, PWABuilder) for the Android App: it loads the site from
  the web, so the first launch fails offline; it needs `assetlinks.json` at the root of
  `denysslobodianyk1996.github.io`, which we don't control (the Web App is on a subpath); a failed
  check shows a browser address bar over the game; and it depends on Chrome (ADR 0004).

## Possible later

- A canvas or GSAP layer for richer celebration effects, kept separate from the clock maths.
