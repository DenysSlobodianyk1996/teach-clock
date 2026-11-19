# 04: A cream app icon with no dark tile

**Blocked by:** none (can start immediately)

**Status:** done

**What to build:** the app icon loses its dark tile. Its background becomes the clock face's cream and the clock grows to fill the shape, so on a round launcher the icon is the clock itself and on a squircle or square one it sits whole on cream. The same icon on Android (adaptive, and the Android 7 legacy and round icons), in the Web App (maskable and Apple touch icons) and on Google Play (`icon-512.png`). The splash screen keeps its theme colours. Truly transparent was rejected: launchers fill a transparent layer their own way. See [`../spec.md`](../spec.md).

**Checklist:**

- [x] Tests first: the Android icon generator's test expects the cream background and a foreground clock that fits the adaptive icon's safe circle (about 66 dp of the 108 dp layer).
- [x] One named icon background colour (the clock face's cream) beside the brand mark, used by both the Android and the Web App icon generators; not a theme background, so the splash and the manifest's theme colours stay as they are.
- [x] Regenerate every icon with the existing scripts (Android assets, then PWA assets); no hand-drawn PNGs.
- [x] Look at the result on a round, squircle and square mask and at the Android 7 icon before committing; attach the renders to the PR. (Rendered with sharp outside the repo: round, squircle, rounded square and square masks on dark and light wallpapers, the Android 7 square and round icons, the maskable icon through its 80% safe circle, the Apple touch icon and the Play icon with rounded corners. Nothing cut off.)
- [ ] A debug APK on a phone shows the new icon on the home screen. (Human step, not done by the agent: `npm run build:apk`, sideload, check the home screen.)

**Out of scope:** the brand mark itself, the splash, the feature graphic. Uploading `icon-512.png` is in 06.
