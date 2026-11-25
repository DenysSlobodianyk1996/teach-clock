# 02: Docs sync

**What to build:** The docs say that the English feature graphic is also the link-preview image,
the batch is closed out, and the live preview is checked after deploy.

**Blocked by:** 01 Link preview tags, image and sitemap

**Status:** done, except the after-deploy preview check

- [x] `docs/store/` and `scripts/featureGraphic.ts` note that `docs/store/en/feature-graphic.png`
      is also the Web App's `og-image.png`, so redrawing it changes link previews
- [x] Local boards in `docs/design/` and the online design canvas checked; changed only if they
      show the page head (they likely don't)
      Note: the local boards have only a charset and a `<title>`, no preview tags, so nothing
      changed. The online canvas could not be reached from the agent session; it is a copy of the
      local boards, which did not change, so it needs no publish.
- [x] `.scratch/README.md` row (status and PR) and `CLAUDE.md` status updated
- [ ] After deploy: the URL checked in a preview debugger (opengraph.xyz or Facebook's Sharing
      Debugger); Telegram's cache refreshed through @WebpageBot; Slack checked with a fresh link
      (`?v=2` forces a new unfurl)
      Note: open until #92 is merged and deployed; it cannot be done before then.
