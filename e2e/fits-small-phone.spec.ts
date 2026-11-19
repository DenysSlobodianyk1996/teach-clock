/**
 * On a small phone, Settings and the Round fit the screen: no sideways scroll, Submit in view, and the
 * clock as big as the room left allows.
 */
import { t } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { startRound } from './round.ts'
import { closeWrongPopup, popupButtons, wrongPopup } from './teach.ts'

async function toSettings(page: Page) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
}

/** How far down the page an element ends, measured from the very top (not from the scroll). */
async function bottomFromPageTop(locator: Locator) {
  return locator.evaluate((e) => e.getBoundingClientRect().bottom + scrollY)
}

async function sidewaysScroll(page: Page) {
  return page.evaluate(() => document.scrollingElement!.scrollWidth - innerWidth)
}

test('Welcome on a 360 × 640 phone: the Footer comes after the start button', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto('/')
  const start = page.getByRole('button', { name: t('welcome.start') })
  const footer = page.getByRole('contentinfo')
  await expect(footer).toBeAttached()
  // The Footer sits below the start button, so it never pushes the button further down.
  expect(
    await footer.evaluate((e) => e.getBoundingClientRect().top + scrollY),
  ).toBeGreaterThanOrEqual(await bottomFromPageTop(start))
  expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
})

test('Settings fits: no sideways scroll, Back and Play side by side in full', async ({ page }) => {
  await toSettings(page)
  expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
  const width = page.viewportSize()!.width
  for (const name of [t('settings.back'), t('settings.play')]) {
    const box = (await page
      .getByRole('button', { name })
      .or(page.getByRole('link', { name }))
      .boundingBox())!
    expect(box.x, name).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width, name).toBeLessThanOrEqual(width)
  }
})

for (const game of ['setTime', 'dragArrows'] as const) {
  test(`${game} Teach: Submit stays on screen through the wrong-Answer popup`, async ({ page }) => {
    await startRound(page, { game, mode: 'teach', level: 15 })
    const submit = page.getByRole('button', { name: t('round.submit') })
    await expect(submit).toBeVisible()
    if (game === 'dragArrows') {
      // The hands need room to be dragged: the clock takes nearly the full width.
      expect(
        await page
          .locator('.clock-side svg.clock')
          .evaluate((e) => e.getBoundingClientRect().width),
      ).toBeGreaterThanOrEqual(300)
    }
    // The Round opens at the top, whatever was scrolled on Settings.
    expect(await page.evaluate(() => scrollY)).toBe(0)
    expect(await bottomFromPageTop(submit), 'Submit fits without scrolling').toBeLessThanOrEqual(
      page.viewportSize()!.height,
    )
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)

    // A wrong try opens the popup: 12:01 is off the 15-minute step; untouched hands are never right.
    if (game === 'setTime') {
      await page.keyboard.type('1201')
      await page.keyboard.press('Enter')
    } else {
      await submit.click()
    }
    // Its two buttons fit the narrow screen, stacked, Got it below.
    const { gotIt, setCorrect } = await popupButtons(page)
    expect(gotIt.y, 'stacked').toBeGreaterThanOrEqual(setCorrect.y + setCorrect.height)
    expect(gotIt.x + gotIt.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    await closeWrongPopup(page, 'setCorrect')
    expect(await bottomFromPageTop(submit), 'Submit fits after the popup').toBeLessThanOrEqual(
      page.viewportSize()!.height,
    )
  })
}

test('Drag Hours Teach: a big face, the popup fits, and the tray stays on screen', async ({
  page,
}) => {
  await startRound(page, { game: 'dragHours', mode: 'teach' })
  const face = page.locator('.board svg.number-face')
  await expect(face).toBeVisible()
  expect(await face.evaluate((e) => e.getBoundingClientRect().width)).toBeGreaterThanOrEqual(300)
  const height = page.viewportSize()!.height
  expect(await bottomFromPageTop(page.locator('.tray')), 'tray fits').toBeLessThanOrEqual(height)

  // Tap a number, then the slot after its own: a wrong drop opens the popup.
  const n = Number(await page.locator('.tray [data-number]').first().getAttribute('data-number'))
  await page.locator(`.tray [data-number="${n}"]`).click()
  await page.locator(`.board [data-slot="${(n % 12) + 1}"]`).click()
  await expect(wrongPopup(page)).toBeVisible()
  // Got it is the lower of the two stacked buttons.
  const { gotIt } = await popupButtons(page)
  expect(gotIt.y + gotIt.height).toBeLessThanOrEqual(height)
  expect(gotIt.x + gotIt.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  await closeWrongPopup(page, 'gotIt')
  expect(
    await bottomFromPageTop(page.locator('.tray')),
    'tray fits after the popup',
  ).toBeLessThanOrEqual(height)
})

test('Drag Hours Test: Готово fits once all 12 numbers are placed', async ({ page }) => {
  await startRound(page, { game: 'dragHours', mode: 'test' })
  for (let n = 1; n <= 12; n++) {
    await page.locator(`.tray [data-number="${n}"]`).click()
    await page.locator(`.board [data-slot="${n}"]`).click()
  }
  const submit = page.getByRole('button', { name: t('numbers.submit') })
  await expect(submit).toBeVisible()
  expect(await bottomFromPageTop(submit), 'Submit fits').toBeLessThanOrEqual(
    page.viewportSize()!.height,
  )
})

/**
 * How far the header's contents stick out past its padding on the right (0 when they fit), so
 * nothing runs into the screen's edge.
 */
async function headerOverflow(page: Page) {
  return page.locator('header').evaluate((header) => {
    const box = header.getBoundingClientRect()
    const edge = Math.min(box.right, innerWidth) - parseFloat(getComputedStyle(header).paddingRight)
    const right = Math.max(
      ...[...header.querySelectorAll('*')].map((e) => e.getBoundingClientRect().right),
    )
    return Math.max(0, right - edge)
  })
}

test.describe('a 320px-wide phone', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  test('the header fits on Settings', async ({ page }) => {
    await toSettings(page)
    await expect(page.getByRole('link', { name: t('header.home') })).toBeVisible()
    expect(await headerOverflow(page)).toBeLessThanOrEqual(0)
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
  })

  test('the header fits in a Round', async ({ page }) => {
    await startRound(page, { game: 'setTime', mode: 'test', level: 15 })
    await expect(page.getByRole('button', { name: t('header.leave') })).toBeVisible()
    expect(await headerOverflow(page)).toBeLessThanOrEqual(0)
    expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
  })

  test('the theme toggle is easy to tap, the knob under the sun or the moon', async ({ page }) => {
    // A light device, and no sliding, so the knob is measured where it rests.
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await toSettings(page)
    const toggle = page.getByRole('switch', { name: t('header.darkTheme') })
    const centre = (b: { x: number; width: number }) => b.x + b.width / 2
    for (const [icon, dark] of [
      ['.sun', 'false'],
      ['.moon', 'true'],
    ] as const) {
      await expect(toggle).toHaveAttribute('aria-checked', dark)
      const box = (await toggle.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      const knob = (await toggle.locator('.knob').boundingBox())!
      const under = (await toggle.locator(icon).boundingBox())!
      expect(Math.abs(centre(knob) - centre(under)), icon).toBeLessThanOrEqual(1)
      await toggle.click()
    }
  })
})

/**
 * A 360 × 640 phone: what Chrome leaves for the page on a small phone (an Oppo A series) once its
 * toolbars are shown. Every Game's Round fits up to its main button, with nothing scrolled, and the
 * clock stays readable.
 */
test.describe('a 360 × 640 phone', () => {
  test.use({ viewport: { width: 360, height: 640 } })

  /** The main button ends within the screen, nothing is scrolled, nothing sticks out sideways. */
  async function expectInView(page: Page, button: Locator, what: string) {
    await expect(button).toBeVisible()
    expect(await page.evaluate(() => scrollY), `${what}: nothing scrolled`).toBe(0)
    expect(await bottomFromPageTop(button), `${what}: ends within the screen`).toBeLessThanOrEqual(
      640,
    )
    expect(await sidewaysScroll(page), `${what}: no sideways scroll`).toBeLessThanOrEqual(0)
  }

  async function clockWidth(page: Page, selector: string) {
    return page.locator(selector).evaluate((e) => e.getBoundingClientRect().width)
  }

  /** A wrong try in Teach: 12:01 is off the 15-minute step; untouched hands are never right. */
  const tryWrong = {
    setTime: async (page: Page) => {
      await page.keyboard.type('1201')
      await page.keyboard.press('Enter')
    },
    dragArrows: async (page: Page) => {
      await page.getByRole('button', { name: t('round.submit') }).click()
    },
  }

  for (const game of ['setTime', 'dragArrows'] as const) {
    test(`${game} test: Submit is in view`, async ({ page }) => {
      await startRound(page, { game, mode: 'test', level: 15 })
      await expectInView(page, page.getByRole('button', { name: t('round.submit') }), 'Submit')
      expect(await clockWidth(page, '.clock-side svg.clock')).toBeGreaterThanOrEqual(150)
    })

    test(`${game} teach: Submit is in view, also through the wrong-Answer popup`, async ({
      page,
    }) => {
      await startRound(page, { game, mode: 'teach', level: 15 })
      const submit = page.getByRole('button', { name: t('round.submit') })
      await expectInView(page, submit, 'Submit')
      expect(await clockWidth(page, '.clock-side svg.clock')).toBeGreaterThanOrEqual(150)

      await tryWrong[game](page)
      await expect(wrongPopup(page)).toBeVisible()
      const { gotIt } = await popupButtons(page)
      expect(gotIt.y + gotIt.height, 'the popup fits').toBeLessThanOrEqual(640)
      await closeWrongPopup(page, 'gotIt')
      await expectInView(page, submit, 'Submit after the popup')
    })
  }

  for (const game of ['dragHours', 'dragMinutes'] as const) {
    test(`${game} teach: the face and the full tray are in view, also through the popup`, async ({
      page,
    }) => {
      await startRound(page, { game, mode: 'teach' })
      const tray = page.locator('.tray')
      await expectInView(page, tray, 'tray')
      expect(await clockWidth(page, '.board svg.number-face')).toBeGreaterThanOrEqual(150)

      // Tap a number, then the slot after its own: a wrong drop opens the popup.
      const n = Number(
        await page.locator('.tray [data-number]').first().getAttribute('data-number'),
      )
      await page.locator(`.tray [data-number="${n}"]`).click()
      await page.locator(`.board [data-slot="${(n % 12) + 1}"]`).click()
      await expect(wrongPopup(page)).toBeVisible()
      const { gotIt } = await popupButtons(page)
      expect(gotIt.y + gotIt.height, 'the popup fits').toBeLessThanOrEqual(640)
      await closeWrongPopup(page, 'gotIt')
      await expectInView(page, tray, 'tray after the popup')
    })

    test(`${game} test: Done is in view once all 12 are placed`, async ({ page }) => {
      await startRound(page, { game, mode: 'test' })
      await expectInView(page, page.locator('.tray'), 'tray')
      expect(await clockWidth(page, '.board svg.number-face')).toBeGreaterThanOrEqual(150)
      for (let n = 1; n <= 12; n++) {
        await page.locator(`.tray [data-number="${n}"]`).click()
        await page.locator(`.board [data-slot="${n}"]`).click()
      }
      await expectInView(page, page.getByRole('button', { name: t('numbers.submit') }), 'Done')
    })
  }
})
