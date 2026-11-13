/**
 * The clock never moves during a Round, on any screen: a wrong Answer opens a popup over it, and
 * whatever else appears around it has its space kept from the start.
 */
import { t, startingWith } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { dragNumber, tapNumber } from './numbers.ts'

async function start(
  page: Page,
  game: 'dragHours' | 'dragMinutes' | 'dragArrows' | 'setTime',
  mode: 'teach' | 'test',
) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t(`games.${game}.name`)) }).check()
  await page.getByRole('radio', { name: startingWith(t(`modes.${mode}.name`)) }).check()
  // 15 minutes, so the wrong Answers typed below (12:01) can never be a Task.
  if (game === 'dragArrows' || game === 'setTime') {
    await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
  }
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByText(t(`modes.${mode}.name`), { exact: false }).first()).toBeVisible()
  // The Round opens scrolled to the top; measure only once it is there.
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
}

/** Where the clock is on the page. */
async function spot(clock: Locator) {
  // From the top of the page, not of the window: on a phone, tapping Submit may scroll it into view.
  const box = await clock.evaluate((e) => {
    const { x, y, width } = e.getBoundingClientRect()
    return { x, y: y + scrollY, width }
  })
  return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width) }
}

const wrongPopup = (page: Page) => page.getByRole('dialog', { name: t('teach.wrongTitle') })

/** Presses one of the wrong-Answer popup's buttons and waits for it to close. */
async function closeWrongPopup(page: Page, button: 'gotIt' | 'setCorrect') {
  await wrongPopup(page)
    .getByRole('button', { name: t(`teach.${button}`) })
    .click()
  await expect(wrongPopup(page)).toBeHidden()
}

test('Drag Arrows Teach: the clock stays put through the wrong-Answer popup', async ({ page }) => {
  await start(page, 'dragArrows', 'teach')
  const clock = page.locator('.clock-side svg.clock')
  const before = await spot(clock)
  const submit = page.getByRole('button', { name: t('round.submit') })

  // 12:00 is never the target, so submitting the untouched hands is a wrong Answer.
  await submit.click()
  await expect(wrongPopup(page)).toBeVisible()
  expect(await spot(clock), 'popup open').toEqual(before)
  await closeWrongPopup(page, 'gotIt')
  expect(await spot(clock), 'after Got it').toEqual(before)

  await submit.click()
  await closeWrongPopup(page, 'setCorrect')
  expect(await spot(clock), 'after Set correct answer').toEqual(before)
  await submit.click()
  await expect(
    page.getByText(t('round.progress', { n: 2, total: 10 }), { exact: false }),
  ).toBeVisible()
  expect(await spot(clock), 'next Task').toEqual(before)
})

test('Set Time Teach: the clock stays put for the time-box error and the wrong-Answer popup', async ({
  page,
}) => {
  await start(page, 'setTime', 'teach')
  const clock = page.locator('.clock-side svg.clock')
  const before = await spot(clock)

  // 13:99 is not a time: both boxes get an error line.
  await page.keyboard.type('1399')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('alert')).toContainText(t('round.errors.minute'))
  expect(await spot(clock), 'time-box error').toEqual(before)

  for (let i = 0; i < 2; i++) await page.keyboard.press('Backspace')
  await page.keyboard.press('ArrowLeft')
  for (let i = 0; i < 2; i++) await page.keyboard.press('Backspace')
  await page.keyboard.type('1201')
  await page.keyboard.press('Enter')
  await expect(wrongPopup(page)).toBeVisible()
  expect(await spot(clock), 'popup open').toEqual(before)
  await closeWrongPopup(page, 'gotIt')
  expect(await spot(clock), 'after Got it').toEqual(before)

  await page.keyboard.press('Enter')
  await closeWrongPopup(page, 'setCorrect')
  expect(await spot(clock), 'after Set correct answer').toEqual(before)
  await page.getByRole('button', { name: t('round.submit') }).click()
  await expect(
    page.getByText(t('round.progress', { n: 2, total: 10 }), { exact: false }),
  ).toBeVisible()
  expect(await spot(clock), 'next Task').toEqual(before)
})

for (const game of ['dragHours', 'dragMinutes'] as const) {
  test(`${game} Teach: the face stays put through the wrong-drop popup`, async ({ page }) => {
    await start(page, game, 'teach')
    const face = page.locator('.board svg.number-face')
    const before = await spot(face)

    // 7 (35 in Drag Minutes) dropped where 1 goes.
    await dragNumber(page, 7, 1)
    await expect(wrongPopup(page)).toBeVisible()
    expect(await spot(face), 'popup open').toEqual(before)
    await closeWrongPopup(page, 'gotIt')
    expect(await spot(face), 'after Got it').toEqual(before)

    await dragNumber(page, 7, 2)
    await closeWrongPopup(page, 'setCorrect')
    expect(await spot(face), 'after Set correct answer').toEqual(before)

    await dragNumber(page, 1, 1)
    expect(await spot(face), 'after a right drop').toEqual(before)
  })
}

test('Drag Hours Test: the face stays put as the tray empties and Submit appears', async ({
  page,
}) => {
  await start(page, 'dragHours', 'test')
  const face = page.locator('.board svg.number-face')
  const before = await spot(face)
  for (let n = 1; n <= 12; n++) {
    await tapNumber(page, n, n)
    expect(await spot(face), `after placing ${n}`).toEqual(before)
  }
  await expect(page.getByRole('button', { name: t('numbers.submit') })).toBeVisible()
  expect(await spot(face)).toEqual(before)
})
