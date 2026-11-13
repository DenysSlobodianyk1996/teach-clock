# Publishing the Android App on Google Play

A guide for someone who has never published an Android app. It covers what to pay, in what order to do things, what to set up on your machine and in GitHub, and what to answer in Play Console. Terms follow [`GLOSSARY.md`](../GLOSSARY.md). The decisions behind this are in [`.scratch/08-play-store/spec.md`](../.scratch/08-play-store/spec.md) and ADR 0004.

Play Console's menus get renamed now and then. If a label below doesn't match, look for the closest one. Facts were checked on 2026-11-13.

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

```
Day 0      Create the developer account, pay $25, verify ID and phone   ─┐ can run while
Day 0–3    Google verifies your identity                                 │ tickets 01–10
           Set up your machine (JDK 21, Android Studio)                  ─┘ are built
Day ~3     Create the app in Play Console, fill in the forms,
           make the upload key, upload the first build by hand
           Start the closed test, invite ≥12 testers
Day 3–17   Closed test: ≥12 testers stay opted in 14 days in a row
           Meanwhile: service account, so CI uploads every merge
Day ~17    "Apply for production" (Google answers in ≤7 days)
Day ~24    Release to production with the "Run workflow" button
```

## 1. Create the developer account (day 0)

1. Open https://play.google.com/console/signup and sign in with the Google account that will own the app. Your own Gmail is fine. Don't lose access to it.
2. Choose **Yourself** (personal account), not Organization.
3. **Developer name**: shown on the store under the app. It can be your name or a short brand such as "Teach Clock". You can change it later.
4. Pay **US$25** with a bank card.
5. Verify your identity: legal name and address (from your Google payments profile) and an ID document. Verify your contact email and phone with one-time codes.
6. **Verify an Android phone**: install the **Google Play Console** app on a real phone (Android 10 or later, not rooted), sign in with the same account, and confirm there. New personal accounts must do this.
7. Wait for the "identity verified" email. Usually it takes a few days.

## 2. Set up your machine

You need these to build and run the Android App locally. CI builds without them.

```bash
brew install openjdk@21                       # Android build tools need Java 21 (this Mac has 17)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export ANDROID_HOME="$HOME/Library/Android/sdk"   # the SDK is already there
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

Put the three `export` lines in `~/.zshrc`. Then in **Android Studio** › Settings › Languages & Frameworks › Android SDK, install:

- **SDK Platforms**: Android 16 (API 36)
- **SDK Tools**: Android SDK Build-Tools 36, Platform-Tools, Emulator

Also create an emulator in Device Manager: a Pixel phone with API 36.

The commands come with ticket 07; see `package.json` for their final names:

```bash
npm run build:android        # VITE_TARGET=android vite build + npx cap sync android
npx cap run android          # install and start on the emulator or a USB phone
npx cap open android         # open the project in Android Studio
```

## 3. Make the upload key (once, keep it safe)

Every app bundle uploaded to Play must be signed. With **Play App Signing** (on by default for new apps), Google holds the real app key. You only keep an **upload key**, and if you lose it, Google support can reset it.

```bash
keytool -genkeypair -v -keystore ~/teach-clock-upload.jks -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

- Pick a strong password. The alias is `upload`.
- **Never commit the `.jks` file.** Back it up, and its password, in a password manager.
- The `/wizard` script (ticket 15) turns it into GitHub secrets:

```bash
gh secret set ANDROID_KEYSTORE_BASE64 < <(base64 -i ~/teach-clock-upload.jks)
gh secret set ANDROID_KEYSTORE_PASSWORD
gh secret set ANDROID_KEY_ALIAS --body upload
gh secret set ANDROID_KEY_PASSWORD
```

## 4. Create the app in Play Console

**Home › Create app**:

- App name: **Вчимо годинник — гра для дітей**
- Default language: **Українська – uk**
- App or game: **Game**. Free or paid: **Free** (this can never change to paid later)
- Tick the declarations (developer program policies, US export laws)

Then go through **Dashboard › Set up your app**. Every answer for this app:

| Form                        | Answer                                                                                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Privacy policy              | `https://denysslobodianyk1996.github.io/teach-clock/privacy.html`                                                                                                                                                                                                              |
| App access                  | All functionality is available without special access                                                                                                                                                                                                                          |
| Ads                         | **No**, the app contains no ads                                                                                                                                                                                                                                                |
| Content rating              | Fill in the questionnaire honestly: category Game/Education; no violence, no user interaction, no sharing, no purchases. You'll get a 3+ / PEGI 3 style rating                                                                                                                 |
| Target audience and content | Ages **6–8** and **9–12** only. This puts the app under the **Families policy**                                                                                                                                                                                                |
| News app                    | No                                                                                                                                                                                                                                                                             |
| Data safety                 | Does your app collect or share user data: **No**. (The name and Preferences stay on the device and are never sent, so they are not "collected")                                                                                                                                |
| Government app              | No                                                                                                                                                                                                                                                                             |
| Financial features          | None                                                                                                                                                                                                                                                                           |
| Health                      | None                                                                                                                                                                                                                                                                           |
| Store listing               | Copy from `docs/store/listing.uk.md`; add the English translation from `listing.en.md`; upload the graphics from `docs/store/`. Website: `https://denysslobodianyk1996.github.io/teach-clock/`. Email: your contact email. **No donation or jar text anywhere in the listing** |
| App category                | Game › Educational (or Education), tags as offered                                                                                                                                                                                                                             |

## 5. First build, uploaded by hand

Google only accepts automatic (API) uploads after the app has one build. So:

1. Locally (with the key from step 3):
   ```bash
   npm run build:android
   cd android && ./gradlew bundleRelease   # signing config reads the key from env vars (ticket 07)
   ```
   The file is `android/app/build/outputs/bundle/release/app-release.aab`.
2. Play Console › **Test and release › Testing › Closed testing** › create a track (the default "Alpha" is fine) › **Create release** › upload the `.aab`. Accept Play App Signing when asked.
3. Release notes: "Перша версія" / "First version".
4. **Testers**: create a Google Group (https://groups.google.com, for example `teach-clock-testers`), and add it as the track's tester list. Copy the track's **opt-in link** (looks like `https://play.google.com/apps/testing/app.teachclockforkids`).
5. **Countries**: Ukraine (add others if your testers live elsewhere).
6. Send the release for review. A closed-test review is usually quick.

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

Ask a few more than 12 (say 15): the rule needs **12 opted in for 14 days in a row**, and someone always drops out.

## 6. Let CI upload every merge (service account)

1. https://console.cloud.google.com › create a project, for example `teach-clock-play`.
2. **APIs & Services › Library** › enable **Google Play Android Developer API**.
3. **IAM & Admin › Service accounts** › Create, for example `play-uploader` › no roles needed › open it › **Keys › Add key › JSON** and download the file.
4. Play Console › **Users and permissions › Invite new users** › the service account's email (`play-uploader@…iam.gserviceaccount.com`). App permissions: **Teach Clock** › Releases: "Release to testing tracks" and "Release to production…" (and "View app information").
5. `gh secret set PLAY_SERVICE_ACCOUNT_JSON < ~/Downloads/<the-file>.json`, then **delete the downloaded file**.

From now on, each merge to `main` that changes the app uploads a new build to closed testing (ticket 12). Your testers get it as an update.

## 7. Apply for production (after 14 days)

Dashboard › **Apply for production**. Google asks about:

- the closed test: how you recruited testers, what feedback you got, what you changed;
- the app: who it is for;
- why it's ready.

Answer briefly and truthfully. A review usually takes up to 7 days.

## 8. Release to production

GitHub › Actions › **Android** › **Run workflow** › type the release notes in Ukrainian and English. Each production release is reviewed by Google, which takes hours to a few days.

After the first production release: Play Console › **Grow › Teacher Approved** (or the Families section) › opt in.

## What lives where

| Thing                       | Where                                                                                                                                | Secret? |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Package ID                  | `capacitor.config.ts`, `android/app/build.gradle`, repo variable `ANDROID_PACKAGE_ID`                                                | no      |
| Support link (Web App only) | repo variable `VITE_SUPPORT_URL` (`unset` until you fill it: `gh variable set VITE_SUPPORT_URL --body "https://send.monobank.ua/…"`) | no      |
| Upload key                  | your backup + secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`            | **yes** |
| Play API access for CI      | secret `PLAY_SERVICE_ACCOUNT_JSON`                                                                                                   | **yes** |
| Store texts and graphics    | `docs/store/`                                                                                                                        | no      |
| Privacy Page                | `public/privacy.html` → the URL above                                                                                                | no      |

## Android words you'll meet

- **AAB (app bundle)**: the file you upload to Play (`.aab`). Play makes the actual APKs for each phone from it.
- **Package ID / applicationId**: the app's permanent unique name, `app.teachclockforkids`.
- **versionCode**: a whole number that must grow with every upload. CI sets it from the run number.
- **versionName**: what users see, for example 1.0.0, taken from `package.json`.
- **Track**: a release channel: internal, closed testing, open testing, production.
- **Upload key / app signing key**: you sign uploads with the upload key; Google re-signs with the app key it keeps (Play App Signing).
- **Target SDK (API level)**: the Android version the app declares it's built for. Play requires 36 now.
