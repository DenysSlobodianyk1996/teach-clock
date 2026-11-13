import { t, startingWith } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

const CLOCK_SHOWS = t('app.clockShows', { time: '' })

/** The Clock Time the Round's clock shows, read from its label. */
async function shownTime(page: Page) {
  const label = await page
    .locator('.clock-side')
    .getByRole('img', { name: startingWith(CLOCK_SHOWS) })
    .getAttribute('aria-label')
  return label!.replace(CLOCK_SHOWS, '')
}

/** Types H:MM on the physical keyboard and presses Enter. */
async function typeTime(page: Page, time: string) {
  const [h, m] = time.split(':') as [string, string]
  await page.keyboard.type(h.padStart(2, '0') + m)
  await page.keyboard.press('Enter')
}

test('a Set Time Teach Round teaches a wrong Answer and lists it under Wrong', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.setTime.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.5.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(
    page.getByText(`${t('round.progress', { n: 1, total: 10 })} · ${t('modes.teach.name')}`),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeHidden()

  // A wrong Answer (off the 5-minute step) opens the popup with the correct time.
  const first = await shownTime(page)
  await typeTime(page, '12:01')
  const popup = page.getByRole('dialog', { name: t('teach.wrongTitle') })
  await expect(popup).toBeVisible()
  await expect(popup.locator('.big-time')).toHaveText(first)
  await expect(popup.getByRole('button', { name: t('teach.gotIt') })).toBeFocused()
  await popup.getByRole('button', { name: t('teach.gotIt') }).click()
  await expect(popup).toBeHidden()

  // Got it keeps the Player's digits and adds nothing under the clock.
  await expect(page.getByRole('button', { name: t('round.hours') })).toHaveText('12')
  await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeHidden()

  // A second wrong try opens the popup again; Set correct answer fills the boxes; the Player submits.
  await page.keyboard.press('Enter')
  await expect(popup).toBeVisible()
  await popup.getByRole('button', { name: t('teach.setCorrect') }).click()
  await expect(popup).toBeHidden()
  const [hour, minute] = first.split(':') as [string, string]
  await expect(page.getByRole('button', { name: t('round.hours') })).toHaveText(hour)
  await expect(page.getByRole('button', { name: t('round.minutes') })).toHaveText(minute)
  await page.getByRole('button', { name: t('round.submit') }).click()
  await expect(page.getByRole('status')).toHaveText(t('teach.right'))
  await expect(page.getByText(t('round.progress', { n: 2, total: 10 }))).toBeVisible()

  for (let n = 2; n <= 10; n++) {
    await expect(page.getByText(t('round.progress', { n: n, total: 10 }))).toBeVisible()
    await typeTime(page, await shownTime(page))
    await expect(page.getByRole('status')).toHaveText(t('teach.right'))
  }

  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.headline', { right: 9, total: 10 }) }),
  ).toBeVisible()
  await expect(
    page
      .getByRole('region', { name: t('summary.wrong') })
      .getByRole('listitem')
      .filter({
        hasText: t('summary.pair', {
          caption: t('summary.firstTry'),
          first: '12:01',
          answer: first,
        }),
      }),
  ).toBeVisible()
})

test.describe('on a desktop screen', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('the wrong-Answer popup shows its two buttons side by side', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
    await page.getByRole('button', { name: t('welcome.start') }).click()
    await page.getByRole('radio', { name: startingWith(t('games.setTime.name')) }).check()
    await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
    await page.getByRole('radio', { name: startingWith(t('levels.5.name')) }).check()
    await page.getByRole('button', { name: t('settings.play') }).click()
    await expect(page.getByRole('heading', { name: t('round.question') })).toBeVisible()
    await typeTime(page, '12:01')
    const popup = page.getByRole('dialog', { name: t('teach.wrongTitle') })
    const gotIt = (await popup.getByRole('button', { name: t('teach.gotIt') }).boundingBox())!
    const setCorrect = (await popup
      .getByRole('button', { name: t('teach.setCorrect') })
      .boundingBox())!
    expect(setCorrect.y).toBe(gotIt.y)
    expect(setCorrect.x).toBeGreaterThan(gotIt.x)
  })
})
