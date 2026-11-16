/**
 * On the built app: a reload on the Privacy Page opens the app again, never the static
 * privacy.html made for Google Play, and Back still works after it.
 */
import { expect, test } from '@playwright/test'
import { t } from './i18n.ts'

test('a reload on the Privacy Page stays in the app, and Back returns to Welcome', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('contentinfo')
    .getByRole('link', { name: t('footer.privacy') })
    .click()
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
  // The app screen, not the static page: the УК/EN switch is only in the app.
  await expect(page.getByRole('group', { name: t('header.language') })).toBeVisible()

  await page.goBack()
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
})
