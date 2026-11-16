import { t } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'
import { dragNumber, slot, tapNumber, tile } from './numbers.ts'
import { startRound } from './round.ts'
import { closeWrongPopup, wrongPopup } from './teach.ts'

/** Tile N shows N × 5 minutes; the helpers still take slot ids. */
const minutes = (n: number) => String(n * 5)

async function startDragMinutesTeach(page: Page) {
  await startRound(page, { game: 'dragMinutes', mode: 'teach' })
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()
}

test('a Drag Minutes Teach Round: Hour Badges, a wrong drop, Set correct answer, the Summary', async ({
  page,
}) => {
  await startDragMinutesTeach(page)

  // The tray holds 5–60, and each slot has its Hour Badge.
  const tray = await page.locator('.tray .tile').allTextContents()
  expect(tray.map(Number).sort((a, b) => a - b)).toEqual([
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
  ])
  const badges = page.locator('.board .hour-badge')
  await expect(badges).toHaveCount(12)
  await expect(badges.nth(11)).toHaveText('12')

  // 60 dropped where 20 goes: the popup shows 60 lit at the top, with Hour Badges.
  await dragNumber(page, 12, 4)
  const popup = wrongPopup(page)
  await expect(popup).toContainText(t('numbers.between', { number: 60, before: 55, after: 5 }))
  await expect(popup.locator('[data-slot="12"]')).toHaveText('60')
  await expect(popup.locator('.hour-badge')).toHaveCount(12)
  await expect(tile(page, 12)).toBeVisible()

  // Set correct answer puts 60 at the top, and the popup closes.
  await closeWrongPopup(page, 'setCorrect')
  await expect(slot(page, 12)).toHaveText('60')
  await expect(tile(page, 12)).toBeHidden()
  // The badge stays visible beside the placed minute.
  await expect(badges.nth(11)).toBeVisible()

  // 10 dropped on the 5's slot: "10 goes between 5 and 15"; Got it, and the Player fixes it.
  await dragNumber(page, 2, 5)
  await expect(popup).toContainText(t('numbers.between', { number: 10, before: 5, after: 15 }))
  await closeWrongPopup(page, 'gotIt')

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
  // Right minutes sit green on their own slots of one face; 10 and 60 leave empty rings.
  const right = page.getByRole('region', { name: t('summary.right') })
  const rightFace = right.getByRole('img', {
    name: t('summary.rightFaceLabel', { numbers: '5, 15, 20, 25, 30, 35, 40, 45, 50, 55' }),
  })
  await expect(rightFace).toBeVisible()
  await expect(rightFace.locator('.good[data-slot="3"]')).toHaveText('15')
  await expect(rightFace.locator('.good')).toHaveCount(10)
  await expect(rightFace.locator('.c-slot')).toHaveCount(2)
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

test('the eye shows the Filled Clock, and Got it goes back to the Round unchanged', async ({
  page,
}) => {
  await startDragMinutesTeach(page)
  await dragNumber(page, 3, 3)

  const eye = page.getByRole('button', { name: t('numbers.showFilled') })
  await eye.click()
  const popup = page.getByRole('dialog', { name: t('numbers.filledTitle') })
  await expect(popup).toBeVisible()
  const face = popup.getByRole('img', { name: t('numbers.filledFace') })
  for (let n = 1; n <= 12; n++)
    await expect(face.locator(`[data-slot="${n}"]`)).toHaveText(minutes(n))
  await expect(face.locator('.hour-badge')).toHaveCount(12)

  await popup.getByRole('button', { name: t('teach.gotIt') }).click()
  await expect(popup).toBeHidden()
  await expect(eye).toBeFocused()
  await expect(slot(page, 3)).toHaveText('15')
  await expect(slot(page, 4).locator('.c-slot')).toBeVisible()
  await expect(page.locator('.tray .tile')).toHaveCount(11)
})
