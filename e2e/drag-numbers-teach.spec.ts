import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { dragNumber, slot, tapNumber, tile } from './numbers.ts'

test('a Drag Numbers Teach Round rejects a wrong drop with a hint and ends on the Summary', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragNumbers.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  // 12 dropped where 4 goes: it goes back with the wrap-around hint.
  await dragNumber(page, 12, 4)
  await expect(page.getByRole('status')).toHaveText(
    t('numbers.between', { number: 12, before: 11, after: 1 }),
  )
  await expect(tile(page, 12)).toBeVisible()

  // Dragged to its own slot, it locks in place.
  await dragNumber(page, 12, 12)
  await expect(slot(page, 12)).toHaveText('12')
  await expect(tile(page, 12)).toBeHidden()
  await expect(
    page.getByText(t('numbers.progress', { n: 1, total: 12 }), { exact: false }),
  ).toBeVisible()

  // Half by dragging, half by tapping the tile and then the slot.
  for (const n of [1, 3, 5, 7, 9, 11]) {
    await dragNumber(page, n, n)
    await expect(slot(page, n)).toHaveText(String(n))
  }
  for (const n of [2, 4, 6, 8, 10]) {
    await tapNumber(page, n, n)
    await expect(slot(page, n)).toHaveText(String(n))
  }

  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.headline', { right: 11, total: 12 }) }),
  ).toBeVisible()
  const first = t('summary.numberFirst', { caption: t('summary.firstTry'), number: 12, slot: 4 })
  const between = t('numbers.between', { number: 12, before: 11, after: 1 })
  await expect(
    page
      .getByRole('region', { name: t('summary.wrong') })
      .getByRole('listitem')
      .filter({
        hasText: `${first}. ${between}`,
      }),
  ).toBeVisible()
})

test('in Teach, the Place-It button beside a Hint puts the number in its place', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragNumbers.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  const placeIt = (number: number) =>
    page.getByRole('button', { name: t('numbers.placeIt', { number }) })
  await expect(page.locator('.place-it')).toHaveCount(0)

  // A wrong drop: the toast and, to its right, the 48 px round button.
  await dragNumber(page, 2, 7)
  await expect(page.getByRole('status')).toHaveText(
    t('numbers.between', { number: 2, before: 1, after: 3 }),
  )
  const button = placeIt(2)
  await expect(button).toBeVisible()
  const box = (await button.boundingBox())!
  expect(Math.round(box.width)).toBe(48)
  expect(Math.round(box.height)).toBe(48)
  const toast = (await page.locator('.toast').boundingBox())!
  expect(box.x).toBeGreaterThan(toast.x + toast.width)

  // Pressed with Enter: 2 lands on its slot and the Hint closes.
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(slot(page, 2)).toHaveText('2')
  await expect(tile(page, 2)).toBeHidden()
  await expect(page.getByRole('status')).toHaveText('')
  await expect(page.locator('.place-it')).toHaveCount(0)

  // Space works too.
  await dragNumber(page, 5, 9)
  await placeIt(5).focus()
  await page.keyboard.press('Space')
  await expect(slot(page, 5)).toHaveText('5')

  for (const n of [1, 3, 4, 6, 7, 8, 9, 10, 11, 12]) await tapNumber(page, n, n)
  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.headline', { right: 10, total: 12 }) }),
  ).toBeVisible()
})
