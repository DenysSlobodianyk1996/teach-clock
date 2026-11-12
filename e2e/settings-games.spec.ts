/**
 * Settings shows four Games: Drag Hours and Drag Minutes side by side, then Drag Arrows and Set
 * Time. All four cards fit in full on a desktop, a 768 px tablet and a 360 px phone.
 */
import { t } from './i18n.ts'
import { expect, test } from '@playwright/test'

const GAMES = ['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const

const viewports = [
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 360, height: 720 },
]

for (const viewport of viewports) {
  test.describe(`${viewport.width} × ${viewport.height}`, () => {
    test.use({ viewport })

    test('four Game cards fit, the two drag Games side by side', async ({ page }) => {
      await page.goto('/')
      await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
      await page.getByRole('button', { name: t('welcome.start') }).click()

      const cards = page.locator('.games label.choice')
      await expect(cards).toHaveCount(4)
      await expect(cards.locator('b')).toHaveText(GAMES.map((g) => t(`games.${g}.name`)))

      const boxes = []
      for (let i = 0; i < 4; i++) {
        const card = cards.nth(i)
        const box = (await card.boundingBox())!
        expect(box.x, GAMES[i]).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width, GAMES[i]).toBeLessThanOrEqual(viewport.width)
        // Nothing inside spills out of its card.
        const spills = await card.evaluate((e) =>
          [...e.querySelectorAll('b, .description, svg')].some((child) => {
            const c = child.getBoundingClientRect()
            const r = e.getBoundingClientRect()
            return c.left < r.left || c.right > r.right || c.bottom > r.bottom
          }),
        )
        expect(spills, GAMES[i]).toBe(false)
        boxes.push(box)
      }
      // Drag Minutes sits right after Drag Hours, on the same row.
      expect(Math.round(boxes[1]!.y)).toBe(Math.round(boxes[0]!.y))
      expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x)
      expect(
        await page.evaluate(() => document.scrollingElement!.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(0)
    })
  })
}
