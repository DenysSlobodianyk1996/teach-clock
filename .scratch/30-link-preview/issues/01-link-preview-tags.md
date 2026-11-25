# 01: Link preview tags, image and sitemap

**What to build:** A link to the Web App shared in Slack or Telegram shows the Game Name, the
description and the English feature graphic. The built `index.html` carries static Open Graph and
Twitter tags and a canonical link with absolute URLs, and the build emits `og-image.png` and
`sitemap.xml`. Only the Web App (GitHub Pages) build gets them; the Android App and the dev server
get none. Decisions in `request.md`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `SITE_URL = 'https://denysslobodianyk1996.github.io/teach-clock/'` in `src/config.ts`, the
      one place; `scripts/release-wizard.sh`'s `WEBSITE_URL` notes it must match
- [x] A `seoPlugin()` in `vite.config.ts`, next to `appTextPlugin()`, active only when
      `GITHUB_PAGES && !isAndroidApp`, injects: `og:type` (website), `og:site_name`, `og:title`,
      `og:description`, `og:url`, `og:locale` (en_US), `og:image`, `og:image:width` (1024),
      `og:image:height` (500), `og:image:alt`, `twitter:card` (summary_large_image),
      `twitter:title`, `twitter:description`, `twitter:image`, `<link rel="canonical">`
- [x] Title and description from `MESSAGES.en.app.*`, escaped as `appTextPlugin` does; the image
      alt text is a new i18n key in all six languages
- [x] The build emits `og-image.png` from `docs/store/en/feature-graphic.png` and `sitemap.xml`
      listing `SITE_URL` and `SITE_URL + 'privacy/'`
- [x] `og-image.png` is kept out of the service worker's precache (workbox `globIgnores`)
- [x] Vitest `src/__tests__/seo.spec.ts`: with Pages on, every tag is there with an absolute
      `https://` URL and the English text looked up with `t`; with the Android build, none
- [x] One targeted Playwright check on a fresh build (extend `e2e/offline.spec.ts`'s build or add
      `e2e/link-preview.spec.ts`): the `index.html` fetched without JS has `og:image`;
      `og-image.png` returns 200 `image/png`; `sitemap.xml` is served
- [x] `GITHUB_PAGES=1 npm run build` shows the tags in `dist/index.html`; after
      `npm run android:sync` `dist/index.html` has none
