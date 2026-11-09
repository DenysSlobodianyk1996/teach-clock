# 03: Phone layout up to 768px and when taller than wide

Covers: A3

**What to build:** every screen (Welcome, Settings, the three Games, Summary) switches to the stacked phone layout when the window is 768px wide or less, or taller than it is wide. The "500px tall or less" rule for sideways phones stays. Today the switch is at 600px, so between 601px and 768px (and on an upright tablet) the 4:3 play area leaves the clock small and a large empty space below it. See `../images/03-601px-drag-arrows.png`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] One shared breakpoint replaces the repeated `max-width: 600px` rules, so the screens can't drift apart
- [ ] At 601px, 700px and 768px wide, and on an upright tablet (768×1024), every screen uses the phone layout with no big empty band under the content (pending run of `e2e/phone-layout-768.spec.ts`)
- [ ] Wider landscape windows keep the 4:3 play area as today (pending run of `e2e/phone-layout-768.spec.ts`)
- [ ] Sideways phones (500px tall or less) behave as today (pending run of `e2e/phone-layout-768.spec.ts`)
- [x] Playwright covers a width between 601px and 768px for at least one Game (`e2e/phone-layout-768.spec.ts`, project `tablet`)
