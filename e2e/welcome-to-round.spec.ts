import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'

test('a Player walks from Welcome through Settings to a Round', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()

  const start = page.getByRole('button', { name: t('welcome.start') })
  await expect(start).toBeDisabled()
  await page.getByLabel(t('welcome.nameLabel')).fill('  Оля ')
  await start.click()

  await expect(page).toHaveURL(/\/settings$/)
  await expect(
    page.getByRole('heading', { name: t('settings.greeting', { name: 'Оля' }) }),
  ).toBeVisible()

  await page.getByRole('radio', { name: startingWith(t('games.dragArrows.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.teach.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.5.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()

  await expect(page).toHaveURL(/\/round$/)
  await expect(
    page.getByRole('img', { name: t('round.progressLabel', { n: 1, total: 10 }) }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: t('round.setHands') })).toBeVisible()
  await expect(
    page.getByText(`${t('round.progress', { n: 1, total: 10 })} · ${t('modes.teach.name')}`),
  ).toBeVisible()

  await page.getByRole('button', { name: t('header.leave') }).click()
  const dialog = page.getByRole('dialog', { name: t('leave.title') })
  await dialog.getByRole('button', { name: t('leave.stay') }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/round$/)

  await page.goBack()
  await expect(dialog).toBeVisible()
  await expect(page).toHaveURL(/\/round$/)
  await dialog.getByRole('button', { name: t('leave.leave') }).click()
  await expect(page).toHaveURL(/\/settings$/)
})

test('Drag Numbers hides the Level and plays 12 numbers', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()

  await page.getByRole('radio', { name: startingWith(t('games.dragNumbers.name')) }).check()
  await expect(page.getByText(t('settings.level'))).toBeHidden()
  await page.getByRole('button', { name: t('settings.play') }).click()

  await expect(
    page.getByRole('img', { name: t('round.progressLabel', { n: 1, total: 12 }) }),
  ).toBeVisible()
})

test('the last name is pre-filled after a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await expect(page).toHaveURL(/\/settings$/)

  await page.goto('/')
  await expect(page.getByLabel(t('welcome.nameLabel'))).toHaveValue('Оля')
})

test('screens without what they need redirect', async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/$/)

  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.goto('/round')
  await expect(page).toHaveURL(/\/settings$/)
})

test('closing the page during a Round asks the browser to confirm', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page).toHaveURL(/\/round$/)

  const dialog = page.waitForEvent('dialog')
  await page.close({ runBeforeUnload: true })
  const shown = await dialog
  expect(shown.type()).toBe('beforeunload')
  await shown.dismiss()
})
