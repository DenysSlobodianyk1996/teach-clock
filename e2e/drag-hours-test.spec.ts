import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { dragNumber, dragPlaced, slot, tapNumber, tile } from './numbers.ts'

test('a Drag Hours Test Round takes free moves, submits once and shows the misplaced numbers', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragHours.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  const submit = page.getByRole('button', { name: t('numbers.submit') })

  // A wrong drop stays, with no popup.
  await dragNumber(page, 4, 5)
  await expect(slot(page, 5)).toHaveText('4')
  await expect(page.getByRole('dialog')).toBeHidden()

  // 5 dropped on 4's slot sends nothing back: 4 is on slot 5, so slot 4 is free.
  await dragNumber(page, 5, 4)
  // Swap two numbers on the face by dragging one onto the other, then swap them back by tapping.
  await dragNumber(page, 1, 1)
  await dragNumber(page, 2, 2)
  await dragPlaced(page, 1, 2)
  await expect(slot(page, 1)).toHaveText('2')
  await expect(slot(page, 2)).toHaveText('1')
  await slot(page, 1).click()
  await slot(page, 2).click()
  await expect(slot(page, 1)).toHaveText('1')

  for (const n of [3, 6, 7, 8, 9, 10, 11]) await tapNumber(page, n, n)
  await expect(submit).toBeHidden()
  await dragNumber(page, 12, 12)
  await expect(tile(page, 12)).toBeHidden()
  await expect(
    page.getByRole('img', { name: t('numbers.placedLabel', { n: 12, total: 12 }) }),
  ).toBeVisible()
  await submit.click()

  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.numbersHeadline', { right: 10, total: 12 }) }),
  ).toBeVisible()
  await expect(
    page.getByRole('img', { name: t('summary.yourFaceLabel', { numbers: '4, 5' }) }),
  ).toBeVisible()
  await expect(
    page.getByText(t('numbers.between', { number: 4, before: 3, after: 5 })),
  ).toBeVisible()
})
