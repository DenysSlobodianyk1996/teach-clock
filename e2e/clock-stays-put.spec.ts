/** The clock never moves during a Round: whatever appears around it has its space kept from the start. */
import { t, startingWith } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { dragNumber, tapNumber } from './numbers.ts'

async function start(
  page: Page,
  game: 'dragHours' | 'dragArrows' | 'setTime',
  mode: 'teach' | 'test',
) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t(`games.${game}.name`)) }).check()
  await page.getByRole('radio', { name: startingWith(t(`modes.${mode}.name`)) }).check()
  // 15 minutes, so the wrong Answers typed below (12:01) can never be a Task.
  if (game !== 'dragHours') {
    await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
  }
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByText(t(`modes.${mode}.name`), { exact: false }).first()).toBeVisible()
  // The Round opens scrolled to the top; measure only once it is there.
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
}

/** Where the clock is on the page. */
async function spot(clock: Locator) {
  const box = (await clock.boundingBox())!
  return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width) }
}

async function closeWrongPopup(page: Page) {
  const popup = page.getByRole('dialog', { name: t('teach.wrongTitle') })
  await popup.getByRole('button', { name: t('teach.gotIt') }).click()
  await expect(popup).toBeHidden()
}

test('Drag Arrows Teach: the clock stays put when the Hint appears and goes', async ({ page }) => {
  await start(page, 'dragArrows', 'teach')
  const clock = page.locator('.clock-side svg.clock')
  const before = await spot(clock)

  // 12:00 is never the target, so submitting the untouched hands is a wrong Answer.
  await page.getByRole('button', { name: t('round.submit') }).click()
  await closeWrongPopup(page)
  await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeVisible()
  expect(await spot(clock)).toEqual(before)

  await page.getByRole('button', { name: t('teach.setCorrect') }).click()
  await page.getByRole('button', { name: t('round.submit') }).click()
  await expect(
    page.getByText(t('round.progress', { n: 2, total: 10 }), { exact: false }),
  ).toBeVisible()
  expect(await spot(clock)).toEqual(before)
})

test('Set Time Teach: the clock stays put for the time-box error and the Hint', async ({
  page,
}) => {
  await start(page, 'setTime', 'teach')
  const clock = page.locator('.clock-side svg.clock')
  const before = await spot(clock)

  // 13:99 is not a time: both boxes get an error line.
  await page.keyboard.type('1399')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('alert')).toContainText(t('round.errors.minute'))
  expect(await spot(clock)).toEqual(before)

  for (let i = 0; i < 2; i++) await page.keyboard.press('Backspace')
  await page.keyboard.press('ArrowLeft')
  for (let i = 0; i < 2; i++) await page.keyboard.press('Backspace')
  await page.keyboard.type('1201')
  await page.keyboard.press('Enter')
  await closeWrongPopup(page)
  await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeVisible()
  expect(await spot(clock)).toEqual(before)
})

test('Drag Hours Teach: the face stays put when a Hint appears and goes', async ({ page }) => {
  await start(page, 'dragHours', 'teach')
  const face = page.locator('svg.number-face')
  const before = await spot(face)

  await dragNumber(page, 7, 1)
  await expect(page.getByRole('status')).toHaveText(
    t('numbers.between', { number: 7, before: 6, after: 8 }),
  )
  expect(await spot(face)).toEqual(before)

  await dragNumber(page, 7, 7)
  await expect(page.getByRole('status')).toHaveText('')
  expect(await spot(face)).toEqual(before)
})

test('Drag Hours Test: the face stays put as the tray empties and Submit appears', async ({
  page,
}) => {
  await start(page, 'dragHours', 'test')
  const face = page.locator('svg.number-face')
  const before = await spot(face)
  for (let n = 1; n <= 12; n++) {
    await tapNumber(page, n, n)
    expect(await spot(face), `after placing ${n}`).toEqual(before)
  }
  await expect(page.getByRole('button', { name: t('numbers.submit') })).toBeVisible()
  expect(await spot(face)).toEqual(before)
})
