import { expect, test, type Page } from '@playwright/test'

/** The Clock Time the clock shows, read from its label ("Годинник показує 7:45"). */
async function shownTime(page: Page) {
  const label = await page
    .getByRole('img', { name: /^Годинник показує/ })
    .getAttribute('aria-label')
  return label!.replace('Годинник показує ', '')
}

/** Taps H:MM on the on-screen pad, choosing each box by hand. */
async function tapTime(page: Page, time: string) {
  const [hour, minute] = time.split(':') as [string, string]
  const pad = (d: string) => page.locator('.pad').getByRole('button', { name: d, exact: true })
  await page.getByRole('button', { name: 'Години' }).click()
  for (const d of hour) await pad(d).click()
  await page.getByRole('button', { name: 'Хвилини' }).click()
  for (const d of minute) await pad(d).click()
}

test('a Set Time Test Round ends on a Summary that lists the wrong Answer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Як тебе звати?').fill('Оля')
  await page.getByRole('button', { name: 'Почати' }).click()
  await page.getByRole('radio', { name: /Який час\?/ }).check()
  await page.getByRole('radio', { name: /Перевірка/ }).check()
  await page.getByRole('radio', { name: /^5 хв/ }).check()
  await page.getByRole('button', { name: 'Грати' }).click()
  await expect(page.getByRole('heading', { name: 'Котра година?' })).toBeVisible()

  const submit = page.getByRole('button', { name: 'Перевірити' })

  // Task 1: an impossible hour is not an Answer; the error waits for a fix.
  const first = await shownTime(page)
  await expect(submit).toBeDisabled()
  await tapTime(page, '13:00')
  await submit.click()
  await expect(page.getByRole('alert')).toHaveText('Години — від 1 до 12')
  await expect(page.getByText('Завдання 1 з 10')).toBeVisible()

  // Then a deliberately wrong Answer, which still moves on in Test.
  await page.getByRole('button', { name: 'Години' }).click()
  await page.getByRole('button', { name: 'Стерти' }).click()
  await expect(page.getByRole('alert')).toBeHidden()
  await page.getByRole('button', { name: 'Хвилини' }).click()
  await page.getByRole('button', { name: 'Стерти' }).click()
  // Off the 5-minute step, so never the right Answer.
  const wrong = '12:01'
  await tapTime(page, wrong)
  await submit.click()
  await expect(page.getByText('Завдання 2 з 10')).toBeVisible()

  // Task 2 on the physical keyboard, the rest on the pad.
  const second = await shownTime(page)
  const [h, m] = second.split(':') as [string, string]
  await page.keyboard.type(h.padStart(2, '0') + m)
  await page.keyboard.press('Enter')
  await expect(page.getByText('Завдання 3 з 10')).toBeVisible()

  for (let n = 3; n < 10; n++) {
    await tapTime(page, await shownTime(page))
    await submit.click()
    await expect(page.getByText(`Завдання ${n + 1} з 10`)).toBeVisible()
  }
  await tapTime(page, await shownTime(page))
  await submit.click()

  await expect(page).toHaveURL(/\/summary$/)
  await expect(page.getByRole('heading', { name: '9 з 10 правильно' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Помилки' })).toContainText(
    `${first} — твоя відповідь ${wrong}`,
  )

  await page.getByRole('button', { name: 'Грати ще' }).click()
  await expect(page.getByText('Завдання 1 з 10')).toBeVisible()
})
