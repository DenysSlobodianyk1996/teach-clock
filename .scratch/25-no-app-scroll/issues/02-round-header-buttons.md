# 02: The header's tools are round buttons

**Blocked by:** none

**Status:** done

**What to build:** language and theme become round buttons like Home and Leave (`.icon-btn`), one component for all of them. Language shows the current language's code (УК / EN); a tap switches to the other. Theme shows the current theme's icon (sun / moon); a tap switches it. No segmented control, no slider. Screen readers hear the button's purpose and the current value.

**Checklist:**

- [x] `HeaderButton` component; `PreferenceSwitches` uses it; `AppHeader`'s Home and Leave use it.
- [x] i18n `header.*` labels in `uk` and `en`.
- [x] Unit and e2e tests that found the old group and switch.
