import { t, tEn } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

/** A browser whose language list is `locale`, with what it should show and call the tab. */
const browsers = [
  { locale: 'en-US', lang: 'en', lookup: tEn },
  { locale: 'uk-UA', lang: 'uk', lookup: t },
  // Neither Ukrainian nor English: English.
  { locale: 'de-DE', lang: 'en', lookup: tEn },
] as const

/**
 * Holds back the app's script, so only index.html's pre-paint script runs: `/src/main.ts` on the
 * dev server, `/assets/index-….js` in the build (CI). Returns a check that it was really held back.
 */
async function withoutApp(page: Page) {
  let blocked = false
  await page.route(/\/src\/main\.ts$|\/assets\/index-[^/]*\.js$/, (route) => {
    blocked = true
    return route.abort()
  })
  return () => expect(blocked, 'the app script was held back').toBe(true)
}

/** The page's description, as index.html's head has it. */
function description(page: Page) {
  return page.locator('meta[name="description"]')
}

// No service worker, so the app's script always comes from the network, where it can be held back.
test.use({ serviceWorkers: 'block' })

for (const { locale, lang, lookup } of browsers) {
  test.describe(`a new Player in a ${locale} browser`, () => {
    test.use({ locale })

    test('sees Welcome and the tab in that language', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: lookup('welcome.title') })).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page).toHaveTitle(lookup('app.name'))
      await expect(description(page)).toHaveAttribute('content', lookup('app.description'))
    })

    test('gets the Game Name and description before the app loads', async ({ page }) => {
      const appWasHeldBack = await withoutApp(page)
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page).toHaveTitle(lookup('app.name'))
      await expect(description(page)).toHaveAttribute('content', lookup('app.description'))
      appWasHeldBack()
      await expect(page.getByRole('heading')).toHaveCount(0)
    })
  })
}

test.describe('in an English browser', () => {
  test.use({ locale: 'en-US' })

  test('a tap on УК is kept after a reload, before the app loads too', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('button', { name: tEn('header.languageNow', { language: tEn('languages.en') }) })
      .click()
    await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
    await expect(description(page)).toHaveAttribute('content', t('app.description'))

    await page.reload()
    await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
    await expect(page).toHaveTitle(t('app.name'))

    const appWasHeldBack = await withoutApp(page)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
    await expect(page).toHaveTitle(t('app.name'))
    await expect(description(page)).toHaveAttribute('content', t('app.description'))
    appWasHeldBack()
  })
})
