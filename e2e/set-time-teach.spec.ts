import { expect, test, type Page } from '@playwright/test'

/** The Clock Time the Round's clock shows, read from its label ("Годинник показує 7:45"). */
async function shownTime(page: Page) {
  const label = await page
    .locator('.clock-side')
    .getByRole('img', { name: /^Годинник показує/ })
    .getAttribute('aria-label')
  return label!.replace('Годинник показує ', '')
}

/** Types H:MM on the physical keyboard and presses Enter. */
async function typeTime(page: Page, time: string) {
  const [h, m] = time.split(':') as [string, string]
  await page.keyboard.type(h.padStart(2, '0') + m)
  await page.keyboard.press('Enter')
}

test('a Set Time Teach Round teaches a wrong Answer and lists it under Wrong', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Як тебе звати?').fill('Оля')
  await page.getByRole('button', { name: 'Почати' }).click()
  await page.getByRole('radio', { name: /Який час\?/ }).check()
  await page.getByRole('radio', { name: /Навчання/ }).check()
  await page.getByRole('radio', { name: /^5 хв/ }).check()
  await page.getByRole('button', { name: 'Грати' }).click()
  await expect(page.getByText('Завдання 1 з 10 · Навчання')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Постав правильну відповідь' })).toBeHidden()

  // A wrong Answer (off the 5-minute step) opens the popup with the correct time.
  const first = await shownTime(page)
  await typeTime(page, '12:01')
  const popup = page.getByRole('dialog', { name: 'Майже! Правильно так:' })
  await expect(popup).toBeVisible()
  await expect(popup.locator('.big-time')).toHaveText(first)
  await popup.getByRole('button', { name: 'Зрозуміло' }).click()
  await expect(popup).toBeHidden()

  // The Player's digits stay; the Hint appears; help fills the boxes; the Player submits.
  await expect(page.getByRole('button', { name: 'Години' })).toHaveText('12')
  await expect(page.getByText(`Підказка: ${first}`)).toBeVisible()
  await page.getByRole('button', { name: 'Постав правильну відповідь' }).click()
  await page.getByRole('button', { name: 'Перевірити' }).click()
  await expect(page.getByRole('status')).toHaveText('Правильно! Далі…')
  await expect(page.getByText('Завдання 2 з 10')).toBeVisible()

  for (let n = 2; n <= 10; n++) {
    await expect(page.getByText(`Завдання ${n} з 10`)).toBeVisible()
    await typeTime(page, await shownTime(page))
    await expect(page.getByRole('status')).toHaveText('Правильно! Далі…')
  }

  await expect(page).toHaveURL(/\/summary$/)
  await expect(page.getByRole('heading', { name: '9 з 10 правильно' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Помилки' })).toContainText(
    `${first} — твоя відповідь 12:01`,
  )
})
