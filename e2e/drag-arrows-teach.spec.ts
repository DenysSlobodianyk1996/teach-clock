import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'
import { drag, handsAt, HOUR_TIP, setHands } from './hands.ts'

test('a Drag Arrows Teach Round teaches a wrong Answer and lists it under Wrong', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragArrows.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('round.setHands') })).toBeVisible()
  await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeHidden()

  const submit = page.getByRole('button', { name: t('round.submit') })
  const target = () => page.locator('.target').innerText()
  const progress = (n: number) =>
    page.getByText(`${t('round.progress', { n, total: 10 })} · ${t('modes.teach.name')}`)

  // A wrong Answer: only the Hour Hand moves, to another hour. Never 12, where the hands
  // start, so the check that the hands stay can tell them apart from a reset.
  const first = await target()
  const wrongHour = (Number(first.split(':')[0]) % 11) + 1
  const wrong = `${wrongHour}:00`
  await drag(page, HOUR_TIP, 0, [15, wrongHour * 30])
  await submit.click()
  const popup = page.getByRole('dialog', { name: t('teach.wrongTitle') })
  await expect(popup.locator('.big-time')).toHaveText(first)
  await popup.getByRole('button', { name: t('teach.gotIt') }).click()
  await expect(popup).toBeHidden()

  // The hands stay where the Player left them; nothing is added under the clock.
  await expect(page.locator(handsAt(wrong))).toBeVisible()
  await expect(progress(1)).toBeVisible()
  await expect(page.getByRole('button', { name: t('teach.setCorrect') })).toBeHidden()

  // A second wrong try opens the popup again. "Set correct answer" turns the hands; the Player
  // still presses Submit.
  await submit.click()
  await popup.getByRole('button', { name: t('teach.setCorrect') }).click()
  await expect(popup).toBeHidden()
  await expect(page.locator(handsAt(first))).toBeVisible()
  await expect(progress(1)).toBeVisible()
  await submit.click()
  await expect(page.getByRole('status')).toHaveText(t('teach.right'))

  for (let n = 2; n <= 10; n++) {
    // Wait out the "Right!" pause: the next Task starts with the hands at 12:00.
    await expect(progress(n)).toBeVisible()
    await expect(page.locator(handsAt('12:00'))).toBeVisible()
    await setHands(page, await target())
    await submit.click()
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
        hasText: t('summary.pair', { caption: t('summary.firstTry'), first: wrong, answer: first }),
      }),
  ).toBeVisible()
})
