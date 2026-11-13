import { expect, test } from '@playwright/test'

// The Privacy Page is static HTML outside the Vue app, so it has no i18n keys: the checks use
// stable ids and lang attributes instead of text.
test('the Privacy Page has a Ukrainian and an English section and a way back to the game', async ({
  page,
}) => {
  await page.goto('/privacy.html')

  await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
  const uk = page.locator('section#uk')
  const en = page.locator('section#en')
  await expect(uk).toHaveAttribute('lang', 'uk')
  await expect(en).toHaveAttribute('lang', 'en')
  await expect(uk.locator('h1#privacy-uk')).toBeVisible()
  await expect(en.locator('h2#privacy-en')).toBeVisible()
  // Ukrainian comes first.
  const ukTop = (await uk.boundingBox())!.y
  const enTop = (await en.boundingBox())!.y
  expect(ukTop).toBeLessThan(enTop)

  for (const section of [uk, en]) {
    await expect(section.locator('a[href^="mailto:"]')).toHaveCount(1)
    await expect(section.locator('time[datetime]')).toHaveCount(1)
    await expect(section.locator('a.back')).toHaveAttribute('href', './')
  }

  // Readable on a narrow phone: no sideways scrolling.
  await page.setViewportSize({ width: 360, height: 720 })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
