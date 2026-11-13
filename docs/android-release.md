# Publishing the Android App on Google Play

A guide for someone who has never published an Android app: what to pay, what to do on which day, what to set up on your machine and in GitHub, and what to answer in Play Console. Terms follow [`GLOSSARY.md`](../GLOSSARY.md). The decisions behind this are in [`.scratch/08-play-store/spec.md`](../.scratch/08-play-store/spec.md) and [ADR 0004](adr/0004-android-app-via-capacitor.md).

Play Console's menus get renamed now and then. If a label below doesn't match, look for the closest one. Facts were checked on 2026-11-13.

## The release wizard

You don't have to follow this page by hand. The wizard walks you through every step below, in order, opens each page, checks what is already done, and runs a command (a GitHub secret or variable, `keytool`, a build, a download, a workflow run) only after you type `y`:

```bash
bash scripts/release-wizard.sh             # the real run
bash scripts/release-wizard.sh --dry-run   # look first: runs and changes nothing
```

Run it again whenever you come back (after Google's emails, on day 14…). It skips what is done: it checks the repo's secrets and variables live, reads the dates in [`store/closed-test.md`](store/closed-test.md), and remembers the rest in `.env.release` (git-ignored; it holds no secrets). It writes dates into `store/closed-test.md`; commit that file after a run.

## What you pay, and for what

| What                                        | Cost                                                  | When                                        |
| ------------------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| Google Play developer account (personal)    | **US$25, once**, bank card (not prepaid)              | Day 0. Do it first: verification takes days |
| Package ID `app.teachclockforkids`          | free (it's just a name; Google doesn't check domains) | Becomes yours at the first upload           |
| Capacitor, Android Studio, Android SDK      | free                                                  | —                                           |
| GitHub Actions builds                       | free (the repo is public)                             | —                                           |
| Google Cloud service account for CI uploads | free (no billing needed for this API)                 | After the first upload                      |
| D-U-N-S number, company, domain             | **not needed** (personal account)                     | —                                           |

That's all: $25 once. Google takes nothing else from a free app.

## Timeline

Days are rough: Google's checks set the pace. The wizard's stages follow the same order.

| When                         | What you do                                                                      | Wizard stage | Section                                |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------ | -------------------------------------- |
| Day 0                        | Create the developer account, pay $25, verify ID and phone                       | 2            | [1](#1-developer-account-day-0)        |
| Day 0–3, while Google checks | JDK 21 and Android SDK 36 on your machine                                        | 3            | [2](#2-your-machine-day-03)            |
|                              | Make the upload key                                                              | 4            | [3](#3-upload-key-day-03)              |
|                              | Put the four signing secrets in GitHub                                           | 5            | [4](#4-signing-secrets-day-03)         |
|                              | Check the repo variables; set the support link                                   | 6            | [5](#5-repository-variables-day-03)    |
| Day ~3, identity verified    | Create the app in Play Console                                                   | 7            | [6](#6-create-the-app-day-3)           |
|                              | Answer every App content form                                                    | 8            | [7](#7-app-content-day-3)              |
|                              | Fill in the store listing and upload the graphics                                | 9            | [8](#8-store-listing-day-3)            |
|                              | Get a signed `.aab` (from CI, or build it here)                                  | 10           | [9](#9-first-upload-by-hand-day-3)     |
|                              | Upload it by hand to closed testing (track Alpha), send for review               | 11           | [9](#9-first-upload-by-hand-day-3)     |
| Day ~4, release approved     | Google Group, opt-in link, message to ~15 testers                                | 12           | [10](#10-testers-day-4)                |
|                              | Service account, so CI uploads every merge                                       | 13           | [11](#11-service-account-day-4)        |
| Day ~5–19                    | Closed test: 12 testers opted in for 14 days in a row; check the Dashboard often | 14           | [12](#12-closed-test-day-519)          |
| Day ~19 (day 14 is met)      | **Apply for production**; Google answers in ≤7 days                              | 15           | [13](#13-apply-for-production-day-19)  |
| Day ~26, access granted      | First production release with **Run workflow**                                   | 16           | [14](#14-release-to-production-day-26) |
| After the first release      | Opt in to Teacher Approved                                                       | 17           | [15](#15-teacher-approved)             |
| Every release after that     | Merge to `main` (testers get it), then Run workflow for production               | —            | [16](#16-every-release-after-that)     |

## 1. Developer account (day 0)

1. Open https://play.google.com/console/signup and sign in with the Google account that will own the app. Your own Gmail is fine. Don't lose access to it.
2. Choose **Yourself** (personal account), not Organization.
3. **Developer name**: shown on the store under the app. It can be your name or a short brand such as "Teach Clock". You can change it later.
4. Pay **US$25** with a bank card.
5. Verify your identity: legal name and address (from your Google payments profile) and an ID document. Verify your contact email and phone with one-time codes.
6. **Verify an Android phone**: install the **Google Play Console** app on a real phone (Android 10 or later, not rooted), sign in with the same account, and confirm there. New personal accounts must do this.
7. Wait for the "identity verified" email. Usually it takes a few days. Sections 2–5 don't need the account: do them meanwhile.

## 2. Your machine (day 0–3)

You need these to make the upload key and to build the Android App locally. CI builds without them.

```bash
brew install openjdk@21                         # Android build tools need Java 21 (this Mac has 17)
export JAVA_HOME="$(brew --prefix openjdk@21)"  # java_home -v 21 doesn't see Homebrew's JDK
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

Put the three `export` lines in `~/.zshrc`. Then in **Android Studio** › Settings › Languages & Frameworks › Android SDK, install:

- **SDK Platforms**: Android 16 (API 36)
- **SDK Tools**: Android SDK Build-Tools 36 (CI uses 36.1.0), Platform-Tools, Emulator

Also create an emulator in Device Manager: a Pixel phone with API 36.

The commands (scripts in `package.json`):

```bash
npm run build:android        # VITE_TARGET=android type-check and build, then cap sync android
npx cap run android          # install and start on the emulator or a USB phone
npx cap open android         # open the project in Android Studio
npm run build:apk            # build:android, then a debug APK: android/app/build/outputs/apk/debug/app-debug.apk
cd android && ./gradlew bundleRelease   # the app bundle (.aab); unsigned unless the env vars below are set
npm run check:android        # after a Gradle build: fails on location or AD_ID permissions
```

Run `npm run build:android` again after every change to the game: Gradle packages whatever is in `dist/` at the last sync. The device checklist for a release that changes `android/`, Capacitor or a plugin is [`android-checks.md`](android-checks.md).

The release build reads its signing key and version from environment variables:

| Variable                    | What                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| `ANDROID_KEYSTORE_PATH`     | path to the upload key's `.jks` file; unset = unsigned build       |
| `ANDROID_KEYSTORE_PASSWORD` | the keystore's password                                            |
| `ANDROID_KEY_ALIAS`         | the key's alias (`upload`)                                         |
| `ANDROID_KEY_PASSWORD`      | the key's password: the same as the keystore's (see section 3)     |
| `VERSION_CODE`              | the versionCode; CI sets the run number, local builds default to 1 |

`versionName` is always the `version` in `package.json`.

## 3. Upload key (day 0–3)

Every app bundle uploaded to Play must be signed. With **Play App Signing** (on by default for new apps), Google holds the real app key. You only keep an **upload key**, and if you lose it, Google support can reset it.

```bash
keytool -genkeypair -v -keystore ~/teach-clock-upload.jks -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

- Pick a strong password. The alias is `upload`. keytool also asks for a name and country: they only go into the certificate.
- keytool makes a PKCS12 keystore, which has one password for the store and the key. So `ANDROID_KEY_PASSWORD` is the same as `ANDROID_KEYSTORE_PASSWORD`.
- **Never commit the `.jks` file.** Back it up, and its password, in a password manager.
- Make it once. A new key after the first upload needs Play support to reset the upload key.

## 4. Signing secrets (day 0–3)

CI (`.github/workflows/android.yml`) signs each bundle with four repository secrets. The wizard sets them from the `.jks` and the password (it checks the password with keytool first):

```bash
gh secret set ANDROID_KEYSTORE_BASE64 < <(base64 < ~/teach-clock-upload.jks)
gh secret set ANDROID_KEYSTORE_PASSWORD
gh secret set ANDROID_KEY_ALIAS --body upload
gh secret set ANDROID_KEY_PASSWORD      # the same password
```

All four or none: with none, CI builds an unsigned bundle and warns; with only some, the build fails. From the next merge to `main` that changes the app, the run's artifact is a signed bundle named `teach-clock-<run number>` (kept 14 days).

## 5. Repository variables (day 0–3)

GitHub › Settings › Secrets and variables › Actions › Variables:

- `ANDROID_PACKAGE_ID` = `app.teachclockforkids`. Already set; CI uploads to this app.
- `VITE_SUPPORT_URL` = your monobank jar link (`https://send.monobank.ua/…`). It is `unset` until you fill it, and then the Web App shows the Support Button from its next deploy. Web App only: the Android App and the Play listing never show it.

```bash
gh variable set VITE_SUPPORT_URL --body "https://send.monobank.ua/…"
gh workflow run deploy.yml --ref main   # redeploy the website now, or wait for the next app change
```

## 6. Create the app (day ~3)

Once the "identity verified" email has come: Play Console › **Home › Create app**:

- App name: **Вчимо годинник — гра для дітей**
- Default language: **Українська – uk**
- App or game: **Game**. Free or paid: **Free** (this can never change to paid later)
- Tick the declarations (developer program policies, US export laws)

## 7. App content (day ~3)

**Dashboard › Set up your app** (the same forms are under Policy › App content). Every answer for this app:

| Form                        | Answer                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Privacy policy              | `https://denysslobodianyk1996.github.io/teach-clock/privacy.html` (live once batch 08 is merged to `main`)                                                     |
| App access                  | All functionality is available without special access                                                                                                          |
| Ads                         | **No**, the app contains no ads                                                                                                                                |
| Content rating              | Fill in the questionnaire honestly: category Game/Education; no violence, no user interaction, no sharing, no purchases. You'll get a 3+ / PEGI 3 style rating |
| Target audience and content | Ages **6–8** and **9–12** only. This puts the app under the **Families policy**                                                                                |
| News app                    | No                                                                                                                                                             |
| Data safety                 | Does your app collect or share user data: **No**. (The name and Preferences stay on the device and are never sent, so they are not "collected")                |
| Government app              | No                                                                                                                                                             |
| Financial features          | None                                                                                                                                                           |
| Health                      | None                                                                                                                                                           |
| App category                | Game › Educational (or Education), tags as offered. Contact email: yours. Website: `https://denysslobodianyk1996.github.io/teach-clock/`                       |

## 8. Store listing (day ~3)

Grow users › Store presence › **Main store listing**. Ukrainian is the default language; add English as a translation. Everything is in [`docs/store/`](store/):

| Field                                | Ukrainian (default)                                    | English (`en-US`)                      |
| ------------------------------------ | ------------------------------------------------------ | -------------------------------------- |
| App name, short and full description | [`listing.uk.md`](store/listing.uk.md)                 | [`listing.en.md`](store/listing.en.md) |
| Phone screenshots (8, 1080×1920)     | `store/screenshots/uk/1-welcome.png` … `8-summary.png` | `store/screenshots/en/…`               |
| App icon (512×512)                   | `store/icon-512.png`                                   | the same                               |
| Feature graphic (1024×500)           | `store/feature-graphic.png`                            | the same                               |

Website: `https://denysslobodianyk1996.github.io/teach-clock/`. Email: your contact email. **No donation or jar text anywhere in the listing.** `npm run store-shots` redraws the screenshots and the feature graphic after UI or text changes.

## 9. First upload, by hand (day ~3)

Google only accepts automatic (API) uploads after the app has one build, so this one goes by hand.

1. Get a signed `.aab`, either way:
   - **From CI**: GitHub › Actions › **Android app bundle** › the latest successful run on `main` › artifact `teach-clock-<run number>` (not `-unsigned`). Or: `gh run download <run id> --name teach-clock-<n>`. A signed one exists once section 4 is done and an app change has been merged since.
   - **Here** (with the key from section 3):
     ```bash
     npm run build:android
     export ANDROID_KEYSTORE_PATH=~/teach-clock-upload.jks ANDROID_KEY_ALIAS=upload
     read -s ANDROID_KEYSTORE_PASSWORD && export ANDROID_KEYSTORE_PASSWORD ANDROID_KEY_PASSWORD=$ANDROID_KEYSTORE_PASSWORD
     (cd android && ./gradlew bundleRelease)
     npm run check:android
     ```
     The file is `android/app/build/outputs/bundle/release/app-release.aab`.
2. Play Console › **Test and release › Testing › Closed testing** › the default track **Alpha** › **Create release** › upload the `.aab`. Accept Play App Signing when asked. **Keep the track Alpha**: CI uploads every merge to the track id `alpha`, so a new or renamed track would get nothing.
3. Release notes: "Перша версія" / "First version".
4. **Countries**: Ukraine (add others if your testers live elsewhere).
5. **Testers**: a Google Group (section 10). Then send the release for review. A closed-test review is usually quick.

## 10. Testers (day ~4)

1. Create a Google Group at https://groups.google.com (for example `teach-clock-testers`).
2. Closed testing › Alpha › **Testers** › add the group's email as the tester list.
3. Copy the track's **opt-in link** (looks like `https://play.google.com/apps/testing/app.teachclockforkids`).
4. Send the message below to about 15 people. The wizard prints it with both links filled in, and copies it to the clipboard.

### Message for testers

> Привіт! Готую до Google Play гру «Вчимо годинник», яка вчить дітей читати годинник. Google вимагає 14 днів закритого тесту — допоможеш?
>
> 1. Приєднайся до групи: <посилання на Google Group> (тим Google-акаунтом, що на твоєму Android-телефоні).
> 2. Відкрий <посилання для тестувальників> і натисни «Стати тестувальником».
> 3. Встанови гру з Google Play і **не видаляй її 14 днів**. Пограти хоч раз — ще краще!
>    Дякую! 🙌
>
> Hi! I made "Teach Clock", a game that teaches kids to read a clock, and I'm getting it onto Google Play. Google requires a 14-day closed test — could you help?
>
> 1. Join the group: <Google Group link> (with the Google account on your Android phone).
> 2. Open <opt-in link> and tap "Become a tester".
> 3. Install the game from Google Play and **keep it installed for 14 days**. Playing it once or twice helps too!
>    Thanks! 🙌

Ask a few more than 12 (say 15): the rule needs **12 opted in for 14 days in a row**, and someone always drops out. Track who opted in, and the dates, in [`store/closed-test.md`](store/closed-test.md), with labels (T1, T2…) only: the repo is public.

## 11. Service account (day ~4)

So CI can upload every merge:

1. https://console.cloud.google.com › create a project, for example `teach-clock-play`.
2. **APIs & Services › Library** › enable **Google Play Android Developer API**.
3. **IAM & Admin › Service accounts** › Create, for example `play-uploader` › no roles needed › open it › **Keys › Add key › JSON** and download the file.
4. Play Console › **Users and permissions › Invite new users** › the service account's email (`play-uploader@…iam.gserviceaccount.com`). App permissions: **Teach Clock** › "Release to testing tracks" **and** "Release to production…" (and "View app information"). The production run needs both.
5. `gh secret set PLAY_SERVICE_ACCOUNT_JSON < ~/Downloads/<the-file>.json`, then **delete the downloaded file**.

From then on, each merge to `main` that changes the app builds a signed bundle and uploads it to the **alpha** track with the release notes "Покращення та виправлення" / "Improvements and fixes". Your testers get it as an update. Until the secret is set, the upload step is skipped with a warning (the bundle is still kept as an artifact).

## 12. Closed test (day ~5–19)

Play Console › your app › **Dashboard** › the "Apply for production" section shows how many testers are opted in and for how many days the rule has been met. Google's count decides. Check it every few days and log it in [`store/closed-test.md`](store/closed-test.md), with the feedback and what you changed: the application asks for it.

When the Dashboard first shows 12 opted in, the wizard writes that day and the earliest day to apply (14 days later) into the Key dates table, and reminds you of it. If fewer than 12 stay opted in, the 14 days start again.

## 13. Apply for production (day ~19)

When the Dashboard says the 14 days are met: Dashboard › **Apply for production**. Google asks about:

- the closed test: how you recruited testers, what feedback you got, what you changed;
- the app: who it is for;
- why it's ready.

Answer briefly and truthfully; your drafts are at the end of [`store/closed-test.md`](store/closed-test.md). A review usually takes up to 7 days.

## 14. Release to production (day ~26)

GitHub › Actions › **Android app bundle** › **Run workflow** (branch `main`) › type the release notes in Ukrainian (`notes_uk`) and English (`notes_en`), at most 500 characters each. The wizard can start it for you (`gh workflow run android.yml --ref main -f notes_uk=… -f notes_en=…`). The run builds a new bundle from `main` and uploads it straight to production (the upload action can't promote a closed-testing release). It fails if `PLAY_SERVICE_ACCOUNT_JSON` isn't set or the run isn't on `main`. Each production release is reviewed by Google, which takes hours to a few days.

## 15. Teacher Approved

After the first production release: Play Console › **Grow › Teacher Approved** (or the Families section) › opt in.

## 16. Every release after that

1. Merge to `main`. If the app changed, CI builds and uploads it to closed testing; the website deploys too.
2. If `android/`, Capacitor or a plugin changed, go through [`android-checks.md`](android-checks.md).
3. GitHub › Actions › Android app bundle › Run workflow, with release notes.

## What lives where

| Thing                       | Where                                                                                                                                    | Secret? |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Package ID                  | `capacitor.config.ts`, `android/app/build.gradle`, repo variable `ANDROID_PACKAGE_ID`                                                    | no      |
| Support link (Web App only) | repo variable `VITE_SUPPORT_URL` (`unset` until you fill it)                                                                             | no      |
| Upload key                  | your `.jks` and its backup + secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` | **yes** |
| Play API access for CI      | secret `PLAY_SERVICE_ACCOUNT_JSON`                                                                                                       | **yes** |
| CI build and upload         | `.github/workflows/android.yml` (Actions name "Android app bundle")                                                                      | no      |
| Release wizard              | `scripts/release-wizard.sh`; its progress in `.env.release` (git-ignored, no secrets)                                                    | no      |
| Key dates, testers, answers | `docs/store/closed-test.md` (labels only)                                                                                                | no      |
| Store texts and graphics    | `docs/store/`                                                                                                                            | no      |
| Privacy Page                | `public/privacy.html` → `https://denysslobodianyk1996.github.io/teach-clock/privacy.html`                                                | no      |

## Android words you'll meet

- **AAB (app bundle)**: the file you upload to Play (`.aab`). Play makes the actual APKs for each phone from it.
- **Package ID / applicationId**: the app's permanent unique name, `app.teachclockforkids`.
- **versionCode**: a whole number that must grow with every upload. CI sets it from the run number.
- **versionName**: what users see, for example 1.0.0, taken from `package.json`.
- **Track**: a release channel: internal, closed testing (`alpha`), open testing, production.
- **Upload key / app signing key**: you sign uploads with the upload key; Google re-signs with the app key it keeps (Play App Signing).
- **Target SDK (API level)**: the Android version the app declares it's built for. Play requires 36 now.
