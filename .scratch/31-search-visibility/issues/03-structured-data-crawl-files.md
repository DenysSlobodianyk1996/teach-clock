# 03: Structured data, robots.txt, privacy canonical, Search Console tag

**What to build:** The Pages build names the game for search engines: a JSON-LD `WebApplication`, a
`robots.txt` naming the sitemap, the static Privacy Page's canonical address, and the Search Console
verification tag. Decisions 1, 6 and 8 in `request.md`.

**Blocked by:** 01 Description from the Play listing

**Status:** todo

- [ ] JSON-LD `WebApplication`: name, description, url, `applicationCategory` `EducationalApplication`,
      `operatingSystem` `Web`, a free offer, `inLanguage` `en`, `availableLanguage` all six
- [ ] `robots.txt`: allow all, `Sitemap:` with the absolute sitemap URL
- [ ] `privacy/index.html` has `<link rel="canonical">` to `SITE_URL + 'privacy/'`, Pages build only
- [ ] `GOOGLE_SITE_VERIFICATION` in `src/config.ts` with the owner's token; the tag in the Pages build
      only, and left out if the constant is ever emptied
- [ ] Tests for each, and none of them in the Android App or a build for elsewhere
