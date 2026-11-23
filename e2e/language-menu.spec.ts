/** The header's language menu (batch 28, ticket 03): a dropdown of the language list. */
import {
  chooseLanguage,
  languageKey,
  languageNow,
  languageRow,
  LOCALES,
  startingWith,
  t,
  tEn,
} from './i18n.ts'
import { LANGUAGES } from '../src/i18n/locales.ts'
import { expect, test, type Page } from '@playwright/test'
import { startRound } from './round.ts'

test('the button opens the list in order, the current language ticked', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: languageNow('uk') })
  await expect(button).toHaveText(languageKey('uk'))
  await button.click()

  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  await expect(page.getByRole('menuitemradio')).toHaveText(
    LANGUAGES.map(({ key, name }) => new RegExp(`^${key}\\s*${name}`)),
  )
  for (const locale of LOCALES) {
    await expect(languageRow(page, locale)).toHaveAttribute('aria-checked', String(locale === 'uk'))
  }
})

test('choosing a language switches at once, closes the menu and is remembered', async ({
  page,
}) => {
  await page.goto('/')
  await chooseLanguage(page, 'uk', 'en')
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(page.getByRole('menu')).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
})

test('a tap outside closes the menu with no change and does not reach the screen', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: languageNow('uk') }).click()
  const start = (await page.getByRole('button', { name: t('welcome.start') }).boundingBox())!
  await page.mouse.click(start.x + start.width / 2, start.y + start.height / 2)
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
})

test('Escape closes the menu with no change and focus returns to the button', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: languageNow('uk') })
  await button.click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(button).toBeFocused()
})

test('the keyboard opens, moves through and chooses, and focus returns', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: languageNow('uk') })
  await button.focus()
  await page.keyboard.press('ArrowDown')
  await expect(languageRow(page, 'uk'), 'opens on the current language').toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(languageRow(page, 'en')).toBeFocused()
  await page.keyboard.press('End')
  await expect(languageRow(page, LOCALES[LOCALES.length - 1]!)).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(languageRow(page, 'en'), 'wraps to the first').toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(page.getByRole('button', { name: languageNow('en') })).toBeFocused()
})

test('Tab leaves the menu closed', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: languageNow('uk') }).click()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('menu')).toHaveCount(0)
})

test('screen readers get the button, the menu and the selected language', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: languageNow('uk') })
  await expect(button).toHaveAttribute('aria-haspopup', 'menu')
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await button.click()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('menu', { name: languageNow('uk') })).toBeVisible()
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveCount(1)
  await expect(languageRow(page, 'uk')).toBeFocused()
})

/** The Clock Time the Round's clock shows, read from its label in the language in use. */
async function shownTime(page: Page, lookup: typeof t) {
  const prefix = lookup('app.clockShows', { time: '' })
  const label = await page
    .locator('.clock-side')
    .getByRole('img', { name: startingWith(prefix) })
    .getAttribute('aria-label')
  return label!.replace(prefix, '')
}

test('changing language in a Round keeps its Task, progress and typed Answer', async ({ page }) => {
  await startRound(page, { game: 'setTime', mode: 'test', level: 5 })
  const pad = (digit: string) =>
    page.locator('.pad').getByRole('button', { name: digit, exact: true })
  const enter = async (lookup: typeof t) => {
    await page.getByRole('button', { name: lookup('round.hours') }).click()
    await pad('3').click()
    await page.getByRole('button', { name: lookup('round.minutes') }).click()
    await pad('1').click()
    await pad('0').click()
  }
  await enter(t)
  await page.getByRole('button', { name: t('round.submit') }).click()
  await expect(page.getByText(t('round.progress', { n: 2, total: 10 }))).toBeVisible()
  const time = await shownTime(page, t)
  await enter(t)

  await chooseLanguage(page, 'uk', 'en')

  await expect(page.getByText(tEn('round.progress', { n: 2, total: 10 }))).toBeVisible()
  expect(await shownTime(page, tEn)).toBe(time)
  await expect(page.getByRole('button', { name: tEn('round.submit') })).toBeEnabled()
})

test.describe('while the menu is open over a Set Time Round', () => {
  const hourBox = (page: Page) => page.getByRole('button', { name: t('round.hours'), exact: true })
  const progress = (page: Page, n: number) => page.getByText(t('round.progress', { n, total: 10 }))
  const pad = (page: Page, digit: string) =>
    page.locator('.pad').getByRole('button', { name: digit, exact: true })

  /** A Round with a whole Answer typed (hour 1), the menu open on it. */
  async function openOverAnswer(page: Page) {
    await startRound(page, { game: 'setTime', mode: 'test', level: 5 })
    await hourBox(page).click()
    await pad(page, '1').click()
    await page.getByRole('button', { name: t('round.minutes'), exact: true }).click()
    await pad(page, '1').click()
    await pad(page, '0').click()
    await expect(hourBox(page)).toHaveText('1')
    // The hour box selected, so a stray digit would make the hour 12.
    await hourBox(page).click()
    await page.getByRole('button', { name: languageNow('uk') }).click()
    await expect(languageRow(page, 'uk')).toBeFocused()
  }

  /** A click on the menu's own padding, above the first row. */
  const clickPadding = async (page: Page) => {
    const menu = page.getByRole('menu')
    const box = (await menu.boundingBox())!
    await menu.click({ position: { x: box.width / 2, y: 4 } })
  }

  test('a digit does not reach the Answer', async ({ page }) => {
    await openOverAnswer(page)
    await page.keyboard.press('2')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(hourBox(page)).toHaveText('1')
  })

  test('a click on the padding keeps focus in the menu, so its keys still work', async ({
    page,
  }) => {
    await openOverAnswer(page)
    await clickPadding(page)
    await expect(languageRow(page, 'uk')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(languageRow(page, 'de')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).toHaveCount(0)
  })

  test('Enter after a click on the padding does not submit the Answer', async ({ page }) => {
    await openOverAnswer(page)
    await clickPadding(page)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(progress(page, 1)).toBeVisible()
  })

  test('with focus lost from the menu, keys still cannot reach the Round', async ({ page }) => {
    await openOverAnswer(page)
    // Each key finds focus lost: the first one puts it back on the row.
    for (const key of ['2', 'Enter']) {
      await page.evaluate(() => (document.activeElement as HTMLElement).blur())
      await page.keyboard.press(key)
    }
    await expect(hourBox(page)).toHaveText('1')
    await expect(progress(page, 1)).toBeVisible()
    await expect(page.getByRole('menu')).toBeVisible()
    await expect(languageRow(page, 'uk')).toBeFocused()
  })

  test('browser Back closes it behind the Leave question, focus not on the button', async ({
    page,
  }) => {
    await openOverAnswer(page)
    await page.goBack()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(page.getByRole('button', { name: languageNow('uk') })).not.toBeFocused()
  })
})

test('browser Back to another screen closes the menu, focus not on the button', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await page.getByRole('button', { name: languageNow('uk') }).click()
  await page.goBack()
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(page.getByRole('button', { name: languageNow('uk') })).not.toBeFocused()
})

test('holding Enter on the button opens the menu and leaves it open', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: languageNow('uk') }).focus()
  await page.keyboard.down('Enter')
  await expect(languageRow(page, 'uk')).toBeFocused()
  // Checked after each repeat: a second one would reopen a menu the first had closed.
  for (let repeat = 0; repeat < 2; repeat++) {
    await page.keyboard.down('Enter')
    await expect(page.getByRole('menu')).toBeVisible()
    await expect(languageRow(page, 'uk')).toBeFocused()
  }
  await page.keyboard.up('Enter')
  await expect(page.getByRole('menu')).toBeVisible()
})

test('holding Enter on a row chooses once and does not open the menu again', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: languageNow('uk') })
  await button.focus()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await expect(languageRow(page, 'en')).toBeFocused()
  await page.keyboard.down('Enter')
  const chosen = page.getByRole('button', { name: languageNow('en') })
  await expect(chosen).toBeFocused()
  await page.keyboard.down('Enter')
  await page.keyboard.up('Enter')
  await expect(page.getByRole('menu')).toHaveCount(0)
})

/** The rows of the open menu, copied up to six: the list has fewer until its languages land. */
async function fillToSixRows(page: Page) {
  await page.getByRole('menu').evaluate((menu) => {
    while (menu.children.length < 6) menu.append(menu.children[0]!.cloneNode(true))
  })
  await expect(page.getByRole('menuitemradio')).toHaveCount(6)
}

test.describe('at 320 × 640 in a Round, next to Leave', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  test('six rows stay on the screen', async ({ page }) => {
    await startRound(page, { game: 'setTime', mode: 'test', level: 5 })
    await expect(page.getByRole('button', { name: t('header.leave') })).toBeVisible()
    await page.getByRole('button', { name: languageNow('uk') }).click()
    await fillToSixRows(page)
    for (const row of await page.getByRole('menuitemradio').all()) {
      const box = (await row.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(320)
      expect(box.y + box.height).toBeLessThanOrEqual(640)
    }
  })
})

for (const { width, height } of [
  { width: 360, height: 728 },
  { width: 360, height: 640 },
  { width: 320, height: 640 },
]) {
  test.describe(`the menu at ${width} × ${height}`, () => {
    test.use({ viewport: { width, height } })

    for (const { code, name } of LANGUAGES) {
      test(`in ${code}, every row is one line and the menu is on the screen`, async ({ page }) => {
        await page.addInitScript((locale) => {
          // The interface language, as the Player's choice would store it.
          Object.defineProperty(navigator, 'languages', { get: () => [locale] })
          Object.defineProperty(navigator, 'language', { get: () => locale })
        }, code)
        await page.goto('/')
        await page.getByRole('button', { name: languageNow(code) }).click()
        const menu = page.getByRole('menu')
        await expect(languageRow(page, code)).toContainText(name)

        const box = (await menu.boundingBox())!
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.y).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
        expect(box.y + box.height).toBeLessThanOrEqual(height)
        expect(await menu.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(0)

        for (const language of LANGUAGES) {
          const row = languageRow(page, language.code)
          const lines = await row.locator('.name').evaluate((el) => {
            const range = document.createRange()
            range.selectNodeContents(el)
            return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size
          })
          expect(lines, `${language.code} on one line`).toBe(1)
          const [rowBox, keyBox, nameBox] = await Promise.all([
            row.boundingBox(),
            row.locator('.key').boundingBox(),
            row.locator('.name').boundingBox(),
          ])
          expect(keyBox!.x + keyBox!.width).toBeLessThanOrEqual(nameBox!.x)
          expect(nameBox!.x + nameBox!.width).toBeLessThanOrEqual(rowBox!.x + rowBox!.width)
          const textFits = await row
            .locator('.name')
            .evaluate((el) => el.scrollWidth <= el.clientWidth)
          expect(textFits, `${language.code} not cut off`).toBe(true)
        }
        const tick = page.getByRole('menuitemradio', { checked: true }).locator('svg')
        const [tickBox, currentBox] = await Promise.all([
          tick.boundingBox(),
          languageRow(page, code).boundingBox(),
        ])
        expect(tickBox!.x + tickBox!.width).toBeLessThanOrEqual(currentBox!.x + currentBox!.width)
        expect(tickBox!.y).toBeGreaterThanOrEqual(currentBox!.y)
        expect(tickBox!.y + tickBox!.height).toBeLessThanOrEqual(currentBox!.y + currentBox!.height)
      })
    }
  })
}

const BARS = { top: 32, right: 0, bottom: 48, left: 0 }

for (const theme of ['light', 'dark'] as const) {
  for (const [layout, bars] of [
    ['Web App', { top: 0, right: 0, bottom: 0, left: 0 }],
    ['Android App', BARS],
  ] as const) {
    test.describe(`six rows at 320 × 640, ${theme}, ${layout} layout`, () => {
      test.use({ viewport: { width: 320, height: 640 } })

      test('every row is fully visible and clear of the system bars', async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme })
        await page.addInitScript((insets) => {
          const set = () => {
            for (const [side, px] of Object.entries(insets))
              document.documentElement.style.setProperty(`--safe-area-inset-${side}`, `${px}px`)
          }
          if (document.documentElement) set()
          else document.addEventListener('DOMContentLoaded', set)
        }, bars)
        await page.goto('/')
        await page.getByRole('button', { name: languageNow('uk') }).click()
        await fillToSixRows(page)

        const menu = page.getByRole('menu')
        const scroll = await menu.evaluate((el) => el.scrollHeight - el.clientHeight)
        expect(scroll, 'no scrolling inside the menu').toBeLessThanOrEqual(0)
        for (const row of await page.getByRole('menuitemradio').all()) {
          const box = (await row.boundingBox())!
          expect(box.height, 'a row is big enough to tap').toBeGreaterThanOrEqual(44)
          expect(box.x).toBeGreaterThanOrEqual(bars.left)
          expect(box.x + box.width).toBeLessThanOrEqual(320 - bars.right)
          expect(box.y).toBeGreaterThanOrEqual(bars.top)
          expect(box.y + box.height).toBeLessThanOrEqual(640 - bars.bottom)
        }
        const colors = await menu.evaluate((el) => {
          const style = getComputedStyle(el)
          const root = getComputedStyle(document.documentElement)
          const probe = document.createElement('div')
          probe.style.color = root.getPropertyValue('--pop-ink')
          probe.style.backgroundColor = root.getPropertyValue('--pop')
          document.body.append(probe)
          const token = getComputedStyle(probe)
          const result = {
            background: style.backgroundColor === token.backgroundColor,
            ink: style.color === token.color,
            theme: document.documentElement.dataset.theme,
          }
          probe.remove()
          return result
        })
        expect(colors).toEqual({ background: true, ink: true, theme })
      })
    })
  }
}
