# Request

As given:

> fix seo for site. In slack / telegram, img somehow isn't visible

![Slack preview of the Web App: title and description, an empty image placeholder](images/01-slack-preview-no-image.png)

## Cause

The built `index.html` has a static `<title>` and `<meta name="description">` (English, batch 13
decision 7) but no Open Graph or Twitter tags, so it has no `og:image`. Slack, Telegram and other
link unfurlers don't run JavaScript and need static tags with absolute URLs.

## Decisions (grilling, 2026-11-25)

1. **Image:** reuse `docs/store/en/feature-graphic.png` (1024 × 500) as is, not a new 1200 × 630 card.
2. **Scope:** preview tags plus the basics: canonical link and `sitemap.xml`. `robots.txt` is left
   out because crawlers read it only at the host root, `denysslobodianyk1996.github.io/robots.txt`,
   which this repo does not serve. No JSON-LD, hreflang or Search Console step.
3. **Language:** English, as the static title and description already are. Only one static
   language can live at `/teach-clock/`.
