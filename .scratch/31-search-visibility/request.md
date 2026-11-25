# Request

As given (the owner, 2026-11-25, through the agent session that did the same in dot-line):

> The same search-visibility result as the sibling repo dots-and-boxes (`docs/search-visibility/spec.md`
> and its requirements' "SV" section there). The owner explicitly overrides batch 30's decisions to
> skip `robots.txt`, JSON-LD and Search Console.
>
> Teach Clock already has (keep, extend): the static and runtime meta description, manifest
> descriptions, `seoPlugin()` with canonical, Open Graph, Twitter, `og-image.png` and `sitemap.xml`
> (Pages build only), the privacy page's SSR, a real `<h1>` on Welcome. Build what's missing:
>
> 1. `app.description` in all six languages = each `docs/store/<lang>/listing.md` short description,
>    with a drift test.
> 2. A prerendered English Welcome in `index.html`'s `#app`, Pages build only (not Android, not dev).
>    The app mounts over it without hydration. A pre-paint script hides it where another screen
>    opens. Exactly one `<h1>`. Layout close to the real Welcome. `lang="en"` on its root.
> 3. JSON-LD `WebApplication`, Pages build only.
> 4. `robots.txt` (allow all, names the sitemap; advisory on a project site), Pages only.
> 5. The static Privacy Page's canonical, Pages only.
> 6. A Google Play link behind a live flag (off), "Get it on Google Play" in six languages, hidden in
>    the Android App; the JSON-LD adds a `MobileApplication` when on.
> 7. Search Console: a `google-site-verification` meta tag from one constant, Pages only.

Later the same day: the owner's Search Console token for the teach-clock property is known,
`jFybgwwGyr9yepRC53WaJmZYPZGWPFwLZD000UJpGIg`; the tag ships in this batch.

## Decisions

1. **Overrides batch 30, decision 2.** `robots.txt`, JSON-LD and the Search Console tag are now in
   scope. `robots.txt` still only counts at the host root (`denysslobodianyk1996.github.io/robots.txt`,
   not this repo), so it is advisory; the sitemap goes to Search Console anyway.
2. **One English page**, as batch 30 decision 3: no language URLs, no hreflang. The app keeps picking
   the interface language at runtime (a saved choice, else the device's).
3. **The description is the Play short description**, word for word, in every language, so the search
   result, the manifest and the store say the same thing. A test keeps them equal.
4. **The prerendered Welcome is the real `WelcomeView`** rendered on the server inside the app's frame,
   header and Footer, with its CSS inlined, so the swap to the app barely moves anything and the text
   can never drift. Its header keeps room for the two round buttons (language, theme). It shows the
   empty name field and Start; a saved name fills in when the app mounts.
5. **Where it shows**: Teach Clock restores only the Player's name, and `/` always opens Welcome, so
   the pre-paint script hides it only when the address is not the site root (`/settings`, `/round`,
   `/summary`, `/privacy-policy`, `404.html`). Crawlers, with or without JavaScript, see it at the root.
6. **JSON-LD category: `EducationalApplication`.** Teach Clock exists to teach children to read a
   clock (its Play category is Game › Educational); schema.org's `EducationalApplication` says that,
   where `GameApplication` would put it next to arcade games. The Android App uses the same category.
7. **The Play listing** is `https://play.google.com/store/apps/details?id=app.teachclockforkids`, the
   app id in `capacitor.config.ts`; a test keeps them equal. The flag is turned on with the first
   production release (`docs/android-release.md`, step 14).
8. **Search Console**: the URL-prefix property `https://denysslobodianyk1996.github.io/teach-clock/`,
   verified by the HTML tag; its token is `GOOGLE_SITE_VERIFICATION` in `src/config.ts`. After the
   deploy the owner verifies the property and submits `sitemap.xml`.
