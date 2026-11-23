# One Play app; the Game Name under the icon follows the device's language

Teach Clock is one Google Play app, with an English listing as the default and a Ukrainian translation. The Game Name under the Android App's icon is "Вчимо годинник" when the phone's language list reaches Ukrainian before English, and "Teach Clock" otherwise, because Android reads the name from the app's resources before the game runs, so it cannot follow the in-app УК/EN switch. To keep the first launch consistent with the icon, the interface language follows the device by the same rule until the Player taps УК/EN.

## Amendment (batch 28)

The two-language rule is now the shared language list in `src/i18n/locales.ts`. The interface starts in the first device language whose base language is on the list, and otherwise in English. A language the Player picks from the header's menu is saved and wins. The Android App has one `values-<code>` name per language, with English as the default resources, so a phone with no listed language shows "Teach Clock". Where this record says Ukrainian or English, the same rule now applies to every listed language.

## Considered Options

- **Two Play apps, one per language.** Rejected: Play's repetitive-content policy targets near-identical apps, ratings and installs would split, and every release would go through review twice. The package id is permanent, so this cannot be undone cheaply later.
- **One name in every language** (as before: always "Вчимо годинник"). Rejected: an English phone showed a Ukrainian name and then opened the game in Ukrainian.

## Consequences

- The icon and the interface can disagree after the Player switches language: a Ukrainian phone keeps "Вчимо годинник" under the icon while the game shows English. That is expected, not a bug.
- An installed Web App keeps the name the browser saw at install time, which is the Game Name in the interface language at that moment.
- Players who opened the game before this change have `uk` saved and keep it; only a tap on УК/EN saves a language from now on.
