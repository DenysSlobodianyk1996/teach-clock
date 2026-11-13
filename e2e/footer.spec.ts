/** The Footer: on Welcome and Settings only, with Privacy and Contact. */
import { t } from './i18n.ts'
import { CONTACT_EMAIL, CONTACT_SUBJECT } from '../src/config.ts'
import { expect, test, type Page } from '@playwright/test'
import { startRound } from './round.ts'
import { tapNumber } from './numbers.ts'

const footer = (page: Page) => page.getByRole('contentinfo')

test('Welcome and Settings have the Footer with Privacy and Contact', async ({ page }) => {
  await page.goto('/')
  const privacy = footer(page).getByRole('link', { name: t('footer.privacy') })
  await expect(privacy).toHaveAttribute('target', '_blank')
  await expect(footer(page).getByRole('link', { name: t('footer.contact') })).toHaveAttribute(
    'href',
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`,
  )

  // Privacy opens the Privacy Page in a new tab.
  const [privacyPage] = await Promise.all([page.context().waitForEvent('page'), privacy.click()])
  await expect(privacyPage).toHaveURL(/\/privacy\.html$/)
  await expect(privacyPage.locator('h1#privacy-uk')).toBeVisible()
  await privacyPage.close()

  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(footer(page).getByRole('link', { name: t('footer.privacy') })).toBeVisible()
  await expect(footer(page).getByRole('link', { name: t('footer.contact') })).toBeVisible()
})

test('a Round and the Summary have no Footer', async ({ page }) => {
  await startRound(page, { game: 'dragHours', mode: 'test' })
  await expect(page).toHaveURL(/\/round$/)
  await expect(page.locator('.tray')).toBeVisible()
  await expect(footer(page)).toHaveCount(0)

  for (let n = 1; n <= 12; n++) await tapNumber(page, n, n)
  await page.getByRole('button', { name: t('numbers.submit') }).click()
  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.numbersHeadline', { right: 12, total: 12 }) }),
  ).toBeVisible()
  await expect(footer(page)).toHaveCount(0)
})
