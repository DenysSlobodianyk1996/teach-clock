# Request

From the author, 2026-11-16, on the live Web App (https://denysslobodianyk1996.github.io/teach-clock/privacy):

> Smth wrong with cache on server. I open page - all is fine - img 1. When click f5 - img 2 - how it looked previously

- img 1: `images/01-in-app-before-reload.png` (the Privacy Page opened from the Footer)
- img 2: `images/01-after-reload.png` (the same address after F5)

> Also after f5 when I click back in browser navigation, it redirects url to /teach-clock/, but main page isn't opened at all

Not a cache problem. The in-app Privacy Page lives at `/privacy`, and the build also writes the static `privacy.html` for Google Play's listing. GitHub Pages serves `privacy.html` for `/privacy`, so a reload lands on the static page instead of the app. That page has no app code, so Back only changes the address. Other addresses have no file of their own and fall back to `404.html`, the app.

Answers to the follow-up questions:

- Both pages should look the same; renaming the in-app address so nothing collides is fine.
- Guard it with a test: no app route may match a file the build writes.
- A separate page stays only because Google Play needs a public Privacy policy URL that works without the app (status 200, readable without JavaScript). The Play URL stays `…/teach-clock/privacy.html`.
- One page: the Vue Privacy Page is the source, and the build renders `privacy.html` from that same component, so there is nothing to keep in sync by hand.

> Also, don't have any collision anymore

- The in-app address becomes `/privacy-policy`.
- `privacy.html` shows both languages at the same time, Ukrainian first, then English. The app keeps showing only the interface language.
- `privacy.html` shows the app header with the logo and title only (no УК/EN or sun/moon), follows the device's light/dark setting, and its "До гри" opens the web game.
- The old `/privacy` address gets no redirect: it lands on `privacy.html`, which now looks like the app.
- One batch, one PR.
