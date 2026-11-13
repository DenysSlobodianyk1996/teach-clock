# 01: Privacy Page as an app screen

**What to build:** the Privacy Page becomes a Vue screen at `/privacy` in both builds. The Footer's Privacy link opens it in place: no new tab in the Web App, no system browser in the Android App, and it works offline. The static `privacy.html` for Google Play's listing stays, written by the build from the same text.

**Blocked by:** none

**Status:** done

- [x] Text in i18n (`privacy.*`, `uk` and `en`); the screen shows the interface language; the date of the text is `PRIVACY_UPDATED` in `src/config.ts`, written out per language
- [x] `src/views/PrivacyView.vue` at route `privacy`, no Footer; its button goes back to the screen that opened it (Welcome or Settings), or to Welcome when opened straight from its address (`goBack` in `src/router`)
- [x] Lists the web version of the game (`WEB_APP_URL`); in the Android App the link opens the system browser
- [x] Android back button: `privacy` → `goBack`
- [x] `src/privacy.ts` writes the static page (Ukrainian, then English); a Vite plugin emits it as `privacy.html` in the Web App build and serves it in dev; `public/privacy.html` removed; still in the service-worker precache
- [x] Footer: the Privacy link is a router link in both builds; `PRIVACY_URL` removed
- [x] Vitest: static page matches the i18n text in both languages; the screen (language, email, web link, date, back); Footer link; back button table and handler
- [x] Playwright: Footer → Privacy → back (from Welcome and from Settings); static page by text; both open offline; 360 px without sideways scroll
- [x] Emulator: Privacy opens inside the app; the back button returns to Welcome; the web link opens Chrome
