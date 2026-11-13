import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { dragNumber, dragPlaced, slot, tapNumber, tile } from './numbers.ts'

test('a Drag Minutes Test Round takes free moves, submits once and shows both faces in minutes', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragMinutes.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  const submit = page.getByRole('button', { name: t('numbers.submit') })

  // 20 dropped where 25 goes stays there, with no popup.
  await dragNumber(page, 4, 5)
  await expect(slot(page, 5)).toHaveText('20')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.locator('.hour-badge')).toHaveCount(12)

  // 25 goes on 20's slot; then a swap by dragging and a swap back by tapping.
  await dragNumber(page, 5, 4)
  await dragNumber(page, 1, 1)
  await dragNumber(page, 2, 2)
  await dragPlaced(page, 1, 2)
  await expect(slot(page, 1)).toHaveText('10')
  await expect(slot(page, 2)).toHaveText('5')
  await slot(page, 1).click()
  await slot(page, 2).click()
  await expect(slot(page, 1)).toHaveText('5')

  for (const n of [3, 6, 7, 8, 9, 10, 11]) await tapNumber(page, n, n)
  await expect(submit).toBeHidden()
  await dragNumber(page, 12, 12)
  await expect(tile(page, 12)).toBeHidden()
  await expect(slot(page, 12)).toHaveText('60')
  await submit.click()

  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.numbersHeadline', { right: 10, total: 12 }) }),
  ).toBeVisible()
  await expect(page.locator('.details')).toContainText(t('games.dragMinutes.name'))
  const mine = page.getByRole('img', { name: t('summary.yourFaceLabel', { numbers: '20, 25' }) })
  const correct = page.getByRole('img', { name: t('summary.correctFaceLabel') })
  await expect(mine).toBeVisible()
  await expect(correct).toBeVisible()
  await expect(
    page.getByText(t('numbers.between', { number: 20, before: 15, after: 25 })),
  ).toBeVisible()

  // Both faces keep their Hour Badges, big enough to read beside the minute tiles.
  for (const face of [mine, correct]) {
    await expect(face.locator('.hour-badge')).toHaveCount(12)
    await expect(face.locator('[data-slot="12"]')).toHaveText('60')
    const badge = (await face.locator('.hour-badge text').nth(11).boundingBox())!
    expect(badge.height).toBeGreaterThanOrEqual(10)
  }
})
