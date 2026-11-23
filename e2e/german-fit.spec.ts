/**
 * German is the longest text on the language list (batch 28): its long words stay inside their
 * cards, buttons, headings, popups and toasts on the phones the no-scroll contract names. The
 * Summary is longer than a phone in every language, so it scrolls only inside <main>. Welcome,
 * Settings and each Round also have no-app-scroll.spec.ts.
 */
import { languageNow, startingWith, t, tIn, type Locale } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'
import { slot, tapNumber, tile } from './numbers.ts'

const LANG: Locale = 'de'
const de = (...args: Parameters<typeof t>) => tIn(LANG, ...args)

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

async function toSettings(page: Page) {
  await page.goto('/')
  await page.getByLabel(de('welcome.nameLabel')).fill('Maximilian')
  await page.getByRole('button', { name: de('welcome.start') }).click()
  await expect(page.getByRole('button', { name: de('settings.play') })).toBeVisible()
}

type Game = 'dragHours' | 'dragMinutes' | 'dragArrows' | 'setTime'

async function startGame(page: Page, game: Game, mode: 'teach' | 'test') {
  await toSettings(page)
  await page.getByRole('radio', { name: startingWith(de(`games.${game}.name`)) }).check()
  await page.getByRole('radio', { name: startingWith(de(`modes.${mode}.name`)) }).check()
  await page.getByRole('button', { name: de('settings.play') }).click()
  await expect(page.locator('.round')).toBeVisible()
}

for (const viewport of [
  { width: 360, height: 728 },
  { width: 360, height: 640 },
  { width: 320, height: 640 },
]) {
  test.describe(`German on a ${viewport.width} × ${viewport.height} phone`, () => {
    test.use({ viewport })

    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('teach-clock.locale', value), LANG)
    })

    test('Welcome, its error and its Info Popup keep their text inside', async ({ page }) => {
      await page.goto('/')
      await expectInside(page, 'Welcome')
      await page.getByRole('button', { name: de('welcome.start') }).click()
      const alert = page.getByRole('alert')
      await expect(alert).toHaveText(de('welcome.nameRequired'))
      const { height, lineHeight } = await alert.evaluate((e) => ({
        height: e.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(e).lineHeight),
      }))
      expect(height, 'the name error is one line').toBeLessThan(lineHeight * 1.5)
      await expectInside(page, 'Welcome with the error')
      await page.getByRole('button', { name: de('info.more') }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await expectInside(page, 'Info Popup')
    })

    test('the language menu shows every real row whole', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: languageNow(LANG) }).click()
      await expect(page.getByRole('menuitemradio').first()).toBeVisible()
      await expectInside(page, 'language menu')
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
      await toSettings(page)
      await expectInside(page, 'Settings, Drag Hours')
      for (const game of ['dragMinutes', 'dragArrows', 'setTime'] as const) {
        await page.getByRole('radio', { name: startingWith(de(`games.${game}.name`)) }).check()
        await expectInside(page, `Settings, ${game}`)
      }
    })

    for (const game of ['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const) {
      for (const mode of ['teach', 'test'] as const) {
        test(`a ${game} Round in ${mode} keeps its text inside`, async ({ page }) => {
          await startGame(page, game, mode)
          await expectInside(page, `${game} ${mode}`)
        })
      }
    }

    test('the right-answer toast keeps its text inside', async ({ page }) => {
      await startGame(page, 'setTime', 'teach')
      const shows = de('app.clockShows', { time: '' })
      const label = await page
        .locator('.clock-side')
        .getByRole('img', { name: startingWith(shows) })
        .getAttribute('aria-label')
      const [hour, minute] = label!.replace(shows, '').split(':') as [string, string]
      await page.keyboard.type(hour.padStart(2, '0') + minute)
      await page.keyboard.press('Enter')
      await expect(page.getByText(de('teach.right'))).toBeVisible()
      await expectInside(page, 'the right-answer toast')
    })

    test('the wrong-answer popup and Leave keep their text inside', async ({ page }) => {
      await startGame(page, 'dragHours', 'teach')
      await tapNumber(page, 2, 5)
      await expect(page.getByRole('dialog', { name: de('teach.wrongTitle') })).toBeVisible()
      await expectInside(page, 'the wrong-answer popup')
      await page
        .getByRole('dialog', { name: de('teach.wrongTitle') })
        .getByRole('button', { name: de('teach.gotIt') })
        .click()
      await page.getByRole('button', { name: de('header.leave') }).click()
      await expect(page.getByRole('dialog', { name: de('leave.title') })).toBeVisible()
      await expectInside(page, 'the Leave popup')
    })

    test('the Privacy Page keeps its long words inside', async ({ page }) => {
      await page.goto('/privacy-policy')
      await expect(page.getByRole('heading', { level: 1, name: de('privacy.title') })).toBeVisible()
      await expectInside(page, 'Privacy Page')
    })

    test('the Summary keeps its text inside and the page unscrolled', async ({ page }) => {
      await startGame(page, 'dragHours', 'test')
      // 1 and 2 swapped, so the Summary shows both faces and the misplaced list.
      await tapNumber(page, 1, 2)
      await tapNumber(page, 2, 1)
      for (let n = 3; n <= 12; n++) await tapNumber(page, n, n)
      await expect(tile(page, 12)).toBeHidden()
      await expect(slot(page, 12)).toHaveText('12')
      await expect(page.getByText(de('numbers.allPlaced'))).toBeVisible()
      await expectInside(page, 'every number placed')
      expect(await mainScroll(page), 'every number placed: <main> fits').toBeLessThanOrEqual(0)
      await page.getByRole('button', { name: de('numbers.submit') }).click()
      await expect(page).toHaveURL(/\/summary$/)
      await expect(
        page.getByRole('heading', {
          name: de('summary.numbersHeadline', { right: 10, total: 12 }),
        }),
      ).toBeVisible()
      await expectInside(page, 'Summary')
    })
  })
}
