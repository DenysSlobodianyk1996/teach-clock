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
