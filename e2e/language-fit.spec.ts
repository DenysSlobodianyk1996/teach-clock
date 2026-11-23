/**
 * Every language on the list, on the phones the no-scroll contract names (batch 28): long words stay
 * inside their cards, buttons, headings, popups and toasts, through each Game in both Modes to its
 * Summary. A Summary is longer than a phone, so it scrolls only inside <main>; the page never does.
 */
import { languageNow, LOCALES, startingWith, tIn, type Locale } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'
import { slot, tapNumber, tile } from './numbers.ts'

type Lookup = (key: Parameters<typeof tIn>[1], params?: Parameters<typeof tIn>[2]) => string
type Game = 'dragHours' | 'dragMinutes' | 'dragArrows' | 'setTime'
type Mode = 'teach' | 'test'

const GAMES: readonly Game[] = ['dragHours', 'dragMinutes', 'dragArrows', 'setTime']
const MODES: readonly Mode[] = ['teach', 'test']
const TASKS = 10

/** Text that leaves its box or the screen, with where it was found. */
async function overflowing(page: Page) {
  return page.evaluate(() => {
    const BOX = 'button, label, a, h1, h2, h3, p, li, [role="alert"], [role="status"]'
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const out: string[] = []
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      const parent = node.parentElement
      if (!node.data.trim() || !parent || parent.closest('svg, script, style')) continue
      // Kept for screen readers only, such as the brand name next to the tools on a phone.
      if (getComputedStyle(parent).clipPath !== 'none') continue
      const range = document.createRange()
      range.selectNodeContents(node)
      const text = range.getBoundingClientRect()
      if (!text.width) continue
      const box = (parent.closest(BOX) ?? parent).getBoundingClientRect()
      if (
        text.left < box.left - 1 ||
        text.right > box.right + 1 ||
        text.left < -1 ||
        text.right > innerWidth + 1
      ) {
        out.push(node.data.trim())
      }
    }
    return out
  })
}

async function expectInside(page: Page, what: string) {
  await page.evaluate(() => document.fonts.ready)
  expect(await overflowing(page), what).toEqual([])
  expect(
    await page.evaluate(() => document.scrollingElement!.scrollHeight - innerHeight),
    `${what}: the page never scrolls`,
  ).toBeLessThanOrEqual(0)
  expect(
    await page.evaluate(() => document.scrollingElement!.scrollWidth - innerWidth),
    `${what}: no sideways scroll`,
  ).toBeLessThanOrEqual(0)
}

/** How far <main> scrolls; 0 when the screen fits. */
function mainScroll(page: Page) {
  return page.locator('main').evaluate((main) => main.scrollHeight - main.clientHeight)
}

async function toSettings(page: Page, tx: Lookup) {
  await page.goto('/')
  await page.getByLabel(tx('welcome.nameLabel')).fill('Maximilian')
  await page.getByRole('button', { name: tx('welcome.start') }).click()
  await expect(page.getByRole('button', { name: tx('settings.play') })).toBeVisible()
}

async function startGame(page: Page, tx: Lookup, game: Game, mode: Mode) {
  await toSettings(page, tx)
  await page.getByRole('radio', { name: startingWith(tx(`games.${game}.name`)) }).check()
  await page.getByRole('radio', { name: startingWith(tx(`modes.${mode}.name`)) }).check()
  if (game === 'dragArrows' || game === 'setTime') {
    await page.getByRole('radio', { name: startingWith(tx('levels.5.name')) }).check()
  }
  await page.getByRole('button', { name: tx('settings.play') }).click()
  await expect(page.locator('.round')).toBeVisible()
}

const wrongPopup = (page: Page, tx: Lookup) =>
  page.getByRole('dialog', { name: tx('teach.wrongTitle') })

/** Takes the wrong-answer popup's Set correct answer, after checking the popup fits. */
async function setCorrect(page: Page, tx: Lookup, what: string) {
  const popup = wrongPopup(page, tx)
  await expect(popup).toBeVisible()
  await expectInside(page, `${what}: the wrong-answer popup`)
  await popup.getByRole('button', { name: tx('teach.setCorrect') }).click()
  await expect(popup).toBeHidden()
}

/** Opens the Filled Clock from a drag Game's Teach Round, checks it fits and closes it. */
async function checkFilledClock(page: Page, tx: Lookup, what: string) {
  await page.getByRole('button', { name: tx('numbers.showFilled') }).click()
  const popup = page.getByRole('dialog', { name: tx('numbers.filledTitle') })
  await expect(popup.getByRole('img', { name: tx('numbers.filledFace') })).toBeVisible()
  await expectInside(page, `${what}: the Filled Clock`)
  await popup.getByRole('button', { name: tx('teach.gotIt') }).click()
  await expect(popup).toBeHidden()
}

async function playDrag(page: Page, tx: Lookup, mode: Mode, what: string) {
  if (mode === 'teach') {
    await checkFilledClock(page, tx, what)
    await tapNumber(page, 2, 5)
    await setCorrect(page, tx, what)
    for (const n of [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) await tapNumber(page, n, n)
    return
  }
  // 1 and 2 swapped, so the Summary shows both faces and the misplaced list.
  await tapNumber(page, 1, 2)
  await tapNumber(page, 2, 1)
  for (let n = 3; n <= 12; n++) await tapNumber(page, n, n)
  await expect(tile(page, 12)).toBeHidden()
  await expect(slot(page, 12)).not.toBeEmpty()
  await expect(page.getByText(tx('numbers.allPlaced'))).toBeVisible()
  await expectInside(page, `${what}: every number placed`)
  expect(await mainScroll(page), `${what}: every number placed, <main> fits`).toBeLessThanOrEqual(0)
  await page.getByRole('button', { name: tx('numbers.submit') }).click()
}

/** Answers every Task of a clock Game: wrongly in Test, through the popup in Teach. */
async function playClock(page: Page, tx: Lookup, game: Game, mode: Mode, what: string) {
  const submit = page.getByRole('button', { name: tx('round.submit') })
  for (let n = 1; n <= TASKS; n++) {
    await expect(page.getByText(tx('round.progress', { n, total: TASKS }))).toBeVisible()
    if (game === 'setTime') {
      // 12:01 is off the 5-minute step, so it is never the right time.
      await page.keyboard.type('1201')
      await page.keyboard.press('Enter')
    } else {
      await submit.click()
    }
    if (mode === 'teach') {
      const popup = wrongPopup(page, tx)
      const right = page.getByText(tx('teach.right'))
      await expect(popup.or(right).first()).toBeVisible()
      // The hands start at 12:00, which can be the Task's own time.
      if (await popup.isVisible()) {
        await setCorrect(page, tx, what)
        await submit.click()
        await expect(right).toBeVisible()
      }
    }
  }
}

for (const lang of LOCALES as readonly Locale[]) {
  const tx: Lookup = (key, params) => tIn(lang, key, params)

  for (const viewport of [
    { width: 360, height: 728 },
    { width: 360, height: 640 },
    { width: 320, height: 640 },
  ]) {
    test.describe(`${lang} on a ${viewport.width} × ${viewport.height} phone`, () => {
      test.use({ viewport })

      test.beforeEach(async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem('teach-clock.locale', value), lang)
      })

      test('Welcome, its error and its Info Popup keep their text inside', async ({ page }) => {
        await page.goto('/')
        await expectInside(page, 'Welcome')

        // The ⓘ stays on the line of the heading's last word.
        const last = await page.locator('h1 .last').boundingBox()
        const info = await page.getByRole('button', { name: tx('info.more') }).boundingBox()
        expect(info!.y, 'the ⓘ is not above the last word').toBeLessThan(last!.y + last!.height)
        expect(info!.y + info!.height, 'the ⓘ is not below the last word').toBeGreaterThan(last!.y)
        // The last word's box ends with a 48 px gap kept for the ⓘ, so the two never part.
        expect(info!.x, 'the ⓘ follows the last word').toBeGreaterThanOrEqual(
          last!.x + last!.width - 48 - 1,
        )
        expect(info!.x + info!.width, 'the ⓘ is in its gap').toBeLessThanOrEqual(
          last!.x + last!.width + 1,
        )

        await page.getByRole('button', { name: tx('welcome.start') }).click()
        const alert = page.getByRole('alert')
        await expect(alert).toHaveText(tx('welcome.nameRequired'))
        const { height, lineHeight } = await alert.evaluate((e) => ({
          height: e.getBoundingClientRect().height,
          lineHeight: parseFloat(getComputedStyle(e).lineHeight),
        }))
        expect(height, 'the name error is one line').toBeLessThan(lineHeight * 1.5)
        await expectInside(page, 'Welcome with the error')
        await page.getByRole('button', { name: tx('info.more') }).click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expectInside(page, 'Info Popup')
      })

      test('the language menu shows every real row whole', async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: languageNow(lang) }).click()
        const rows = page.getByRole('menuitemradio')
        await expect(rows).toHaveCount(LOCALES.length)
        await expectInside(page, 'language menu')
        for (let i = 0; i < LOCALES.length; i++) await expect(rows.nth(i)).toBeInViewport()
        const clipped = await page.getByRole('menu').evaluate((menu) =>
          [...menu.querySelectorAll<HTMLElement>('.name')]
            .filter((name) => {
              const tick = name.parentElement!.querySelector('.tick')
              const range = document.createRange()
              range.selectNodeContents(name)
              const right = range.getBoundingClientRect().right
              return (
                name.scrollWidth > name.clientWidth ||
                (tick !== null && right > tick.getBoundingClientRect().left)
              )
            })
            .map((name) => name.textContent),
        )
        expect(clipped).toEqual([])
      })

      test('Settings cards keep their long words inside', async ({ page }) => {
        await toSettings(page, tx)
        await expectInside(page, 'Settings, Drag Hours')
        for (const game of ['dragMinutes', 'dragArrows', 'setTime'] as const) {
          await page.getByRole('radio', { name: startingWith(tx(`games.${game}.name`)) }).check()
          await expectInside(page, `Settings, ${game}`)
        }
      })

      for (const game of GAMES) {
        for (const mode of MODES) {
          test(`${game} in ${mode}, played to its Summary, keeps its text inside`, async ({
            page,
          }) => {
            test.setTimeout(120_000)
            const what = `${game} ${mode}`
            await startGame(page, tx, game, mode)
            await expectInside(page, `${what}: the Round`)
            if (game === 'dragHours' || game === 'dragMinutes') {
              await playDrag(page, tx, mode, what)
            } else {
              await playClock(page, tx, game, mode, what)
            }
            await expect(page).toHaveURL(/\/summary$/, { timeout: 10_000 })
            await expect(page.getByRole('button', { name: tx('summary.playAgain') })).toBeVisible()
            await expectInside(page, `${what}: the Summary`)
          })
        }
      }

      test('the right-answer toast keeps its text inside', async ({ page }) => {
        await startGame(page, tx, 'setTime', 'teach')
        const shows = tx('app.clockShows', { time: '' })
        const label = await page
          .locator('.clock-side')
          .getByRole('img', { name: startingWith(shows) })
          .getAttribute('aria-label')
        const [hour, minute] = label!.replace(shows, '').split(':') as [string, string]
        await page.keyboard.type(hour.padStart(2, '0') + minute)
        await page.keyboard.press('Enter')
        await expect(page.getByText(tx('teach.right'))).toBeVisible()
        await expectInside(page, 'the right-answer toast')
      })

      test('the Leave popup keeps its text inside', async ({ page }) => {
        await startGame(page, tx, 'dragHours', 'teach')
        await page.getByRole('button', { name: tx('header.leave') }).click()
        await expect(page.getByRole('dialog', { name: tx('leave.title') })).toBeVisible()
        await expectInside(page, 'the Leave popup')
      })

      test('the Privacy Page keeps its long words inside', async ({ page }) => {
        await page.goto('/privacy-policy')
        await expect(
          page.getByRole('heading', { level: 1, name: tx('privacy.title') }),
        ).toBeVisible()
        await expectInside(page, 'Privacy Page')
      })
    })
  }
}
