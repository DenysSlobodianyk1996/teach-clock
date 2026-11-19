/**
 * The Android App on an old system WebView (batch 22): a Samsung S8 showed no border on the chosen
 * Settings cards and no clock in a Round, because those rules used CSS its WebView lacked (`:has()`,
 * container units, `svh`/`dvh`). Runs only in the `old-webview` project, on an old Chromium given in
 * OLD_CHROMIUM (docs/android-checks.md says how to get one).
 *
 * Playwright's locators call `Element.checkVisibility()` (Chrome 105+), so this spec drives the
 * page with plain DOM calls in `page.evaluate` and measures with `getBoundingClientRect`.
 */
import { t } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

/** Waits until `selector` matches an element (polled in the page, not through a locator). */
async function waitFor(page: Page, selector: string) {
  await page.waitForFunction((s) => !!document.querySelector(s), selector)
}

/** Clicks the button whose text starts with `text`, or picks the card with that title. */
async function tap(page: Page, text: string) {
  await page.evaluate((text) => {
    const card = [...document.querySelectorAll('.choice')].find(
      (el) => el.querySelector('b')!.textContent!.trim() === text,
    )
    const button = [...document.querySelectorAll('button')].find((el) =>
      el.textContent!.trim().startsWith(text),
    )
    const target = (card?.querySelector('input') ?? button) as HTMLElement | undefined
    if (!target) throw new Error(`Nothing to tap: "${text}"`)
    target.click()
  }, text)
}

/** Fills the Welcome name and presses Start. */
async function start(page: Page) {
  await page.goto('/')
  await waitFor(page, 'input')
  await page.evaluate(() => {
    const input = document.querySelector('input') as HTMLInputElement
    input.value = 'Оля'
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await tap(page, t('welcome.start'))
  await waitFor(page, '.choice')
}

/** Width of the first element matching `selector`, once it is in the page. */
async function width(page: Page, selector: string) {
  await waitFor(page, selector)
  return page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().width, selector)
}

/** The top border colour of each card, by title, and the theme's accent. */
async function borders(page: Page, titles: string[]) {
  return page.evaluate((titles) => {
    const probe = document.createElement('div')
    probe.style.color = 'var(--accent)'
    document.body.append(probe)
    const accent = getComputedStyle(probe).color
    probe.remove()
    const cards = [...document.querySelectorAll('.choice')]
    const colors = titles.map((title) => {
      const card = cards.find((c) => c.querySelector('b')!.textContent!.trim() === title)!
      return getComputedStyle(card).borderTopColor
    })
    return { accent, colors }
  }, titles)
}

test('the chosen Settings cards have the accent border', async ({ page }) => {
  await start(page)
  await tap(page, t('games.setTime.name'))
  await tap(page, t('levels.5.name'))
  const chosen = [t('games.setTime.name'), t('modes.teach.name'), t('levels.5.name')]
  const { accent, colors } = await borders(page, [...chosen, t('games.dragArrows.name')])
  expect(colors).toEqual([accent, accent, accent, expect.not.stringMatching(accent)])
})

test('the Welcome clock shows', async ({ page }) => {
  await page.goto('/')
  expect(await width(page, '.welcome .clock')).toBeGreaterThanOrEqual(120)
})

test('a Set Time Round shows its clock', async ({ page }) => {
  await start(page)
  await tap(page, t('games.setTime.name'))
  await tap(page, t('levels.5.name'))
  await tap(page, t('settings.play'))
  expect(await width(page, '.clock-side .clock')).toBeGreaterThanOrEqual(150)
})

test('a Drag Hours Round shows its face', async ({ page }) => {
  await start(page)
  await tap(page, t('games.dragHours.name'))
  await tap(page, t('settings.play'))
  expect(await width(page, '.number-face')).toBeGreaterThanOrEqual(190)
})
