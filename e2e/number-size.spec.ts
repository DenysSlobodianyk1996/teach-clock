import { t, startingWith } from './i18n.ts'
import { expect, test, type Locator } from '@playwright/test'
import { slot, tapNumber, tile } from './numbers.ts'

/** The width an element is laid out at, before any rotation the dragged number gets. */
const width = (el: Locator) => el.evaluate((e) => e.getBoundingClientRect().width)
const laidOutWidth = (el: Locator) => el.evaluate((e) => (e as HTMLElement).offsetWidth)

test('a number is the same size on the tray, under the pointer and on the face', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragNumbers.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('numbers.heading') })).toBeVisible()

  const trayDisc = await width(tile(page, 5).locator('.disc'))

  // Every tray number can be grabbed anywhere in its own 48 × 48 px square.
  const boxes = await page
    .locator('.tray .tile')
    .evaluateAll((tiles) => tiles.map((e) => e.getBoundingClientRect().toJSON() as DOMRect))
  expect(boxes).toHaveLength(12)
  for (const [i, box] of boxes.entries()) {
    expect(box.width).toBeGreaterThanOrEqual(48)
    expect(box.height).toBeGreaterThanOrEqual(48)
    for (const other of boxes.slice(i + 1)) {
      const apart =
        box.right <= other.left + 0.5 ||
        other.right <= box.left + 0.5 ||
        box.bottom <= other.top + 0.5 ||
        other.bottom <= box.top + 0.5
      expect(apart).toBe(true)
    }
  }

  // Held under the pointer.
  const from = (await tile(page, 5).boundingBox())!
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(from.x - 40, from.y - 40, { steps: 4 })
  const lifted = await laidOutWidth(page.locator('.lifted'))
  await page.mouse.up()

  // Placed on the face.
  await tapNumber(page, 5, 5)
  const placed = await width(slot(page, 5).locator('.c-tile'))

  expect(Math.abs(lifted - trayDisc)).toBeLessThanOrEqual(1)
  expect(Math.abs(placed - trayDisc)).toBeLessThanOrEqual(1)

  // The tray fits beside or under the clock without sideways scrolling.
  const scroll = await page.evaluate(() => {
    const root = document.scrollingElement!
    return root.scrollWidth - root.clientWidth
  })
  expect(scroll).toBeLessThanOrEqual(0)
})
