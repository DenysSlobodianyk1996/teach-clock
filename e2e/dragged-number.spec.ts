/** The number being dragged sits centred under the pointer. */
import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { tile } from './numbers.ts'

test('a dragged number is centred under the pointer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragNumbers.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  const from = (await tile(page, 6).boundingBox())!
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  const pointer = { x: from.x - 60, y: from.y + 40 }
  await page.mouse.move(pointer.x, pointer.y, { steps: 5 })

  // The disc's centre, ignoring its tilt: a rotated square's box is wider, but its centre stays put.
  const box = (await page.locator('.lifted').boundingBox())!
  const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  expect(
    Math.abs(centre.x - pointer.x),
    `x: centre ${centre.x}, pointer ${pointer.x}`,
  ).toBeLessThanOrEqual(1)
  expect(
    Math.abs(centre.y - pointer.y),
    `y: centre ${centre.y}, pointer ${pointer.y}`,
  ).toBeLessThanOrEqual(1)
  await page.mouse.up()
})

test('every free slot turns orange while a number is dragged, and grey again after', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragNumbers.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  const ready = page.locator('[data-slot].ready')
  const from = (await tile(page, 6).boundingBox())!
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await expect(ready).toHaveCount(0)
  await page.mouse.move(from.x - 60, from.y + 40, { steps: 5 })
  await expect(ready).toHaveCount(12)
  await page.mouse.up()
  await expect(ready).toHaveCount(0)
})
