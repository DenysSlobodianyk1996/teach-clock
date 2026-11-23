import { t, tEn, chooseLanguage, languageNow, languageKey } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'
import { THEME_BG } from '../src/themeColors.ts'

/** A `#rrggbb` colour as the browser reports it in computed styles. */
function rgb(hex: string) {
  return `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`
}

/** The header's round theme button while `theme` is in use, in the language `lookup` reads. */
function themeButton(page: Page, theme: 'light' | 'dark', lookup = t) {
  return page.getByRole('button', {
    name: lookup('header.themeNow', { theme: lookup(`themes.${theme}`) }),
  })
}

/** Checks `<html>`, the page and the browser bar are all in `theme`. */
async function expectTheme(page: Page, theme: 'light' | 'dark') {
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
  await expect(page.locator('body')).toHaveCSS('background-color', rgb(THEME_BG[theme]))
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', THEME_BG[theme])
}

/** Saves `theme` on the device before the page loads, as an earlier visit would have. */
async function saveTheme(page: Page, theme: string) {
  await page.addInitScript((value) => localStorage.setItem('teach-clock.theme', value), theme)
}

test('the language and theme survive a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await chooseLanguage(page, 'uk', 'en')
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(themeButton(page, 'light', tEn)).toBeVisible()

  await themeButton(page, 'light', tEn).click()
  await expect(themeButton(page, 'dark', tEn)).toBeVisible()
  await expectTheme(page, 'dark')

  await page.reload()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle(tEn('app.name'))
  await expectTheme(page, 'dark')
})

test('language and theme are round buttons, at least 44 px to tap, showing what is in use', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  const language = page.getByRole('button', {
    name: languageNow('uk'),
  })
  await expect(language).toHaveText(languageKey('uk'))
  const theme = themeButton(page, 'light')
  await expect(theme.locator('.sun')).toBeVisible()
  for (const button of [language, theme]) {
    const box = (await button.boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(Math.abs(box.width - box.height), 'a circle').toBeLessThanOrEqual(1)
  }
  await theme.click()
  await expect(themeButton(page, 'dark').locator('.moon')).toBeVisible()
  await chooseLanguage(page, 'uk', 'en')
  await expect(
    page.getByRole('button', {
      name: languageNow('en'),
    }),
  ).toHaveText(languageKey('en'))
})

for (const scheme of ['light', 'dark'] as const) {
  test(`with nothing saved the game follows a device in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    await expectTheme(page, scheme)
    await expect(themeButton(page, scheme)).toBeVisible()
  })

  test(`the old middle theme gives way to a device in ${scheme} mode`, async ({ page }) => {
    await saveTheme(page, 'middle')
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    await expectTheme(page, scheme)
    await expect(themeButton(page, scheme)).toBeVisible()
  })
}

test('with nothing saved the game follows the device live', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expectTheme(page, 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expectTheme(page, 'dark')
  await expect(themeButton(page, 'dark')).toBeVisible()
})

test('a saved theme is kept whatever the device says', async ({ page }) => {
  await saveTheme(page, 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expectTheme(page, 'light')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expectTheme(page, 'light')
  await expect(themeButton(page, 'light')).toBeVisible()
})

test('the first frame is already in the device theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  // Before the app script runs: the pre-paint script in index.html alone.
  await page.route('**/src/main.ts', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', THEME_BG.dark)
})
