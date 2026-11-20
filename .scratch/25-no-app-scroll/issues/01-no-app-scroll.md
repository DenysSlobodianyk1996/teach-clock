# 01: The app never scrolls; only its main area does

**Blocked by:** none

**Status:** done

**What to build:** the page is exactly the screen's height (`100dvh`, `100vh` on old WebViews). The header sits on top and the Footer, on Welcome and Settings, at the bottom; `<main>` takes the height between them and scrolls on its own when a screen cannot fit. Welcome, Settings and every Round fit `<main>` with nothing scrolled on the phones batch 19 and 21 named, and on a 360 × 728 phone (the Oppo A between its bars).

**Checklist:**

- [x] `AppFrame`: fixed height, `<main>` scrolls, the Footer outside it at the bottom.
- [x] Each screen fills `<main>`; Welcome drops its screen-tall minimum; a block centred in `<main>` stays reachable when it overflows (auto margins, not `justify-content: center`).
- [x] The Rounds' clocks size from `<main>` (container units), the old-WebView fallback kept.
- [x] A new screen opens with `<main>` scrolled to the top.
- [x] `e2e/no-app-scroll.spec.ts`: no screen scrolls the document, at 360 × 640, 360 × 728 and 320 × 640, in both languages; the old checks that scrolled to the Footer are updated.

**Out of scope:** changing what each screen shows.
