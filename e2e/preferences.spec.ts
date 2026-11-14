import { t, tEn } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

const LIGHT_BG = 'rgb(245, 239, 227)'
const DARK_BG = 'rgb(18, 26, 36)'

/** The header's sun/moon toggle, in the interface language `lookup` reads. */
function themeToggle(page: Page, lookup = t) {
  return page.getByRole('switch', { name: lookup('header.darkTheme') })
}

/** Checks `<html>`, the page and the browser bar are all in `theme`. */
async function expectTheme(page: Page, theme: 'light' | 'dark') {
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    theme === 'dark' ? DARK_BG : LIGHT_BG,
  )
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    theme === 'dark' ? '#121a24' : '#f5efe3',
  )
}

/** Saves `theme` on the device before the page loads, as an earlier visit would have. */
async function saveTheme(page: Page, theme: string) {
  await page.addInitScript((value) => localStorage.setItem('teach-clock.theme', value), theme)
}

test('the language and theme survive a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page
    .getByRole('group', { name: t('header.language') })
    .getByRole('button', { name: t('languages.en') })
    .click()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(themeToggle(page, tEn)).toHaveAttribute('aria-checked', 'false')

  await themeToggle(page, tEn).click()
  await expect(themeToggle(page, tEn)).toHaveAttribute('aria-checked', 'true')
  await expectTheme(page, 'dark')

  await page.reload()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle(tEn('app.name'))
  await expectTheme(page, 'dark')
})

test('the toggle is one switch, at least 44 px to tap', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('switch')).toHaveCount(1)
  const box = await themeToggle(page).boundingBox()
  expect(box!.width).toBeGreaterThanOrEqual(44)
  expect(box!.height).toBeGreaterThanOrEqual(44)
})

for (const scheme of ['light', 'dark'] as const) {
  test(`with nothing saved the game follows a device in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    await expectTheme(page, scheme)
    await expect(themeToggle(page)).toHaveAttribute('aria-checked', String(scheme === 'dark'))
  })

  test(`the old middle theme gives way to a device in ${scheme} mode`, async ({ page }) => {
    await saveTheme(page, 'middle')
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    await expectTheme(page, scheme)
    await expect(themeToggle(page)).toHaveAttribute('aria-checked', String(scheme === 'dark'))
  })
}

test('with nothing saved the game follows the device live', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expectTheme(page, 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expectTheme(page, 'dark')
  await expect(themeToggle(page)).toHaveAttribute('aria-checked', 'true')
})

test('a saved theme is kept whatever the device says', async ({ page }) => {
  await saveTheme(page, 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expectTheme(page, 'light')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expectTheme(page, 'light')
  await expect(themeToggle(page)).toHaveAttribute('aria-checked', 'false')
})

test('the first frame is already in the device theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  // Before the app script runs: the pre-paint script in index.html alone.
  await page.route('**/src/main.ts', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#121a24')
})
