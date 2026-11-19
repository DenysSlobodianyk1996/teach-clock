# Request

From the author, 2026-11-19:

> check current privacy in dots squares repo. It looks fine for me. /privacy.html page which could be used for android. Can we do the same here? 1 page and that's all

> also check structure, looks fine in dotlines. structure I mean

> which .html url would be for privacy? How to update play store?

Answers to the follow-up questions:

- The in-app Privacy screen (`/privacy-policy`, batch 09) goes, in the Web App and the Android App alike. The Footer's Privacy opens the one static page; the Android App ships it in its bundle, and the phone's Back returns to the game through the WebView's history.
- The page is hand-written HTML, as in dot-line: `src/static/privacy.html` with its own CSS (the theme's colours copied in) and date placeholders that every build fills with the built commit's date. The build-time rendering from Vue (`scripts/buildPrivacyPage.ts`, `src/privacyStatic.ts`, `PrivacyContent.vue`, batch 12) and the `privacy.*` interface text go.
- English first, then Ukrainian, with a link to each at the top, as in dot-line.
- Plain, like dot-line: text cards only, no app header, no "До гри" link. The way back is the browser's or the phone's Back.
- The structure follows dot-line: the source in `src/static/`, a `privacyPage` plugin in `vite.config.ts` writes it to `privacy/index.html` in both builds and serves it in dev, the Footer links the full file name (Capacitor serves the app for a bare folder), and the service worker's offline fallback leaves `/privacy` to the page (`NOT_THE_APP_PAGES`, `src/static/privacy.ts`).

## The public address

https://denysslobodianyk1996.github.io/teach-clock/privacy/ (also `…/privacy/index.html`). The old `…/teach-clock/privacy.html` stops working with this batch, and `/privacy-policy` opens Welcome.

After the merge and the Pages deploy, the author changes Google Play's Privacy policy URL by hand: Play Console → Teach Clock → Policy and programs → App content → Privacy policy → the new address → Save. No new release is needed.

## Left to check on a phone

`docs/android-checks.md`, Footer links: the page opens from the Footer, sits below the status bar, and Back returns to Welcome or Settings.
