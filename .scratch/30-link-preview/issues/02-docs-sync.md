# 02: Docs sync

**What to build:** The docs say that the English feature graphic is also the link-preview image,
the batch is closed out, and the live preview is checked after deploy.

**Blocked by:** 01 Link preview tags, image and sitemap

**Status:** todo

- [ ] `docs/store/` and `scripts/featureGraphic.ts` note that `docs/store/en/feature-graphic.png`
      is also the Web App's `og-image.png`, so redrawing it changes link previews
- [ ] Local boards in `docs/design/` and the online design canvas checked; changed only if they
      show the page head (they likely don't)
- [ ] `.scratch/README.md` row (status and PR) and `CLAUDE.md` status updated
- [ ] After deploy: the URL checked in a preview debugger (opengraph.xyz or Facebook's Sharing
      Debugger); Telegram's cache refreshed through @WebpageBot; Slack checked with a fresh link
      (`?v=2` forces a new unfurl)
