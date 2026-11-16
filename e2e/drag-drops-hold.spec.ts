import { t } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { dragNumber, slot, tile, touchDragNumber } from './numbers.ts'
import { startRound } from './round.ts'
import { closeWrongPopup, wrongPopup } from './teach.ts'

test.beforeEach(async ({ page }) => {
  await startRound(page, { game: 'dragHours', mode: 'teach' })
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()
})

test('a drop on a filled slot in Teach is a wrong drop: the popup, then the right slot takes it', async ({
  page,
}) => {
  await dragNumber(page, 4, 4)
  await expect(slot(page, 4)).toHaveText('4')

  // 3 dropped on the 4: back to the tray with the popup, not silently.
  await dragNumber(page, 3, 4)
  await expect(wrongPopup(page)).toContainText(
    t('numbers.between', { number: 3, before: 2, after: 4 }),
  )
  await closeWrongPopup(page, 'gotIt')
  await expect(slot(page, 4)).toHaveText('4')
  await expect(tile(page, 3)).toBeVisible()

  await dragNumber(page, 3, 3)
  await expect(slot(page, 3)).toHaveText('3')
})

test('a second finger on another tile does not drop the dragged one', async ({ page }) => {
  await touchDragNumber(page, 1, 1, { secondFingerOn: 2 })
  await expect(slot(page, 1)).toHaveText('1')
  await expect(tile(page, 1)).toBeHidden()
  await expect(tile(page, 2)).toBeVisible()
})
