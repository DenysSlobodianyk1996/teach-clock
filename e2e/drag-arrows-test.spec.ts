import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { drag, handsAt, HOUR_TIP, setHands } from './hands.ts'

test('a Drag Arrows Test Round ends on a Summary that lists the wrong Answer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragArrows.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('round.setHands') })).toBeVisible()

  const submit = page.getByRole('button', { name: t('round.submit') })
  const target = () => page.locator('.target').innerText()

  // Task 1: only the Hour Hand moves, grabbed where it lies under the Minute Hand at 12:00.
  await expect(page.locator(handsAt('12:00'))).toBeVisible()
  const first = await target()
  // The hour after the target's, on the hour: never the target.
  const wrongHour = (Number(first.split(':')[0]) % 12) + 1
  const wrong = `${wrongHour}:00`
  await drag(page, HOUR_TIP, 0, [15, wrongHour * 30])
  await expect(page.locator(handsAt(wrong))).toBeVisible()
  await submit.click()
  await expect(page.getByText(t('round.progress', { n: 2, total: 10 }))).toBeVisible()
  await expect(page.locator(handsAt('12:00'))).toBeVisible()

  /** Sets the hands to the target and checks the clock shows it before submitting. */
  async function answerRight() {
    const time = await target()
    await setHands(page, time)
    await expect(page.locator(handsAt(time))).toBeVisible()
    await submit.click()
  }

  for (let n = 2; n < 10; n++) {
    await answerRight()
    await expect(page.getByText(t('round.progress', { n: n + 1, total: 10 }))).toBeVisible()
  }
  await answerRight()

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
})
