/**
 * The phone layout starts at 768px wide or less, or when the window is taller than wide
 * (src/styles/media.ts). Between 601px and 768px, and on an upright tablet, a Drag Arrows Round
 * stacks: the clock fills the width and no big empty band is left under the answer. Wider landscape
 * windows keep the 4:3 play area, and sideways phones keep the clock and the answer side by side.
 */
import { t, startingWith } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'

async function toDragArrowsRound(page: Page) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragArrows.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('button', { name: t('round.submit') })).toBeVisible()
}

/** Where an element sits; `bottom` is measured from the very top of the page, not the scroll. */
async function box(locator: Locator) {
  return locator.evaluate((e) => {
    const r = e.getBoundingClientRect()
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom + scrollY, width: r.width }
  })
}

const stacked = [
  { width: 601, height: 800 },
  { width: 700, height: 900 },
  { width: 768, height: 900 },
  // An upright tablet.
  { width: 768, height: 1024 },
]

for (const viewport of stacked) {
  test.describe(`${viewport.width} × ${viewport.height}`, () => {
    test.use({ viewport })

    test('Drag Arrows uses the phone layout: a wide clock above the answer, no empty band', async ({
      page,
    }) => {
      await toDragArrowsRound(page)
      const clock = await box(page.locator('.clock-side svg.clock'))
      const answer = await box(page.locator('.answer-side'))
      expect(answer.top, 'the answer sits under the clock').toBeGreaterThanOrEqual(clock.bottom - 1)
      expect(clock.width, 'the clock fills most of the width').toBeGreaterThanOrEqual(
        viewport.width * 0.65,
      )
      const submit = await box(page.getByRole('button', { name: t('round.submit') }))
      expect(submit.bottom, 'Submit fits without scrolling').toBeLessThanOrEqual(viewport.height)
      expect(
        viewport.height - submit.bottom,
        'no big empty band under the answer',
      ).toBeLessThanOrEqual(viewport.height * 0.2)
    })
  })
}

test.describe('1024 × 768, a wider landscape window', () => {
  test.use({ viewport: { width: 1024, height: 768 } })

  test('keeps the 4:3 play area, the clock beside the answer', async ({ page }) => {
    await toDragArrowsRound(page)
    const stage = await page
      .locator('.stage')
      .evaluate((e) => e.getBoundingClientRect().width / e.getBoundingClientRect().height)
    expect(stage).toBeCloseTo(4 / 3, 1)
    const clock = await box(page.locator('.clock-side'))
    const answer = await box(page.locator('.answer-side'))
    expect(answer.left, 'the answer sits right of the clock').toBeGreaterThanOrEqual(
      clock.right - 1,
    )
  })
})

test.describe('740 × 360, a sideways phone', () => {
  test.use({ viewport: { width: 740, height: 360 } })

  test('keeps the clock beside the answer, as before', async ({ page }) => {
    await toDragArrowsRound(page)
    const clock = await box(page.locator('.clock-side'))
    const answer = await box(page.locator('.answer-side'))
    expect(answer.left, 'the answer sits right of the clock').toBeGreaterThanOrEqual(
      clock.right - 1,
    )
  })
})
