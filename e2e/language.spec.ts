import { t, tEn } from './i18n.ts'
import { expect, test } from '@playwright/test'

/** A browser whose language list is `locale`, with what it should show and call the tab. */
const browsers = [
  { locale: 'en-US', lang: 'en', lookup: tEn },
  { locale: 'uk-UA', lang: 'uk', lookup: t },
  // Neither Ukrainian nor English: English.
  { locale: 'de-DE', lang: 'en', lookup: tEn },
] as const

for (const { locale, lang, lookup } of browsers) {
  test.describe(`a new Player in a ${locale} browser`, () => {
    test.use({ locale })

    test('sees Welcome and the tab in that language', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: lookup('welcome.title') })).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page).toHaveTitle(lookup('app.name'))
    })

    test('gets the Game Name in the tab before the app loads', async ({ page }) => {
      // The pre-paint script in index.html alone.
      await page.route('**/src/main.ts', (route) => route.abort())
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page).toHaveTitle(lookup('app.name'))
    })
  })
}

test.describe('in an English browser', () => {
  test.use({ locale: 'en-US' })

  test('a tap on УК is kept after a reload, before the app loads too', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('group', { name: tEn('header.language') })
      .getByRole('button', { name: tEn('languages.uk') })
      .click()
    await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()

    await page.reload()
    await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
    await expect(page).toHaveTitle(t('app.name'))

    await page.route('**/src/main.ts', (route) => route.abort())
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
    await expect(page).toHaveTitle(t('app.name'))
  })
})
