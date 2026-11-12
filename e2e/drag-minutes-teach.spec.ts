import { t, startingWith } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'
import { dragNumber, slot, tapNumber, tile } from './numbers.ts'

/** Tile N shows N × 5 minutes; the helpers still take slot ids. */
const minutes = (n: number) => String(n * 5)

async function startDragMinutesTeach(page: Page) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragMinutes.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()
}

test('a Drag Minutes Teach Round: Hour Badges, a wrong drop, the Place-It button, the Summary', async ({
  page,
}) => {
  await startDragMinutesTeach(page)

  // The tray holds 5–60, and each slot has its Hour Badge.
  const tray = await page.locator('.tray .tile').allTextContents()
  expect(tray.map(Number).sort((a, b) => a - b)).toEqual([
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
  ])
  await expect(page.locator('.hour-badge')).toHaveCount(12)
  await expect(page.locator('.hour-badge').nth(11)).toHaveText('12')

  // 60 dropped where 20 goes: it goes back with the wrap-around hint.
  await dragNumber(page, 12, 4)
  await expect(page.getByRole('status')).toHaveText(
    t('numbers.between', { number: 60, before: 55, after: 5 }),
  )
  await expect(tile(page, 12)).toBeVisible()

  // The Place-It button puts 60 at the top, and the Hint closes.
  await page.getByRole('button', { name: t('numbers.placeIt', { number: 60 }) }).click()
  await expect(slot(page, 12)).toHaveText('60')
  await expect(tile(page, 12)).toBeHidden()
  await expect(page.getByRole('status')).toHaveText('')
  // The badge stays visible beside the placed minute.
  await expect(page.locator('.hour-badge').nth(11)).toBeVisible()

  // 10 dropped on the 5's slot: "10 goes between 5 and 15".
  await dragNumber(page, 2, 5)
  await expect(page.getByRole('status')).toHaveText(
    t('numbers.between', { number: 10, before: 5, after: 15 }),
  )

  for (const n of [1, 2, 3, 5, 7, 9, 11]) {
    await dragNumber(page, n, n)
    await expect(slot(page, n)).toHaveText(minutes(n))
  }
  for (const n of [4, 6, 8, 10]) {
    await tapNumber(page, n, n)
    await expect(slot(page, n)).toHaveText(minutes(n))
  }

  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.headline', { right: 10, total: 12 }) }),
  ).toBeVisible()
  // Right minutes show as chips with their minute values.
  const right = page.getByRole('region', { name: t('summary.right') })
  await expect(right.getByRole('listitem').filter({ hasText: /^15$/ })).toBeVisible()
  const between = t('numbers.between', { number: 60, before: 55, after: 5 })
  await expect(
    page
      .getByRole('region', { name: t('summary.wrong') })
      .getByRole('listitem')
      .filter({ hasText: between }),
  ).toBeVisible()
  // The small pair faces still show Hour Badges big enough to read.
  const pairBadge = page.locator('.pair-clock .hour-badge text').nth(11)
  expect((await pairBadge.boundingBox())!.height).toBeGreaterThanOrEqual(10)
})

test('Drag Minutes tiles show two-digit minutes inside the tile, the same size as Drag Hours', async ({
  page,
}) => {
  await startDragMinutesTeach(page)
  await tapNumber(page, 11, 11)
  const disc = page.locator('.tray .disc').first()
  const fits = await disc.evaluate((e) => e.scrollWidth <= e.clientWidth)
  expect(fits).toBe(true)
  const placed = slot(page, 11)
  const tileBox = (await placed.locator('.c-tile').boundingBox())!
  const textBox = (await placed.locator('.c-tile-num').boundingBox())!
  expect(textBox.width).toBeLessThan(tileBox.width)
})
