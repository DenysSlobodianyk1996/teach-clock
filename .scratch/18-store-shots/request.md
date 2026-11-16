# Request

> adjust store screnshots en/uk - review current, adjust if smth changed in design
>
> same for other pictures here. feture graphics etc
>
> include docs/store/closed-test.md current changes to your changes
>
> Also maybe theme changed or so, please verify

## What changed

- `npm run store-shots` rerun on the app after batch 16. 12 of 16 images came out byte-identical, so the theme is unchanged; the feature graphics and `icon-512.png` already match (their colours are the theme's tokens).
- 2 Settings: Drag Hours now shows Hours (1–12 / 13–24), which pushed Back and Play off the screen. The shot picks Drag Minutes instead. The Footer was never hidden (`footer[role="contentinfo"]` matched nothing); the selector is now `footer`.
- 7 Drag Minutes Teach: redrawn on the batch 16 layout; the Ukrainian popup stacks its two buttons.
- `docs/store/closed-test.md`: developer account verified on 2026-11-16.

> docs/store — check png images here, main bg still with medium theme which I removed

- The feature graphic was still in the middle theme (bg `#1d4b5c`, circles `#27606f`, face `#fff3dd`, yellow rim). `feature-graphic.svg` now uses the light theme's tokens, as on Welcome: bg `#f5efe3`, circles `--bg-deep`, face `--face`, rim `--rim`, white tiles. The product brief says so.
- `icon-512.png` stays: its background is the dark theme's, as batch 11 chose for the icon and splash.

> Please check if listing en uk contains info about all modes, current last changes and so on

- Both listings already covered the four Games, Teach and Test, the Levels, the Summary, privacy, offline, both languages and both themes.
- Added to both: Drag Hours in 13–24 (batch 14), the eye that shows the filled clock in Drag Hours and Drag Minutes Teach (batch 16), and that a number can be tapped and then placed instead of dragged. Batch 17 (drops never vanish) is a fix, not a listing line.
- Full description counts: en 1873 → 2260, uk 1848 → 2255 (limit 4000).
