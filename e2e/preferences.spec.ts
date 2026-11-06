import { t, tEn } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

async function switchToEnglish(page: Page) {
  await page.goto('/')
  await page
    .getByRole('group', { name: t('header.language') })
    .getByRole('button', { name: t('languages.en') })
    .click()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
}

/** After a reload the page is still English and light. */
async function expectEnglishAndLightAfterReload(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page).toHaveTitle(tEn('app.name'))
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 239, 227)')
}

test('Preferences survive a reload', async ({ page, isMobile }) => {
  // eslint-disable-next-line playwright/no-skipped-test -- each project checks its own header layout
  test.skip(isMobile, 'Phones cycle the theme; see the next test')
  await switchToEnglish(page)
  await expect(page.getByRole('button', { name: tEn('header.nextTheme.middle') })).toBeHidden()
  await page
    .getByRole('group', { name: tEn('header.theme') })
    .getByRole('button', { name: tEn('themes.light') })
    .click()
  await expectEnglishAndLightAfterReload(page)
})

test('on a phone one button cycles the theme, and it survives a reload', async ({
  page,
  isMobile,
}) => {
  // eslint-disable-next-line playwright/no-skipped-test -- each project checks its own header layout
  test.skip(!isMobile, 'Tablets and desktops show all three themes')
  await switchToEnglish(page)
  await expect(page.getByRole('group', { name: tEn('header.theme') })).toBeHidden()
  await page.getByRole('button', { name: tEn('header.nextTheme.middle') }).click()
  await page.getByRole('button', { name: tEn('header.nextTheme.dark') }).click()
  await expect(page.getByRole('button', { name: tEn('header.nextTheme.light') })).toBeVisible()
  await expectEnglishAndLightAfterReload(page)
})
