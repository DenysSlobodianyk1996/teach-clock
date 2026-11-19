/**
 * The Android App draws edge to edge: the status bar, a camera cutout and the navigation bar lie on
 * top of the page. Capacitor puts their sizes in `--safe-area-inset-*` on <html> (SystemBars,
 * `insetsHandling: 'css'`); these tests set the same variables, so the browser shows what a phone
 * with system bars shows. Every control stays inside the safe area, and every screen fits the safe
 * area of a 360 × 720 phone with nothing to scroll; Welcome, Settings and the drag Games also fit
 * 360 × 640 with the bars
 * (batch 21, ticket 01). e2e/fits-small-phone.spec.ts keeps 360 × 640 without bars.
 */
import { startingWith, t } from './i18n.ts'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { startRound } from './round.ts'

type Insets = { top: number; right: number; bottom: number; left: number }

/** A status bar with a camera cutout on top and a three-button navigation bar below. */
const UPRIGHT: Insets = { top: 32, right: 0, bottom: 48, left: 0 }
/** The same phone sideways: the cutout on the left, the navigation bar on the right. */
const SIDEWAYS: Insets = { top: 24, right: 48, bottom: 0, left: 32 }

async function withSystemBars(page: Page, insets: Insets) {
  await page.addInitScript((i) => {
    const set = () => {
      for (const [side, px] of Object.entries(i))
        document.documentElement.style.setProperty(`--safe-area-inset-${side}`, `${px}px`)
    }
    if (document.documentElement) set()
    else document.addEventListener('DOMContentLoaded', set)
  }, insets)
}

/** Every box lies inside the safe area of the screen as it is scrolled now. */
async function expectInSafeArea(page: Page, locators: Locator[], insets: Insets, what: string) {
  const { width, height } = page.viewportSize()!
  for (const locator of locators) {
    for (const one of await locator.all()) {
      if (!(await one.isVisible())) continue
      const box = (await one.boundingBox())!
      const name = `${what}: ${await one.evaluate((e) => e.getAttribute('aria-label') ?? e.textContent?.trim())}`
      expect(box.y, `${name} below the status bar`).toBeGreaterThanOrEqual(insets.top)
      expect(box.x, `${name} clear of the left`).toBeGreaterThanOrEqual(insets.left)
      expect(box.x + box.width, `${name} clear of the right`).toBeLessThanOrEqual(
        width - insets.right,
      )
      expect(box.y + box.height, `${name} above the navigation bar`).toBeLessThanOrEqual(
        height - insets.bottom,
      )
    }
  }
}

const headerControls = (page: Page) => [
  page.locator('header .brand-mark'),
  page.locator('header').getByRole('button'),
  page.locator('header').getByRole('link'),
  page.locator('header').getByRole('radio'),
]

/** Scrolls to the end of the page and checks the Footer's links clear the navigation bar. */
async function expectFooterClear(page: Page, insets: Insets) {
  await page.evaluate(() => scrollTo(0, document.scrollingElement!.scrollHeight))
  await expectInSafeArea(page, [page.getByRole('contentinfo').getByRole('link')], insets, 'Footer')
}

/** The page is no taller than the screen: the safe area holds it all, the .app's padding the rest. */
async function expectNothingToScroll(page: Page) {
  expect(
    await page.evaluate(() => document.scrollingElement!.scrollHeight - innerHeight),
    'nothing to scroll',
  ).toBeLessThanOrEqual(0)
}

const levelFor = (game: string) => (game === 'setTime' || game === 'dragArrows' ? 15 : undefined)

async function toSettings(page: Page) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
}

test.describe('an upright 360 × 640 phone with system bars', () => {
  test.use({ viewport: { width: 360, height: 640 } })

  test.beforeEach(({ page }) => withSystemBars(page, UPRIGHT))

  test('Welcome: the header below the status bar, Start in the safe area unscrolled, the Footer clear', async ({
    page,
  }) => {
    await page.goto('/')
    await expectInSafeArea(page, headerControls(page), UPRIGHT, 'header')
    await expectInSafeArea(
      page,
      [page.getByRole('button', { name: t('welcome.start') })],
      UPRIGHT,
      'Welcome',
    )
    expect(await page.evaluate(() => scrollY)).toBe(0)
    await expectFooterClear(page, UPRIGHT)
  })

  test('Welcome: the Info Popup lies inside the safe area', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: t('info.more') }).click()
    await expectInSafeArea(page, [page.getByRole('dialog')], UPRIGHT, 'Info Popup')
  })

  test('Settings: the header, Back and Play in the safe area unscrolled, the Footer clear', async ({
    page,
  }) => {
    await toSettings(page)
    await page.getByRole('radio', { name: startingWith(t('games.setTime.name')) }).check()
    await page.evaluate(() => scrollTo(0, 0))
    await expectInSafeArea(page, headerControls(page), UPRIGHT, 'header')
    await expectInSafeArea(
      page,
      [
        page.getByRole('button', { name: t('settings.back') }),
        page.getByRole('button', { name: t('settings.play') }),
      ],
      UPRIGHT,
      'Settings',
    )
    await expectFooterClear(page, UPRIGHT)
  })

  // Set Time and Drag Arrows keep a 150 px clock and 48 px keys, so on this screen they may scroll a
  // little; they fit a 360 × 720 screen with bars (below).
  for (const game of ['dragHours', 'dragMinutes'] as const) {
    test(`${game}: the header below the status bar, nothing to scroll`, async ({ page }) => {
      await startRound(page, { game, mode: 'test', level: levelFor(game) })
      await expectInSafeArea(page, headerControls(page), UPRIGHT, 'header')
      await expectNothingToScroll(page)
    })
  }

  test('the Privacy Page: its language links below the status bar', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: t('footer.privacy') })
      .click()
    await expect(page).toHaveURL(/\/privacy\/index\.html$/)
    await expectInSafeArea(page, [page.locator('nav a').first()], UPRIGHT, 'language links')
  })
})

test.describe('an upright 360 × 720 phone with system bars', () => {
  test.use({ viewport: { width: 360, height: 720 } })

  test.beforeEach(({ page }) => withSystemBars(page, UPRIGHT))

  for (const game of ['setTime', 'dragArrows', 'dragHours', 'dragMinutes'] as const) {
    test(`${game}: the header and the Round in the safe area, nothing to scroll`, async ({
      page,
    }) => {
      await startRound(page, { game, mode: 'test', level: levelFor(game) })
      await expectInSafeArea(page, headerControls(page), UPRIGHT, 'header')
      await expectNothingToScroll(page)
      if (game === 'setTime' || game === 'dragArrows')
        await expectInSafeArea(
          page,
          [page.getByRole('button', { name: t('round.submit') })],
          UPRIGHT,
          'Round',
        )
    })
  }
})

test.describe('a sideways 640 × 360 phone with system bars', () => {
  test.use({ viewport: { width: 640, height: 360 } })

  test.beforeEach(({ page }) => withSystemBars(page, SIDEWAYS))

  test('Welcome and Settings: nothing under the cutout or the navigation bar', async ({ page }) => {
    await page.goto('/')
    await expectInSafeArea(page, headerControls(page), SIDEWAYS, 'header')
    await expectFooterClear(page, SIDEWAYS)
    await page.evaluate(() => scrollTo(0, 0))
    await toSettings(page)
    await page.evaluate(() => scrollTo(0, 0))
    await expectInSafeArea(page, headerControls(page), SIDEWAYS, 'header')
    await expectFooterClear(page, SIDEWAYS)
  })
})
