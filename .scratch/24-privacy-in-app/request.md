# Request

From the author, 2026-11-19, after batch 23 went live:

> first time - it redirects to 1st page. next time to privacy

> Oh. In website mode, it opens privacy and I can't back to website. looks like in dots squares we have https://denysslobodianyk1996.github.io/dots-and-boxes/privacy-policy separate page inside web. so we still need 2 options - public url and internal one for web. can you move back to teach-clock internal privacy-policy, the same structure as in dots lines? 1 text per lang

> so privacy link for android google play doesn't change am I right?

> oh, I see this footer link to static page in android too. and we can't back to app. tihs is wrong here too

## What was wrong

- Batch 23 made the Footer's Privacy a plain link to the static `privacy/index.html`. In the Web App and the Android App alike, that page has no way back to the game but the browser's or the phone's Back.
- The first tap after the batch 23 deploy could land on Welcome. The old app on screen opened its in-app `/privacy-policy`. Then the new version's service worker took over and reloaded that address, which batch 23 had removed, so the catch-all route sent it to Welcome. The next tap used the new Footer. The live site and a fresh visit both showed this; a later visit did not.

## What this batch does (dot-line's structure, its PR #81)

- Privacy is again an app screen, `/privacy-policy`, in both builds. It shows one text in the interface language, with the app header and a "До гри" / "Back to the game" button that returns to the screen that opened it, or to Welcome on a direct visit. The Android back button does the same.
- Each language has one text, in i18n (`privacy.*`), set out in dot-line's sections: no personal data, what stays on the device, no ads/analytics/accounts/permissions, children, contact (email and GitHub issues), developer. The wording is batch 23's.
- The Web App build renders the same component into the static `privacy/index.html` (`scripts/buildPrivacyPage.ts`, `src/privacyStatic.ts`). It shows English then Ukrainian, links each language from the top and ends each one with a link back to the game (`../`). It has no JavaScript and follows the device's light or dark theme. The Android App needs no static copy.
- The service worker still leaves `/privacy`, `/privacy/` and `/privacy/index.html` to the static page (`NOT_THE_APP_PAGES`, `src/static/privacy.ts`). The dev server serves them the same way.
- The date is spelled out by hand (`formatPrivacyDate` in `src/privacy.ts`), so Node's build and the browser print the same words.

## The public address

It doesn't change: https://denysslobodianyk1996.github.io/teach-clock/privacy/, as set in batch 23. If Play Console still has `…/teach-clock/privacy.html`, change it there (Policy and programs → App content → Privacy policy). That address has returned 404 since batch 23.

## Left to check on a phone

`docs/android-checks.md`, Footer links: Privacy opens the screen below the status bar, and both "До гри" and the back button return to Welcome or Settings.

## Noted, not this batch

`e2e/system-bars.spec.ts` "dragHours: the header below the status bar, nothing to scroll" (small-phone, 360 × 640) fails on `main` before this batch too.
