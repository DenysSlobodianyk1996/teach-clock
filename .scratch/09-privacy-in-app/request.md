# Request

From the author, 2026-11-13, after testing the debug APK on a phone:

> конфіденційність. can you do this page as part of app, not separate page? or current approach is fine? So in android - just android screen. in browser - as other pages. Just plain Vue component

Answers to the follow-up questions:

- The in-app screen shows the interface language (the УК/EN switch), not both languages.
- The public `privacy.html` that Google Play's listing needs is generated at build from the same text, so it can't drift.

Added during the work:

> Inside privacy - also add url to web version of game

> adjust scratch or other docs if needed
