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

/** Taps H:MM on the on-screen pad, choosing each box by hand. */
async function tapTime(page: Page, time: string) {
  const [hour, minute] = time.split(':') as [string, string]
  const pad = (d: string) => page.locator('.pad').getByRole('button', { name: d, exact: true })
  await page.getByRole('button', { name: t('round.hours') }).click()
  for (const d of hour) await pad(d).click()
  await page.getByRole('button', { name: t('round.minutes') }).click()
  for (const d of minute) await pad(d).click()
}

test('a Set Time Test Round ends on a Summary that lists the wrong Answer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.setTime.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.5.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('round.question') })).toBeVisible()

  const submit = page.getByRole('button', { name: t('round.submit') })

  // Task 1: an impossible hour is not an Answer; the error waits for a fix.
  const first = await shownTime(page)
  await expect(submit).toBeDisabled()
  await tapTime(page, '13:00')
  await submit.click()
  await expect(page.getByRole('alert')).toHaveText(t('round.errors.hour'))
  await expect(page.getByText(t('round.progress', { n: 1, total: 10 }))).toBeVisible()

  // Then a deliberately wrong Answer, which still moves on in Test.
  await page.getByRole('button', { name: t('round.hours') }).click()
  await page.getByRole('button', { name: t('round.clear') }).click()
  await expect(page.getByRole('alert')).toBeHidden()
  await page.getByRole('button', { name: t('round.minutes') }).click()
  await page.getByRole('button', { name: t('round.clear') }).click()
  // Off the 5-minute step, so never the right Answer.
  const wrong = '12:01'
  await tapTime(page, wrong)
  await submit.click()
  await expect(page.getByText(t('round.progress', { n: 2, total: 10 }))).toBeVisible()

  // Task 2 on the physical keyboard, the rest on the pad.
  const second = await shownTime(page)
  const [h, m] = second.split(':') as [string, string]
  await page.keyboard.type(h.padStart(2, '0') + m)
  await page.keyboard.press('Enter')
  await expect(page.getByText(t('round.progress', { n: 3, total: 10 }))).toBeVisible()

  for (let n = 3; n < 10; n++) {
    await tapTime(page, await shownTime(page))
    await submit.click()
    await expect(page.getByText(t('round.progress', { n: n + 1, total: 10 }))).toBeVisible()
  }
  await tapTime(page, await shownTime(page))
  await submit.click()

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
          caption: t('summary.yourAnswer'),
          first: wrong,
          answer: first,
        }),
      }),
  ).toBeVisible()

  await page.getByRole('button', { name: t('summary.playAgain') }).click()
  await expect(page.getByText(t('round.progress', { n: 1, total: 10 }))).toBeVisible()
})

test('one digit that no second digit could follow completes a box (#87)', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.setTime.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()

  const pad = (d: string) => page.locator('.pad').getByRole('button', { name: d, exact: true })
  const hours = page.getByRole('button', { name: t('round.hours') })
  const minutes = page.getByRole('button', { name: t('round.minutes') })
  const clearHours = async () => {
    await hours.click()
    await pad(t('round.clear')).click()
  }

  // 8 → the hours show 8 and the minutes are selected.
  await pad('8').click()
  await expect(hours).toHaveText('8')
  await expect(minutes).toHaveAttribute('aria-pressed', 'true')

  // 1 waits for a second digit; 1 again → 11, then the minutes.
  await clearHours()
  await pad('1').click()
  await expect(hours).toHaveAttribute('aria-pressed', 'true')
  await pad('1').click()
  await expect(hours).toHaveText('11')
  await expect(minutes).toHaveAttribute('aria-pressed', 'true')

  // 0 8 → 08, then the minutes.
  await clearHours()
  await pad('0').click()
  await pad('8').click()
  await expect(hours).toHaveText('08')
  await expect(minutes).toHaveAttribute('aria-pressed', 'true')

  // In the minutes, 7 → 07 and a further digit changes nothing; 3 waits for a second digit.
  await pad('7').click()
  await expect(minutes).toHaveText('07')
  await pad('4').click()
  await expect(minutes).toHaveText('07')
  await pad(t('round.clear')).click()
  await pad('3').click()
  await expect(minutes).toHaveText('3')
  await expect(minutes).toHaveAttribute('aria-pressed', 'true')
  // Nothing submitted on its own: still the first Task.
  await expect(page.getByText(t('round.progress', { n: 1, total: 10 }))).toBeVisible()
})
