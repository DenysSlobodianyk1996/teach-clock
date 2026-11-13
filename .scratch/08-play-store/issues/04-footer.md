# 04: Footer with Privacy and Contact

Covers: P4, P5

**What to build:** a plain, non-sticky Footer at the bottom of Welcome and Settings with a Privacy link and a Contact mailto link. See the spec, Footer.

**Blocked by:** 03

**Status:** done

- [x] `AppFooter.vue` on `WelcomeView` and `SettingsView` only; never in a Round or on Summary
- [x] Privacy opens `privacy.html` in a new tab (respects `base`)
- [x] Contact: `mailto:<author email>?subject=Contact%20support%20from%20teach%20clock%20for%20kids`; the address lives in one config constant, not in i18n
- [x] i18n keys in `uk.ts` and `en.ts` (`footer.privacy`, `footer.contact`)
- [x] Fits all three themes; does not push Welcome's main button below the fold on a 360×640 phone (`fits-small-phone` passes). Note: on 360×640 the start button already ends at ~758 px without the Footer (the clock art sits above the form); the Footer only comes after it
- [x] Vitest component spec; Playwright: Footer on Welcome and Settings, absent in a Round and on Summary
