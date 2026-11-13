import { t } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { dragNumber, slot, tapNumber, tile } from './numbers.ts'
import { startRound } from './round.ts'
import { gotIt, setCorrect as setCorrectButton, wrongPopup } from './teach.ts'

test('a Drag Hours Teach Round rejects a wrong drop with the popup and ends on the Summary', async ({
  page,
}) => {
  await startRound(page, { game: 'dragHours', mode: 'teach' })
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  // 12 dropped where 4 goes: it goes back, and the popup lights 12 between 11 and 1.
  await dragNumber(page, 12, 4)
  const popup = wrongPopup(page)
  await expect(popup).toContainText(t('numbers.between', { number: 12, before: 11, after: 1 }))
  await expect(popup.locator('[data-slot]')).toHaveText(['1', '11', '12'])
  await expect(gotIt(page)).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(popup).toBeHidden()
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

test('in Teach, Set correct answer in the popup puts the number in its place', async ({ page }) => {
  await startRound(page, { game: 'dragHours', mode: 'teach' })
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  const popup = wrongPopup(page)
  await expect(popup).toBeHidden()

  // A wrong drop opens the popup with both buttons.
  await dragNumber(page, 2, 7)
  await expect(popup).toContainText(t('numbers.between', { number: 2, before: 1, after: 3 }))
  const setCorrect = setCorrectButton(page)

  // Pressed with Enter: 2 lands on its slot and the popup closes.
  await setCorrect.focus()
  await page.keyboard.press('Enter')
  await expect(popup).toBeHidden()
  await expect(slot(page, 2)).toHaveText('2')
  await expect(tile(page, 2)).toBeHidden()
  // Keyboard focus stays in play, on the first number left on the tray.
  await expect(page.locator('.tray .tile').first()).toBeFocused()

  // Space works too.
  await dragNumber(page, 5, 9)
  await setCorrect.focus()
  await page.keyboard.press('Space')
  await expect(slot(page, 5)).toHaveText('5')

  for (const n of [1, 3, 4, 6, 7, 8, 9, 10, 11, 12]) await tapNumber(page, n, n)
  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.headline', { right: 10, total: 12 }) }),
  ).toBeVisible()
})
