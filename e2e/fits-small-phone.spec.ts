/** On a small phone, Settings and the Round fit the screen: no sideways scroll, Submit in view. */
import { t, startingWith } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'

async function toSettings(page: Page) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
}

/** How far down the page an element ends, measured from the very top (not from the scroll). */
async function bottomFromPageTop(locator: Locator) {
  return locator.evaluate((e) => e.getBoundingClientRect().bottom + scrollY)
}

async function sidewaysScroll(page: Page) {
  return page.evaluate(() => document.scrollingElement!.scrollWidth - innerWidth)
}

test('Settings fits: no sideways scroll, Back and Play side by side in full', async ({ page }) => {
  await toSettings(page)
  expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
  const width = page.viewportSize()!.width
  for (const name of [t('settings.back'), t('settings.play')]) {
    const box = (await page
      .getByRole('button', { name })
      .or(page.getByRole('link', { name }))
      .boundingBox())!
    expect(box.x, name).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width, name).toBeLessThanOrEqual(width)
  }
})

for (const game of ['setTime', 'dragArrows'] as const) {
  test(`${game} Teach: Submit stays on screen before and after the Hint`, async ({ page }) => {
    await toSettings(page)
    await page.getByRole('radio', { name: startingWith(t(`games.${game}.name`)) }).check()
    await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
    await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
    await page.getByRole('button', { name: t('settings.play') }).click()
    const submit = page.getByRole('button', { name: t('round.submit') })
    await expect(submit).toBeVisible()
    // The Round opens at the top, whatever was scrolled on Settings.
    expect(await page.evaluate(() => scrollY)).toBe(0)
    expect(await bottomFromPageTop(submit), 'Submit fits without scrolling').toBeLessThanOrEqual(
      page.viewportSize()!.height,
    )
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)

    // A wrong try brings the Hint: 12:01 is off the 15-minute step; untouched hands are never right.
    if (game === 'setTime') {
      await page.keyboard.type('1201')
      await page.keyboard.press('Enter')
    } else {
      await submit.click()
    }
    await page.getByRole('button', { name: t('teach.gotIt') }).click()
    await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeVisible()
    expect(await bottomFromPageTop(submit), 'Submit fits with the Hint shown').toBeLessThanOrEqual(
      page.viewportSize()!.height,
    )
  })
}
