import { expect, test } from '@playwright/test'
import { t, tEn } from './i18n.ts'
import { CONTACT_EMAIL } from '../src/config.ts'

// privacy.html is the static copy of the Privacy Page for Google Play's listing. The build writes it
// from the same i18n text as the app screen (src/privacy.ts), Ukrainian then English.
test('the static Privacy Page has a Ukrainian and an English section and a way back to the game', async ({
  page,
}) => {
  await page.goto('/privacy.html')

  await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
  const uk = page.locator('section[lang="uk"]')
  const en = page.locator('section[lang="en"]')
  await expect(uk.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
  await expect(en.getByRole('heading', { level: 2, name: tEn('privacy.title') })).toBeVisible()
  // Ukrainian comes first.
  expect((await uk.boundingBox())!.y).toBeLessThan((await en.boundingBox())!.y)

  for (const [section, back, createdBy] of [
    [uk, t('privacy.back'), t('privacy.createdBy')],
    [en, tEn('privacy.back'), tEn('privacy.createdBy')],
  ] as const) {
    await expect(section.getByRole('link', { name: CONTACT_EMAIL })).toHaveAttribute(
      'href',
      `mailto:${CONTACT_EMAIL}`,
    )
    await expect(section.getByText(createdBy)).toBeVisible()
    // The contact email and the way back are the only links.
    await expect(section.getByRole('link')).toHaveCount(2)
    await expect(section.locator('time[datetime]')).toHaveCount(1)
    await expect(section.getByRole('link', { name: back })).toHaveAttribute('href', './')
  }

  // Readable on a narrow phone: no sideways scrolling.
  await page.setViewportSize({ width: 360, height: 720 })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('the Privacy Page screen fits a narrow phone and follows the interface language', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 720 })
  await page.goto('/privacy-policy')
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)

  await page
    .getByRole('group', { name: t('header.language') })
    .getByRole('button', { name: t('languages.en') })
    .click()
  await expect(page.getByRole('heading', { level: 1, name: tEn('privacy.title') })).toBeVisible()
})
