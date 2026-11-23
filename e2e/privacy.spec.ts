import { expect, test, type Page } from '@playwright/test'
import { t, tEn, chooseLanguage, tIn, LOCALES } from './i18n.ts'
import { CONTACT_EMAIL, ISSUES_URL } from '../src/config.ts'
import { THEME_BG } from '../src/themeColors.ts'

/** `#rrggbb` as the browser reports a computed colour. */
const rgb = (hex: string) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`

const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor)

// privacy/index.html is the static copy of the Privacy Page for Google Play's listing
// (…/teach-clock/privacy/). The build renders it from the app's own Privacy Page components
// (src/privacyStatic.ts), English then Ukrainian, one text per language.
test.describe('the static privacy/index.html, with JavaScript off', () => {
  test.use({ javaScriptEnabled: false })

  test('has the app header and an English and a Ukrainian Privacy Page with a way back to the game', async ({
    page,
  }) => {
    const response = await page.goto('/privacy/')
    expect(response!.status()).toBe(200)

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('banner')).toHaveText(tEn('app.name'))
    // No УК/EN or sun/moon: they need JavaScript.
    await expect(page.getByRole('banner').getByRole('button')).toHaveCount(0)

    const uk = page.locator('article[lang="uk"]')
    const en = page.locator('article[lang="en"]')
    await expect(en.getByRole('heading', { level: 1, name: tEn('privacy.title') })).toBeVisible()
    await expect(uk.getByRole('heading', { level: 2, name: t('privacy.title') })).toBeVisible()
    // English comes first.
    expect((await en.boundingBox())!.y).toBeLessThan((await uk.boundingBox())!.y)

    for (const lang of LOCALES) {
      const article = page.locator(`article[lang="${lang}"]`)
      const back = tIn(lang, 'privacy.back')
      const createdBy = tIn(lang, 'privacy.createdBy')
      await expect(article.getByRole('link', { name: CONTACT_EMAIL })).toHaveAttribute(
        'href',
        `mailto:${CONTACT_EMAIL}`,
      )
      await expect(article.getByText(createdBy)).toBeVisible()
      await expect(
        article.getByRole('link', { name: ISSUES_URL.replace('https://', '') }),
      ).toHaveAttribute('href', ISSUES_URL)
      // The contact email, the issues and the way back are the only links.
      await expect(article.getByRole('link')).toHaveCount(3)
      await expect(article.locator('time[datetime]')).toHaveCount(1)
      await expect(article.getByRole('link', { name: back })).toHaveAttribute('href', '../')
    }

    // The app's font, not a fallback.
    const fonts = await page.evaluate(async () =>
      (await document.fonts.load('900 20px Nunito')).map((font) => font.family),
    )
    expect(fonts).toContain('Nunito')

    // Readable on a narrow phone: no sideways scrolling.
    await page.setViewportSize({ width: 360, height: 720 })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

test('the static Privacy Page follows the device: light or dark', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/privacy/')
  expect(await background(page)).toBe(rgb(THEME_BG.light))

  await page.emulateMedia({ colorScheme: 'dark' })
  expect(await background(page)).toBe(rgb(THEME_BG.dark))
})

test('the static Privacy Page links back to the web game, in each language', async ({ page }) => {
  for (const lang of LOCALES) {
    await page.goto('/privacy/index.html')
    await page
      .locator(`article[lang="${lang}"]`)
      .getByRole('link', { name: tIn(lang, 'privacy.back') })
      .click()
    await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  }
})

test('a bare /privacy opens the static Privacy Page, as GitHub Pages does', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page).toHaveURL(/\/privacy\/$/)
  await expect(page.locator('article[lang="en"]')).toBeVisible()
})

test('the Privacy Page screen fits a narrow phone and shows one text, in the interface language', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 720 })
  await page.goto('/privacy-policy')
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
  await expect(page.locator('article')).toHaveCount(1)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)

  await chooseLanguage(page, 'uk', 'en')
  await expect(page.getByRole('heading', { level: 1, name: tEn('privacy.title') })).toBeVisible()
})
