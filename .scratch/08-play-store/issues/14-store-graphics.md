# 14: Store screenshots and feature graphic

Covers: P1

**What to build:** the Play graphics, made by script and committed to `docs/store/`.

**Blocked by:** 08

**Status:** done

- [x] A Playwright script (not part of the test run; `npm run store-shots`) takes 8 phone screenshots per language (Play's maximum) at 1080×1920 (9:16), so every Game and both Modes are shown. Use the phone boards in `docs/design/project/Phone*.dc.html` as the reference for framing, but shoot the real app:
  1. Welcome (name entered)
  2. Settings with the Game and Mode choices visible
  3. Set Time in Teach, wrong-answer popup open
  4. Set Time in Test
  5. Drag Arrows in Teach
  6. Drag Hours in Test
  7. Drag Minutes in Teach, wrong-answer popup open
  8. Summary after a Round
- [x] Files under `docs/store/screenshots/uk/` and `en/`, JPEG or 24-bit PNG without alpha
- [x] Feature graphic 1024×500 from an original SVG (`docs/store/feature-graphic.svg` → PNG, no alpha), Ukrainian text
- [x] Screens show no Footer Support Button (Android build or `VITE_SUPPORT_URL` unset)

Notes: `npm run store-shots` (`playwright.config.store.ts`, `e2e/store-shots.ts`) builds the Android target into `dist-store/` and shoots a 468 × 832 viewport at 1080/468× (on 360 × 640, Welcome's and Settings' buttons fell below the fold and were cut off). The Tasks are seeded, so a rerun writes the same files. Two changes apply only to the shots: the Settings shot hides the Footer (it started at the bottom edge and was cut in half), and the Summary shot hides the confetti (on a phone it lands on the headline; worth fixing in `SummaryConfetti.vue` later).
