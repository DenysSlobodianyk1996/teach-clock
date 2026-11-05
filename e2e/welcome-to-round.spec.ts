import { expect, test } from '@playwright/test'

test('a Player walks from Welcome through Settings to a Round', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Привіт! Навчимося читати годинник' }),
  ).toBeVisible()

  const start = page.getByRole('button', { name: 'Почати' })
  await expect(start).toBeDisabled()
  await page.getByLabel('Як тебе звати?').fill('  Оля ')
  await start.click()

  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByRole('heading', { name: 'Оля, у що граємо?' })).toBeVisible()

  await page.getByRole('radio', { name: /Постав стрілки/ }).check()
  await page.getByRole('radio', { name: /Перевірка/ }).check()
  await page.getByRole('radio', { name: /^5 хв/ }).check()
  await page.getByRole('button', { name: 'Грати' }).click()

  await expect(page).toHaveURL(/\/round$/)
  await expect(page.getByRole('img', { name: 'Прогрес: завдання 1 з 10' })).toBeVisible()
  await expect(page.getByTestId('play-area')).toContainText('Постав стрілки · Перевірка · 5 хв')

  await page.getByRole('button', { name: 'Вийти' }).click()
  await expect(page).toHaveURL(/\/settings$/)
})

test('Drag Numbers hides the Level and plays 12 numbers', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Як тебе звати?').fill('Оля')
  await page.getByRole('button', { name: 'Почати' }).click()

  await page.getByRole('radio', { name: /Розстав числа/ }).check()
  await expect(page.getByText('Крок хвилин')).toBeHidden()
  await page.getByRole('button', { name: 'Грати' }).click()

  await expect(page.getByRole('img', { name: 'Прогрес: завдання 1 з 12' })).toBeVisible()
})

test('the last name is pre-filled after a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Як тебе звати?').fill('Оля')
  await page.getByRole('button', { name: 'Почати' }).click()
  await expect(page).toHaveURL(/\/settings$/)

  await page.goto('/')
  await expect(page.getByLabel('Як тебе звати?')).toHaveValue('Оля')
})

test('screens without what they need redirect', async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/$/)

  await page.getByLabel('Як тебе звати?').fill('Оля')
  await page.getByRole('button', { name: 'Почати' }).click()
  await page.goto('/round')
  await expect(page).toHaveURL(/\/settings$/)
})

test('closing the page during a Round asks the browser to confirm', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Як тебе звати?').fill('Оля')
  await page.getByRole('button', { name: 'Почати' }).click()
  await page.getByRole('button', { name: 'Грати' }).click()
  await expect(page).toHaveURL(/\/round$/)

  const dialog = page.waitForEvent('dialog')
  await page.close({ runBeforeUnload: true })
  const shown = await dialog
  expect(shown.type()).toBe('beforeunload')
  await shown.dismiss()
})
