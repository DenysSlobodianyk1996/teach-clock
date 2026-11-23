# 04: German end to end

**What to build:** A Player on a German device opens Teach Clock in German and can play every Game in both Modes. The Game Name "Uhr lernen", the Android App's name, the installed Web App's name and the Privacy Page all follow. German is the longest-text stress test, so shared layouts are fixed here.

**Blocked by:** 03 Language menu

**Status:** todo

- [ ] DE appears in the menu after УК, and a German device starts in German
- [ ] Every interface key is translated with the same placeholders as the Ukrainian source
- [ ] Clock words use `kleiner / großer Zeiger`, and the two halves of a day read naturally
- [ ] Messages with hours, numbers and counts avoid wrong articles and plurals
- [ ] The Game Name is "Uhr lernen" in the app, tab title, web manifest and Android App, never shortened
- [ ] The in-app Privacy Page and its dates are in German
- [ ] The public Privacy Page adds German under language links at the top, at the same address and with no JavaScript
- [ ] Long words stay inside Settings cards, buttons, toasts and headings
- [ ] Welcome, Settings, every Round and the Summary pass the no-scroll and fit checks at 360 × 728, 360 × 640 and 320 × 640
- [ ] ADR 0005 is amended to the shared list and English fallback
- [ ] Language data, manifest, Android name and Privacy tests cover German
