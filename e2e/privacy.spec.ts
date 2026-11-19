/**
 * The Privacy Page (batch 23): one static page, src/static/privacy.html, English then Ukrainian,
 * written to privacy/index.html by every build. It is Google Play's Privacy policy URL and what the
 * Footer opens, in the Web App and the Android App alike. Its text is not interface text (no i18n):
 * the tests find it by structure.
 */
import { expect, test, type Page } from '@playwright/test'
import { CONTACT_EMAIL } from '../src/config.ts'
import { THEME_BG } from '../src/themeColors.ts'

/** `#rrggbb` as the browser reports a computed colour. */
const rgb = (hex: string) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`

const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test.describe('the Privacy Page, with JavaScript off', () => {
  test.use({ javaScriptEnabled: false })

  for (const address of ['/privacy/', '/privacy/index.html']) {
    test(`${address}: English, then Ukrainian, each with the contact email and a date`, async ({
      page,
    }) => {
      const response = await page.goto(address)
      expect(response!.status()).toBe(200)

      const en = page.locator('section[lang="en"]')
      const uk = page.locator('section[lang="uk"]')
      await expect(en.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(uk.getByRole('heading', { level: 1 })).toBeVisible()
      expect((await en.boundingBox())!.y).toBeLessThan((await uk.boundingBox())!.y)

      for (const section of [en, uk]) {
        await expect(section.getByRole('link', { name: CONTACT_EMAIL })).toHaveAttribute(
          'href',
          `mailto:${CONTACT_EMAIL}`,
        )
        await expect(section.locator('time[datetime]')).toHaveCount(1)
        await expect(section.locator('time')).not.toContainText('%')
      }

      // Readable on a narrow phone: no sideways scrolling.
      await page.setViewportSize({ width: 360, height: 640 })
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})

test('the Privacy Page follows the device: light or dark', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/privacy/')
  expect(await background(page)).toBe(rgb(THEME_BG.light))

  await page.emulateMedia({ colorScheme: 'dark' })
  expect(await background(page)).toBe(rgb(THEME_BG.dark))
})

test('its language links jump to each language', async ({ page }) => {
  await page.goto('/privacy/')
  await page.locator('nav a[href="#uk"]').click()
  await expect(page).toHaveURL(/#uk$/)
  await expect(page.locator('section[lang="uk"] h1')).toBeInViewport()
})
