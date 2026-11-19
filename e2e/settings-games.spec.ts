/**
 * Settings shows four Games: Drag Hours and Drag Minutes side by side, then Drag Arrows and Set
 * Time. All four cards, and the two Mode cards, fit in full on a desktop, a 768 px tablet, a 360 px
 * and a 320 px phone.
 */
import { t } from './i18n.ts'
import { expect, test, type Locator } from '@playwright/test'

/** Whether the title, description or icon sticks out of its card (a hidden one is skipped). */
function spills(card: Locator) {
  return card.evaluate((e) =>
    [...e.querySelectorAll('b, .description, svg')].some((child) => {
      if (child.getClientRects().length === 0) return false
      // For text, the words themselves: a long word can run past its own box.
      const range = document.createRange()
      range.selectNodeContents(child)
      const c =
        child instanceof SVGElement ? child.getBoundingClientRect() : range.getBoundingClientRect()
      const r = e.getBoundingClientRect()
      return c.left < r.left || c.right > r.right || c.bottom > r.bottom
    }),
  )
}

const GAMES = ['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const

const viewports = [
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 360, height: 720 },
  { width: 320, height: 640 },
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
        // Nothing inside spills out of its card (a phone hides the description, so it is skipped).
        expect(await spills(card), GAMES[i]).toBe(false)
        boxes.push(box)
      }
      // Drag Minutes sits right after Drag Hours, on the same row.
      expect(Math.round(boxes[1]!.y)).toBe(Math.round(boxes[0]!.y))
      expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x)
      expect(
        await page.evaluate(() => document.scrollingElement!.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(0)

      const modes = page.locator('.modes label.choice')
      await expect(modes).toHaveCount(2)
      for (const [i, mode] of (['teach', 'test'] as const).entries())
        expect(await spills(modes.nth(i)), mode).toBe(false)
    })
  })
}
