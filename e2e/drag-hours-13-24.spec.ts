import { startingWith, t } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { dragNumber, slot, tapNumber, tile } from './numbers.ts'
import { startRound } from './round.ts'
import { closeWrongPopup, wrongPopup } from './teach.ts'

/** Tile N shows N + 12; the helpers still take slot ids. */
const late = (n: number) => String(n + 12)

test('a Drag Hours 13–24 Teach Round: 13–24 tiles, Hour Badges, a wrong drop, the Summary', async ({
  page,
}) => {
  await startRound(page, { game: 'dragHours', mode: 'teach', hours: 24 })
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  // The tray holds 13–24, and each slot has its Hour Badge.
  const tray = await page.locator('.tray .tile').allTextContents()
  expect(tray.map(Number).sort((a, b) => a - b)).toEqual([
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  ])
  const badges = page.locator('.board .hour-badge')
  await expect(badges).toHaveCount(12)
  await expect(badges.nth(11)).toHaveText('12')

  // 24 dropped where 16 goes: "24 goes between 23 and 13", with the badges on the Hint face.
  await dragNumber(page, 12, 4)
  const popup = wrongPopup(page)
  await expect(popup).toContainText(t('numbers.between', { number: 24, before: 23, after: 13 }))
  await expect(popup.locator('[data-slot="12"]')).toHaveText('24')
  await expect(popup.locator('.hour-badge')).toHaveCount(12)
  await closeWrongPopup(page, 'setCorrect')
  await expect(slot(page, 12)).toHaveText('24')
  await expect(tile(page, 12)).toBeHidden()

  for (const n of [1, 2, 3, 5, 7, 9, 11]) {
    await dragNumber(page, n, n)
    await expect(slot(page, n)).toHaveText(late(n))
  }
  for (const n of [4, 6, 8, 10]) {
    await tapNumber(page, n, n)
    await expect(slot(page, n)).toHaveText(late(n))
  }

  await expect(page).toHaveURL(/\/summary$/)
  await expect(page.locator('.details')).toContainText(t('hours.24.name'))

  // Choose game keeps 13–24 picked.
  await page.getByRole('button', { name: t('summary.toSettings') }).click()
  await expect(page.getByRole('radio', { name: startingWith(t('hours.24.name')) })).toBeChecked()
})
