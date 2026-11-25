# 05: Docs sync

**What to build:** The docs say what the Pages build gives search engines and how to finish Search
Console; the batch is closed out.

**Blocked by:** 01 Description from the Play listing, 02 Prerendered English Welcome, 03 Structured
data, robots.txt, privacy canonical, Search Console tag, 04 Google Play link behind a flag

**Status:** done, except the after-deploy steps

- [x] Local boards in `docs/design/` and the online canvas checked; changed only if something visible
      changed (the Play link is off, so likely nothing)
      Note: nothing visible changed. The app's Welcome is the same, the Play link is off, and the
      prerendered Welcome looks like the app's (screenshots in ticket 02). No board, so no publish.
- [x] Store images: retaken only if something visible changed
      Note: not retaken, for the same reason. Turning `GOOGLE_PLAY_LIVE` on retakes them
      (`docs/android-release.md`, step 14).
- [x] `docs/product-brief.md` where it covers Welcome or the Web App's page ("Where it runs")
- [x] `.scratch/README.md` row and `CLAUDE.md` Status / "Last done"
- [ ] After deploy, by the owner: the Search Console property verified, `sitemap.xml` submitted, the
      Rich Results Test on the root
      Note: open until the PR is merged and deployed.
