---
title: Teach Clock on Google Play, plus a Footer and a Support Button
status: done
---

# Teach Clock on Google Play, plus a Footer and a Support Button

Terms follow [`GLOSSARY.md`](../../GLOSSARY.md). The new terms (Web App, Android App, Footer, Support Button, Privacy Page) are added in ticket 01. Decisions come from a grilling session on 2026-11-13. Google Play facts were checked against Google's own pages that day; see "Play facts" below.

The steps only the author can take (account, the $25 fee, keys, Play Console forms, testers) are written up for a first-time publisher in [`docs/android-release.md`](../../docs/android-release.md).

## Problem Statement

Teach Clock exists only as a website and installable PWA on GitHub Pages. Parents look for children's apps on Google Play, so the game is hard to find. The site also has no privacy statement, no way to contact the author and no way to support the author.

## Solution

Ship the same Vue app two ways from one codebase:

- **Web App** (website and installed PWA, GitHub Pages): as today, plus a **Footer** on Welcome and Settings with the **Privacy Page** link, a Contact mailto link and the **Support Button**.
- **Android App** (Google Play, package `app.teachclockforkids`): a Capacitor build that packages the built game inside the app. It works offline from the first launch and has no service worker. Its Footer has Privacy and Contact but **never the Support Button**: Play forbids leading users to payment outside Google Play billing.

A merge to `main` that changes the app deploys the Web App and uploads a signed Android App to Play's **closed testing** track. Releasing to **production** is a manual "Run workflow" button.

## User Stories

- **P1** As a parent, I find "Вчимо годинник — гра для дітей" on Google Play. The listing is in Ukrainian by default and in English too.
- **P2** As a Player, the Android App opens and plays every Game with no internet, including on first launch.
- **P3** As a Player on Android, the back button never drops me out in the middle of a Round: during a Round it asks first (the existing leave dialog).
- **P4** As a parent, I can read the Privacy Page from the Web App, the Android App and the Play listing. It says that nothing is collected.
- **P5** As a parent, I can email the author from the Footer.
- **P6** As a Web App user, I can support the author: I hold the Support Button for 2 seconds and the monobank page opens in a new tab. A child tapping by accident opens nothing.
- **P7** As the author, a merge to `main` that changes the app updates the website and gives my testers a new Android build. Docs-only merges do neither. I release to production with one button.

## Implementation Decisions

### Shared

- **ADR 0004**: the Android App is Capacitor with the built game packaged inside. Rejected: a Trusted Web Activity (the PWA wrapper made with Bubblewrap or PWABuilder), because it can't open offline on first launch, needs `assetlinks.json` at the root of `denysslobodianyk1996.github.io` (our app lives on a subpath), shows a browser address bar if that check fails, and depends on Chrome. Cost accepted: each update is a Play release, not an instant web deploy.
- **Build target**: `VITE_TARGET=android` marks the Android build. `vite.config.ts` leaves out VitePWA (no service worker, no manifest) for it, and `base` stays `/`. The app reads the target from one helper (for example `src/platform.ts`, `isAndroidApp`); components never read `import.meta.env` directly.
- **Manifest**: `name` "Вчимо годинник", `lang: 'uk'`, Ukrainian `description`. `short_name` must fit under an icon.
- **Version**: `package.json` goes to `1.0.0`. `versionName` = `package.json` version (raised by hand: 1.0.x fixes, 1.x.0 features). `versionCode` = GitHub run number of the Android workflow (always increasing).
- **GitHub repo variables** (already created):
  - `ANDROID_PACKAGE_ID` = `app.teachclockforkids`
  - `VITE_SUPPORT_URL` = `unset` placeholder; the author fills in the monobank link (send.monobank.ua)

### Footer and Privacy Page

- **Footer**: plain bar at the bottom of the page content, not sticky, on **Welcome and Settings only**. Never during a Round or on Summary.
  - **Privacy** link to the Privacy Page. Opens in a new tab on the Web App, and in the system browser on the Android App.
  - **Contact**: `mailto:` the author's email with subject "Contact support from teach clock for kids". The address is the author's own (public on Play anyway). It is set once in config, not in i18n.
  - **Support Button**: Web App only.
- **Privacy Page**: static `public/privacy.html`, outside the Vue app, Ukrainian then English on one page. Theme colours from `src/styles/theme.css` tokens, readable on a phone. Its public URL `https://denysslobodianyk1996.github.io/teach-clock/privacy.html` goes into the Play listing. Text: the draft agreed in the grilling. It says:
  - no data is collected;
  - no accounts, ads, analytics or third-party services, and nothing is sent;
  - only the Preferences and the last name stay on the device, and clearing the app's or site's data erases them;
  - results are not kept after a Round;
  - the contact email.

### Support Button

- Shown only when the Web App is running **and** `VITE_SUPPORT_URL` starts with `https://`. So `unset`, empty or the Android App hides it.
- **Hold to open**:
  - press and hold for 2 s; a ring fills around a heart icon;
  - letting go early cancels;
  - Enter or Space held from the keyboard works the same;
  - a small hint under it reads "Утримуй, щоб відкрити" ("Hold to open");
  - after a full 2 s hold the ring stays full, and the release that follows (pointer up, or keyup of Enter/Space) calls `window.open(url, '_blank', 'noopener')`, once per hold. It opens on the release, not when the 2 s run out, because browsers (Safari, touch screens) only allow a new tab during a user gesture and a timer is none;
  - the hold resets when the page is hidden, the pointer leaves or is cancelled, or the button loses focus.
  - With `prefers-reduced-motion`, the ring still fills (it shows progress), just without easing.
- `deploy.yml` passes `VITE_SUPPORT_URL: ${{ vars.VITE_SUPPORT_URL }}` to `npm run build`.

### Android App

- `capacitor.config.ts`: `appId: 'app.teachclockforkids'`, `appName: 'Вчимо годинник'`, `webDir: 'dist'`. The launcher label (`title_activity_main` in `android/app/src/main/res/values/strings.xml`) is the short "Годинник", like the manifest `short_name`, so it is not cut off under the icon.
- `android/` is committed. Target and compile SDK **36**; min SDK as Capacitor's default. JDK **21** (CI and local).
- Permissions: only what Capacitor needs. **No location, no `AD_ID`**, no internet-dependent plugins. Apps aimed only at children must not request these.
- Icons and splash: adaptive icon and splash generated from `public/favicon.svg` (`@capacitor/assets` or a script next to `generate-pwa-assets`).
- **Back button** (`@capacitor/app` `backButton`):
  - Welcome: exit the app.
  - Settings: back to Welcome.
  - Round: open `LeaveRoundDialog`; if it is open, close it.
  - Summary: go to Welcome.
  - Any open popup: close it first.
- External links (Privacy, mailto) open outside the app's WebView.
- Orientation: both portrait and landscape, as on the web.

### CI

- **Path filter** (both workflows; each also watches its own file and keeps `workflow_dispatch`):
  - triggers: `src/**`, `public/**`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `tsconfig*`, `env.d.ts`;
  - the Android workflow also watches `android/**`, `capacitor.config.ts` and `scripts/**` (the icon, splash and manifest-check scripts);
  - never triggers on its own: `docs/`, `.scratch/`, `e2e/`, `*.md`, test files.
- **Android workflow** (`.github/workflows/android.yml`):
  - on push to `main` (path filter): `npm ci` → `VITE_TARGET=android npm run build` → `npx cap sync android` → Gradle `bundleRelease` signed with the upload key from secrets → upload to Play **closed testing** with release notes "Покращення та виправлення" / "Improvements and fixes".
  - **Production**: `workflow_dispatch` with inputs for Ukrainian and English release notes. It promotes the latest closed-testing build to production (or builds and uploads to production; whichever the upload action supports cleanly).
  - Upload with a Google Play service account (JSON in a secret). Package name from `vars.ANDROID_PACKAGE_ID`.
  - The very first upload is done by hand in Play Console (Google allows API uploads only after the app exists). Until then the upload step is skipped.
- **Concurrency**: the Android workflow runs one at a time per event and branch, so a pending production run is never replaced by a later push.
- **Secrets** (created by the wizard): `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `PLAY_SERVICE_ACCOUNT_JSON`. Play App Signing is on, so this key is only the **upload** key and can be reset if lost.

### Store listing (`docs/store/`)

- `listing.uk.md` (default language, `uk`) and `listing.en.md`:
  - title up to 30 characters: "Вчимо годинник — гра для дітей" / "Teach Clock — clock for kids";
  - short description up to 80 characters;
  - full description up to 4000 characters.
- No donation, jar or payment wording, and no email in the description (Play shows the contact email itself). Website field: the Web App's home page.
- Graphics, drawn by script (Playwright), committed to `docs/store/`:
  - 8 phone screenshots per language at 1080×1920 (9:16), covering all four Games and both Modes (Teach and Test), so the game is eligible for promotion;
  - a 1024×500 feature graphic (original SVG to PNG, no alpha);
  - a 512×512 icon (32-bit PNG).
- Play Console answers (the wizard walks through them):
  - target audience 6–8 and 9–12 only;
  - no ads;
  - Data safety: no data collected or shared;
  - content rating questionnaire: no violence, no user interaction, no purchases;
  - category: Education (or Games › Educational);
  - opt in to Teacher Approved after the first production release.

## Testing Decisions

- Vitest:
  - Footer shows Privacy and Contact, and shows the Support Button only for the Web App with an `https://` URL (three cases: Web App with URL, Web App with `unset`, Android App with URL);
  - Support Button: a hold under 2 s does nothing, the release after a 2 s hold opens the URL, keyboard hold works (fake timers);
  - back-button handler per screen: route logic tested without Capacitor (the handler takes the router state).
- Playwright (Web App): the Footer is on Welcome and Settings, not in a Round or on Summary; the Privacy Page loads offline after the first visit (it is in the precache); `fits-small-phone` still passes with the Footer.
- Android: a CI step lists the merged manifest permissions and fails if location or `AD_ID` appear; a manual check on a device or emulator in airplane mode on first launch (ticket 10 checklist).
- Tests look up text with `t`, as always.

## Play facts (checked 2026-11-13, official Google pages)

- New personal accounts: a closed test with **12 testers opted in for 14 days in a row**, then "Apply for production" (review usually within 7 days). A real Android 10+ phone must be verified through the Play Console app. $25 one-off fee, no prepaid cards; Ukraine is supported. Source: support.google.com/googleplay/android-developer/answer/14151465, /6112435, /9306917
- New apps and updates must target **API 36** (from 31 Aug 2026). Source: developer.android.com/google/play/requirements/target-sdk
- Families: a privacy policy is needed before the target-audience form can be filled in. Apps aimed only at children must not request location or `AD_ID`, and may use only approved SDKs. No general parental-gate rule; we hold-to-open anyway. Source: support.google.com/googleplay/android-developer/answer/9893335, /9867159
- Payments: the app and the store listing "may not lead users to a payment method other than Google Play's billing system". The only exception is tax-exempt donations. So there is no Support Button in the Android App and no donation text in the listing. Source: support.google.com/googleplay/android-developer/answer/9858738
- Listing limits 30/80/4000. Screenshots: at least 2 to publish; games need 3+ at 9:16 or 16:9 and at least 1080 px for promotion. Source: support.google.com/googleplay/android-developer/answer/9859152, /9866151

## Follow-ups

Found while building the batch; not fixed here.

- **Welcome start button below the fold at 360×640** (older than this batch): on a 360×640 phone Start ends at about 758 px, so the Player scrolls to reach it. The Footer now sits under it too.
- **Summary confetti covers the headline on phones**: `SummaryConfetti.vue` drops over "Well done, …" on a phone. The store screenshot of the Summary hides the confetti to work round it.
- **Set Time number pad below the fold in phone landscape**: on a phone held sideways the pad sits partly under the bottom edge, so the Player scrolls to type.

## Out of scope

- Payments of any kind inside the Android App (no Play Billing tips).
- iOS / App Store.
- A custom domain.
- Ages 13+ in the target audience.
