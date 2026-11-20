# Request

From the author, 2026-11-20, after batch 24:

> Some issues before, you fixed this state by adding paddings at top and bottom. (`images/01-s8-bars-over-header.png`, `images/01-s8-settings-scrolled.png`)
> Problem, that occur for me, that in my Oppo A series phone scroll appeared nearly in every screen, including games too (a screen recording: `images/01-oppo-welcome-top.jpg`, `images/01-oppo-welcome-scrolled.jpg`)
> So, I don't like such "app scrolls" at all. Potential fix - inline styles for header, footer. Main area - 100 vh / dvh minus height of header + footer. And main area overflow auto. In this case, we will have inapp scroll, not whole app scrolls and header disappear.

> issue was when we didn't have such top/bottom paddings

> also, we can simplify header. Do other buttons the same as home button. Theme change - circle with current theme icon - click theme - icon and theme changed, no slider at all. The same for lang - circle with current lang - click - change lang. Reuse the same component, occupy less header space

> update design too if needed. and screenshots for store

> plan is fine. in the end I expect 1 branch with all fixes

## What was wrong (measured)

An Android 14 emulator set up like the Oppo A (720 × 1600 at 320 dpi, 3-button navigation, WebView 113) gives the app 728 CSS px between the bars, as the phone does. A script read over DevTools how far each screen scrolled the whole document:

| Setup                             | Welcome | Settings | Drag Hours / Minutes | Drag Arrows, Set Time |
| --------------------------------- | ------- | -------- | -------------------- | --------------------- |
| font 100 %, UK and EN             | 61      | 0        | 0                    | 0                     |
| font 130 %                        | 61      | 0        | 1                    | 0                     |
| larger Display size (640 px tall) | 61      | 0        | 39                   | 0                     |

- Welcome on a phone was at least a screen tall less the header, and the Footer came after it: every phone scrolled by the Footer's 61 px. Batch 19 meant it ("the Footer follows Start"); the tests scrolled to reach the Footer.
- The Rounds' clocks were sized from the screen's height less a measured constant, so a phone with less height than measured scrolled.
- The top and bottom paddings are right. On WebView 140 and newer Capacitor draws the app under the bars and reports their sizes (the S8 in the screenshots, before batch 21); on older WebViews it keeps the app between the bars itself and reports 0, which the emulator confirmed. Nothing to detect.

## What this batch does

1. The app is the screen's height and never scrolls. The header stays on top and the Footer (Welcome, Settings) at the bottom; only `<main>` between them scrolls, and only when a screen cannot fit (very big text, a phone held sideways, the Privacy Page).
2. The screens and their clocks size from `<main>`, not the screen.
3. The header's tools are round buttons like Home: language shows the current language, theme the current theme; a tap switches it.

Font sizes and units stay as they are (the author, after asking whether rem/em would save room: it would not, `1rem` is 16 px).

## After (the same emulator, `images/01-emulator-after.png`)

Nothing scrolls on any screen, in Ukrainian and English, at 728 px and with a larger Display size (640 px). With font size 130 % the drag Games scroll inside `<main>` only (2 px in Teach, 55 px in Test); the page never moves.

## Left to check on a phone

- The Oppo A itself: no screen scrolls; the header and the Footer stay put.
- The keyboard on Welcome keeps the name field in view.
