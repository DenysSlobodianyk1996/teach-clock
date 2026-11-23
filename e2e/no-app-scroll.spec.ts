/**
 * The app never scrolls as a whole (batch 25): the header stays on top, the Footer at the bottom,
 * and only <main> between them may scroll. On the phones below, no screen scrolls at all: an Oppo A
 * between its bars (360 × 728), a small phone (360 × 640) and a larger Display size (320 × 640).
 */
import { startingWith, t, tIn, LOCALES } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

type Lookup = typeof t
type Game = 'dragHours' | 'dragMinutes' | 'dragArrows' | 'setTime'
const GAMES: Game[] = ['dragHours', 'dragMinutes', 'dragArrows', 'setTime']

/** How far the page and <main> scroll; 0 when the screen fits. */
async function scrolls(page: Page) {
  return page.evaluate(() => {
    const main = document.querySelector('main')!
    return {
      page: document.scrollingElement!.scrollHeight - innerHeight,
      main: main.scrollHeight - main.clientHeight,
    }
  })
}

async function expectNoScroll(page: Page, what: string) {
  expect(await scrolls(page), what).toEqual({ page: 0, main: 0 })
}

async function toSettings(page: Page, lookup: Lookup) {
  await page.goto('/')
  await page.getByLabel(lookup('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: lookup('welcome.start') }).click()
  await expect(page.getByRole('button', { name: lookup('settings.play') })).toBeVisible()
}

for (const viewport of [
  { width: 360, height: 728 },
  { width: 360, height: 640 },
  { width: 320, height: 640 },
]) {
  for (const language of LOCALES) {
    const lookup: typeof t = (key, params) => tIn(language, key, params)

    test.describe(`a ${viewport.width} × ${viewport.height} phone in ${language}`, () => {
      test.use({ viewport })

      test.beforeEach(async ({ page }) => {
        await page.addInitScript(
          (value) => localStorage.setItem('teach-clock.locale', value),
          language,
        )
      })

      test('Welcome and Settings fit, the Footer on the screen', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByRole('button', { name: lookup('welcome.start') })).toBeVisible()
        await expectNoScroll(page, 'Welcome')
        await toSettings(page, lookup)
        await expectNoScroll(page, 'Settings')
        const footer = (await page.getByRole('contentinfo').boundingBox())!
        expect(footer.y + footer.height, 'the Footer on the screen').toBeLessThanOrEqual(
          viewport.height,
        )
      })

      test('Welcome with the name error showing fits', async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: lookup('welcome.start') }).click()
        await expect(page.getByRole('alert')).toHaveText(lookup('welcome.nameRequired'))
        await expectNoScroll(page, 'Welcome with the error')
      })

      for (const game of GAMES) {
        for (const mode of ['teach', 'test'] as const) {
          test(`a ${game} Round in ${mode} fits`, async ({ page }) => {
            await toSettings(page, lookup)
            await page
              .getByRole('radio', { name: startingWith(lookup(`games.${game}.name`)) })
              .check()
            await page
              .getByRole('radio', { name: startingWith(lookup(`modes.${mode}.name`)) })
              .check()
            await page.getByRole('button', { name: lookup('settings.play') }).click()
            await expect(page.locator('.round')).toBeVisible()
            await expectNoScroll(page, `${game} ${mode}`)
          })
        }
      }
    })
  }
}

test.describe('a laptop window', () => {
  test.use({ viewport: { width: 1550, height: 780 } })

  test('Welcome fits: its decoration adds no scroll to <main>', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: t('welcome.start') })).toBeVisible()
    await expectNoScroll(page, 'Welcome')
  })
})

test.describe('a long screen', () => {
  test.use({ viewport: { width: 360, height: 640 } })

  test('the Privacy Page scrolls inside <main>; the page and the header stay put', async ({
    page,
  }) => {
    await page.goto('/privacy-policy')
    await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
    const { page: pageScroll, main } = await scrolls(page)
    expect(pageScroll, 'the page never scrolls').toBe(0)
    expect(main, '<main> has more to show').toBeGreaterThan(0)
    await page.locator('main').evaluate((m) => m.scrollTo(0, m.scrollHeight))
    const header = (await page.getByRole('banner').boundingBox())!
    expect(header.y, 'the header stays on top').toBe(0)
  })

  test('a new screen opens at the top of <main>', async ({ page }) => {
    await page.goto('/privacy-policy')
    await page.locator('main').evaluate((m) => m.scrollTo(0, m.scrollHeight))
    await page.goBack().catch(() => {})
    await page.goto('/')
    await page.getByRole('link', { name: t('footer.privacy') }).click()
    await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
    expect(await page.locator('main').evaluate((m) => m.scrollTop)).toBe(0)
  })
})
