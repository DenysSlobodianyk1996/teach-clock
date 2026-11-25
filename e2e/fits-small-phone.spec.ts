/**
 * On a small phone, Settings and the Round fit the screen: no sideways scroll, Submit in view, and the
 * clock as big as the room left allows.
 */
import { startingWith, t, languageNow, LOCALES } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { startRound } from './round.ts'
import { closeWrongPopup, popupButtons, wrongPopup } from './teach.ts'

async function toSettings(page: Page) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
}

/** How far down an element ends, measured from the screen's top with nothing scrolled: neither the
 * page nor <main>, the one part that may scroll (batch 25). */
async function bottomFromPageTop(locator: Locator) {
  return locator.evaluate(
    (e) =>
      e.getBoundingClientRect().bottom + scrollY + (document.querySelector('main')?.scrollTop ?? 0),
  )
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

test.describe('Welcome on a 360 × 640 phone', () => {
  test.use({ viewport: { width: 360, height: 640 } })

  test('Start is in view with nothing scrolled; the intro is behind the ⓘ', async ({ page }) => {
    await page.goto('/')
    const start = page.getByRole('button', { name: t('welcome.start') })
    await expect(start).toBeVisible()
    expect(await bottomFromPageTop(start), 'Start fits without scrolling').toBeLessThanOrEqual(640)
    await expect(page.getByText(t('welcome.intro'))).toBeHidden()

    // The clock shrinks to the room left, never below about 120 px.
    const clock = page.locator('.art svg.clock')
    expect(await clock.evaluate((e) => e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      118,
    )

    await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
    await page.getByRole('button', { name: t('info.more') }).click()
    const popup = page.getByRole('dialog')
    await expect(popup).toContainText(t('welcome.intro'))
    await popup.getByRole('button', { name: t('teach.gotIt') }).click()
    await expect(popup).toBeHidden()
    await expect(page.getByLabel(t('welcome.nameLabel'))).toHaveValue('Оля')
    expect(await page.evaluate(() => scrollY)).toBe(0)
  })

  for (const locale of LOCALES) {
    test(`the ⓘ is centred on the heading's last word, ${locale}`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('teach-clock.locale', value), locale)
      await page.goto('/')
      const last = page.locator('.welcome .last')
      await expect(last).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      // Batch 25: it sat 4 px low, centred on the body text's letters instead of the heading's.
      const offset = await last.evaluate((word) => {
        // A box 1ex tall on the word's baseline: its middle is the middle of the lowercase letters.
        const probe = document.createElement('span')
        probe.style.cssText = 'display:inline-block;width:0;height:1ex;vertical-align:baseline'
        word.prepend(probe)
        const letters = probe.getBoundingClientRect()
        probe.remove()
        const ring = document
          .querySelector('.welcome .info-btn svg circle')!
          .getBoundingClientRect()
        return ring.top + ring.height / 2 - (letters.top + letters.height / 2)
      })
      expect(Math.abs(offset), 'ⓘ centre against the letters').toBeLessThanOrEqual(1)
    })
  }
})

test('Welcome on a 360 × 640 phone with big text: only <main> scrolls, Start above the Footer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto('/')
  // As with a large font scale: the heading takes far more room than usual.
  await page.addStyleTag({ content: '.welcome h1 { font-size: 64px !important; }' })
  expect(
    await page.evaluate(() => document.scrollingElement!.scrollHeight - innerHeight),
    'the page never scrolls',
  ).toBeLessThanOrEqual(0)
  const start = page.getByRole('button', { name: t('welcome.start') })
  await start.scrollIntoViewIfNeeded()
  const startBox = (await start.boundingBox())!
  const footerBox = (await page.getByRole('contentinfo').boundingBox())!
  expect(startBox.y + startBox.height, 'the Footer never covers Start').toBeLessThanOrEqual(
    footerBox.y,
  )
  expect(footerBox.y + footerBox.height, 'the Footer stays on the screen').toBeLessThanOrEqual(640)
})

test('Welcome on a 360 × 640 phone: the on-screen keyboard never makes the clock jump bigger', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).focus()
  const before = await welcomeClockSize(page)
  // A keyboard that shrinks the page (Android WebView, Firefox on Android) leaves about 360 px.
  await page.setViewportSize({ width: 360, height: 360 })
  expect(await welcomeClockSize(page), 'no bigger than before the keyboard').toBeLessThanOrEqual(
    before,
  )
})

/** The Welcome clock's drawn size: the smaller side of its box, as the face is drawn to fit both. */
async function welcomeClockSize(page: Page) {
  return page.locator('.art svg.clock').evaluate((e) => {
    const box = e.getBoundingClientRect()
    return Math.min(box.width, box.height)
  })
}

test('Welcome on a 412 × 915 phone: a clearly bigger clock than at 360 × 640, Start in view', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto('/')
  const small = await welcomeClockSize(page)

  await page.setViewportSize({ width: 412, height: 915 })
  await page.goto('/')
  const big = await welcomeClockSize(page)
  expect(big, 'the clock grows into the room').toBeGreaterThanOrEqual(small + 100)
  expect(big, 'no wider than the column').toBeLessThanOrEqual(412 - 40)
  const start = page.getByRole('button', { name: t('welcome.start') })
  expect(await bottomFromPageTop(start), 'Start fits without scrolling').toBeLessThanOrEqual(915)
  expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
})

for (const locale of ['uk-UA', 'en-US']) {
  test.describe(`Welcome on an upright 10-inch tablet, ${locale}`, () => {
    test.use({ viewport: { width: 810, height: 1440 }, locale })

    test('a big clock within the width, the column full width, Start in view', async ({ page }) => {
      await page.goto('/')
      const size = await welcomeClockSize(page)
      expect(size, 'a big clock').toBeGreaterThanOrEqual(500)
      expect(size, 'within the width').toBeLessThanOrEqual(810 - 40)
      const field = (await page.locator('#player-name').boundingBox())!
      expect(field.width, 'the name field spans the column').toBeGreaterThanOrEqual(810 - 60)
      expect(await bottomFromPageTop(page.locator('form button[type=submit]'))).toBeLessThanOrEqual(
        1440,
      )
    })
  })
}

test.describe('Welcome on a desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false })

  test('shows the intro beside the clock and no ⓘ', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(t('welcome.intro'))).toBeVisible()
    await expect(page.getByRole('button', { name: t('info.more') })).toHaveCount(0)
  })
})

/** Scrolls Got it into view if it has to, then checks it lies on the screen and closes the popup. */
async function expectGotItReachable(page: Page) {
  const popup = page.getByRole('dialog')
  const gotIt = popup.getByRole('button', { name: t('teach.gotIt') })
  await gotIt.scrollIntoViewIfNeeded()
  const box = (await gotIt.boundingBox())!
  const height = page.viewportSize()!.height
  expect(box.y, 'Got it starts on the screen').toBeGreaterThanOrEqual(0)
  expect(box.y + box.height, 'Got it ends on the screen').toBeLessThanOrEqual(height)
  await gotIt.click()
  await expect(popup).toBeHidden()
}

for (const viewport of [
  { width: 640, height: 360 },
  { width: 800, height: 360 },
]) {
  test.describe(`a sideways ${viewport.width} × ${viewport.height} phone`, () => {
    test.use({ viewport })

    test('Got it is reachable in the Welcome and Game Info Popups', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: t('info.more') }).click()
      await expectGotItReachable(page)

      await toSettings(page)
      await page
        .getByRole('group', { name: t('settings.game') })
        .getByRole('button', { name: t('info.moreAbout', { section: t('settings.game') }) })
        .click()
      await expectGotItReachable(page)
      expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
    })

    test('Set Time: <main> runs on below Submit with room under it, the page never scrolls', async ({
      page,
    }) => {
      await startRound(page, { game: 'setTime', mode: 'test', level: 15 })
      const submit = page.getByRole('button', { name: t('round.submit') })
      await expect(submit).toBeVisible()
      const room = await submit.evaluate((e) => {
        const main = document.querySelector('main')!
        const bottom = e.getBoundingClientRect().bottom - main.getBoundingClientRect().top
        return main.scrollHeight - (bottom + main.scrollTop)
      })
      expect(room, 'room under Submit').toBeGreaterThanOrEqual(10)
      expect(
        await page.evaluate(() => document.scrollingElement!.scrollHeight - innerHeight),
        'the page never scrolls',
      ).toBeLessThanOrEqual(0)
      expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
    })
  })
}

test.describe('Settings on a 360 × 640 phone', () => {
  test.use({ viewport: { width: 360, height: 640 } })

  const descriptions = [
    ...(['dragMinutes', 'dragArrows', 'setTime'] as const).map((g) => t(`games.${g}.description`)),
    ...(['teach', 'test'] as const).map((m) => t(`modes.${m}.description`)),
    ...([1, 5, 15] as const).map((l) => t(`levels.${l}.description`)),
    ...([12, 24] as const).map((h) => t(`hours.${h}.description`)),
  ]

  for (const game of ['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const) {
    test(`${game}: Play in view with nothing scrolled, no descriptions, an ⓘ for Game and Mode`, async ({
      page,
    }) => {
      await toSettings(page)
      const gameCard = page.getByRole('radio', { name: startingWith(t(`games.${game}.name`)) })
      const testCard = page.getByRole('radio', { name: startingWith(t('modes.test.name')) })
      await gameCard.check()
      await testCard.check()
      await page.evaluate(() => scrollTo(0, 0))

      const back = page.getByRole('button', { name: t('settings.back') })
      const play = page.getByRole('button', { name: t('settings.play') })
      expect(await bottomFromPageTop(play), 'Play fits without scrolling').toBeLessThanOrEqual(640)
      const [b, p] = [(await back.boundingBox())!, (await play.boundingBox())!]
      expect(Math.round(b.y), 'side by side').toBe(Math.round(p.y))
      expect(b.x + b.width).toBeLessThanOrEqual(p.x)
      expect(p.x + p.width).toBeLessThanOrEqual(360)
      for (const text of descriptions) await expect(page.getByText(text)).toBeHidden()

      for (const section of ['settings.game', 'settings.mode'] as const) {
        await page
          .getByRole('group', { name: t(section) })
          .getByRole('button', { name: t('info.moreAbout', { section: t(section) }), exact: true })
          .click()
        const popup = page.getByRole('dialog')
        await expect(popup.getByRole('heading', { name: t(section) })).toBeVisible()
        await popup.getByRole('button', { name: t('teach.gotIt') }).click()
        await expect(popup).toBeHidden()
      }
      await expect(gameCard).toBeChecked()
      await expect(testCard).toBeChecked()
      expect(await sidewaysScroll(page)).toBeLessThanOrEqual(0)
    })
  }
})

for (const size of [
  { width: 412, height: 915 },
  { width: 810, height: 1440 },
]) {
  test(`Settings on a ${size.width} × ${size.height} screen: Back and Play follow the Mode cards closely`, async ({
    page,
  }) => {
    await page.setViewportSize(size)
    await toSettings(page)
    const modes = page.getByRole('group', { name: t('settings.mode') })
    const play = page.getByRole('button', { name: t('settings.play') })
    const playTop = await play.evaluate((e) => e.getBoundingClientRect().top + scrollY)
    // Between them only the Level row (Set Time is the default Game) and the usual gaps.
    expect(playTop - (await bottomFromPageTop(modes)), 'no big empty gap').toBeLessThanOrEqual(160)
    expect(await bottomFromPageTop(play)).toBeLessThanOrEqual(size.height)
  })
}

test.describe('Settings on a desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false })

  test('shows the descriptions on the cards and no ⓘ', async ({ page }) => {
    await toSettings(page)
    await expect(page.getByText(t('games.setTime.description'))).toBeVisible()
    await expect(page.getByText(t('modes.teach.description'))).toBeVisible()
    await expect(page.getByRole('button', { name: startingWith(t('info.more')) })).toHaveCount(0)
  })
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

  test('the header buttons are easy to tap and fit beside Home', async ({ page }) => {
    await toSettings(page)
    for (const name of [languageNow('uk'), t('header.home')]) {
      const box = (await page
        .getByRole('link', { name })
        .or(page.getByRole('button', { name }))
        .boundingBox())!
      expect(box.width, name).toBeGreaterThanOrEqual(44)
      expect(box.height, name).toBeGreaterThanOrEqual(44)
    }
    expect(await headerOverflow(page)).toBeLessThanOrEqual(0)
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

  // A typed minute is always 00–59 (batch 29), so only the hour box can show an error.
  test('setTime: the time-box error shows and Submit stays in view, the clock keeps its size', async ({
    page,
  }) => {
    await startRound(page, { game: 'setTime', mode: 'test', level: 15 })
    const submit = page.getByRole('button', { name: t('round.submit') })
    const before = await clockWidth(page, '.clock-side svg.clock')
    await page.keyboard.type('1359')
    await page.keyboard.press('Enter')
    await expect(page.getByText(t('round.errors.hour'))).toBeVisible()
    await expectInView(page, submit, 'Submit with the error')
    expect(await clockWidth(page, '.clock-side svg.clock'), 'the clock keeps its size').toBe(before)
  })

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
