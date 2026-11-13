/**
 * On a small phone, Settings and the Round fit the screen: no sideways scroll, Submit in view, and the
 * clock as big as the room left allows.
 */
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
  test(`${game} Teach: Submit stays on screen through the wrong-Answer popup`, async ({ page }) => {
    await toSettings(page)
    await page.getByRole('radio', { name: startingWith(t(`games.${game}.name`)) }).check()
    await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
    await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
    await page.getByRole('button', { name: t('settings.play') }).click()
    const submit = page.getByRole('button', { name: t('round.submit') })
    await expect(submit).toBeVisible()
    if (game === 'dragArrows') {
      // The hands need room to be dragged: the clock takes nearly the full width.
      expect(
        await page
          .locator('.clock-side svg.clock')
          .evaluate((e) => e.getBoundingClientRect().width),
      ).toBeGreaterThanOrEqual(300)
    }
    // The Round opens at the top, whatever was scrolled on Settings.
    expect(await page.evaluate(() => scrollY)).toBe(0)
    expect(await bottomFromPageTop(submit), 'Submit fits without scrolling').toBeLessThanOrEqual(
      page.viewportSize()!.height,
    )
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)

    // A wrong try opens the popup: 12:01 is off the 15-minute step; untouched hands are never right.
    if (game === 'setTime') {
      await page.keyboard.type('1201')
      await page.keyboard.press('Enter')
    } else {
      await submit.click()
    }
    // Its two buttons fit the narrow screen, stacked, Got it on top.
    const popup = page.getByRole('dialog', { name: t('teach.wrongTitle') })
    const gotIt = (await popup.getByRole('button', { name: t('teach.gotIt') }).boundingBox())!
    const setCorrect = (await popup
      .getByRole('button', { name: t('teach.setCorrect') })
      .boundingBox())!
    expect(setCorrect.y, 'stacked').toBeGreaterThanOrEqual(gotIt.y + gotIt.height)
    expect(setCorrect.x + setCorrect.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    await popup.getByRole('button', { name: t('teach.setCorrect') }).click()
    await expect(popup).toBeHidden()
    expect(await bottomFromPageTop(submit), 'Submit fits after the popup').toBeLessThanOrEqual(
      page.viewportSize()!.height,
    )
  })
}

test('Drag Hours Teach: a big face, the popup fits, and the tray stays on screen', async ({
  page,
}) => {
  await toSettings(page)
  await page.getByRole('radio', { name: startingWith(t('games.dragHours.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  const face = page.locator('.board svg.number-face')
  await expect(face).toBeVisible()
  expect(await face.evaluate((e) => e.getBoundingClientRect().width)).toBeGreaterThanOrEqual(300)
  const height = page.viewportSize()!.height
  expect(await bottomFromPageTop(page.locator('.tray')), 'tray fits').toBeLessThanOrEqual(height)

  // Tap a number, then the slot after its own: a wrong drop opens the popup.
  const n = Number(await page.locator('.tray [data-number]').first().getAttribute('data-number'))
  await page.locator(`.tray [data-number="${n}"]`).click()
  await page.locator(`.board [data-slot="${(n % 12) + 1}"]`).click()
  const popup = page.getByRole('dialog', { name: t('teach.wrongTitle') })
  await expect(popup).toBeVisible()
  const setCorrect = (await popup
    .getByRole('button', { name: t('teach.setCorrect') })
    .boundingBox())!
  expect(setCorrect.y + setCorrect.height).toBeLessThanOrEqual(height)
  expect(setCorrect.x + setCorrect.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  await popup.getByRole('button', { name: t('teach.gotIt') }).click()
  await expect(popup).toBeHidden()
  expect(
    await bottomFromPageTop(page.locator('.tray')),
    'tray fits after the popup',
  ).toBeLessThanOrEqual(height)
})

test('Drag Hours Test: Готово fits once all 12 numbers are placed', async ({ page }) => {
  await toSettings(page)
  await page.getByRole('radio', { name: startingWith(t('games.dragHours.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  for (let n = 1; n <= 12; n++) {
    await page.locator(`.tray [data-number="${n}"]`).click()
    await page.locator(`.board [data-slot="${n}"]`).click()
  }
  const submit = page.getByRole('button', { name: t('numbers.submit') })
  await expect(submit).toBeVisible()
  expect(await bottomFromPageTop(submit), 'Submit fits').toBeLessThanOrEqual(
    page.viewportSize()!.height,
  )
})
