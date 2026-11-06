import { t, startingWith } from './i18n.ts'
import { expect, test } from '@playwright/test'

test('after the first visit the whole app works with no internet', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  // The first visit installs the service worker, which keeps a copy of the whole app.
  await page.evaluate(() => navigator.serviceWorker.ready)

  await context.setOffline(true)
  await page.reload()

  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()

  // A screen opened straight from its address also comes from the copy.
  await page.goto('/settings')
  await page.getByRole('radio', { name: startingWith(t('games.setTime.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(
    page.getByRole('img', { name: t('round.progressLabel', { n: 1, total: 10 }) }),
  ).toBeVisible()

  // The Nunito font is part of the copy, not a fallback.
  const fonts = await page.evaluate(async () =>
    (await document.fonts.load('900 20px Nunito')).map((font) => font.family),
  )
  expect(fonts).toContain('Nunito')
})

test('the app can be installed as "Teach Clock" with its own icons', async ({ page, request }) => {
  await page.goto('/')
  const href = await page.locator('link[rel="manifest"]').getAttribute('href')
  const manifest = await (await request.get(href!)).json()
  expect(manifest).toMatchObject({ name: 'Teach Clock', display: 'standalone', start_url: '/' })
  const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes)
  expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']))
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).ok()).toBe(true)
  }
})
