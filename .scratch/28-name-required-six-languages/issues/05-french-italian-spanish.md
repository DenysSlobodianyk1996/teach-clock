# 05: French, Italian and Spanish end to end

**What to build:** Repeat the German path for French, Italian and Spanish, so a Player on any of those devices gets the whole game, Game Name, installed name and Privacy Page in their language. The menu then lists all six: EN, УК, DE, FR, IT, ES.

**Blocked by:** 04 German end to end

**Status:** done

- [x] FR, IT and ES appear in the menu in that order, and matching devices start in them
- [x] Every interface key is translated with the same placeholders as the Ukrainian source
- [ ] Clock words use `petite / grande aiguille`, `lancetta` and `manecilla`, and the two halves of a day read naturally
- [x] Messages avoid article, elision and count agreement around hours, numbers and counts
- [x] French uses non-breaking spaces before `!` and `?`, and the ⓘ stays attached to the heading's last word
- [x] Game Names are "Apprendre l'heure", "Impara l'ora" and "Aprende la hora" everywhere, never shortened
- [x] The in-app Privacy Page and its dates follow each language
- [x] The public Privacy Page has all six texts with language links at the top
- [x] All screens pass the no-scroll and fit checks in all six languages at 360 × 728, 360 × 640 and 320 × 640
- [x] Language data, manifest, Android name and Privacy tests cover all six languages

Not ticked: the clock words are checked, but whether the two halves of a day read naturally waits for the native review. Game Names are checked in the app, manifests, Android resources and Privacy Page; the FR, IT and ES store listings come with the store tickets.
