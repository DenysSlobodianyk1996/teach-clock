import { t, tEn, startingWith } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

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

test('the Privacy Page opens with no internet after the first visit', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  await page.evaluate(() => navigator.serviceWorker.ready)

  await context.setOffline(true)
  await page.goto('/privacy-policy')
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()

  // The static copy for Google Play is in the offline copy too.
  await page.goto('/privacy.html')
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()

  // The old in-app address (before batch 12) gets no redirect: like GitHub Pages, the service
  // worker answers it with privacy.html, never the app (which would send it to Welcome).
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { level: 1, name: t('privacy.title') })).toBeVisible()
  await expect(page.locator('article[lang="en"]')).toBeVisible()
})

/** The manifest the page links, fetched through the page (and so its service worker). */
async function linkedManifest(page: Page) {
  return page.evaluate(async () => {
    const href = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')!.href
    return (await fetch(href)).json()
  })
}

/** A browser whose language list is `locale`, and the language the app starts in. */
const browsers = [
  { locale: 'uk-UA', lang: 'uk', lookup: t },
  { locale: 'en-US', lang: 'en', lookup: tEn },
] as const

for (const { locale, lang, lookup } of browsers) {
  test.describe(`in a ${locale} browser`, () => {
    test.use({ locale })

    test('the app installs with the full Game Name and its own icons, offline too', async ({
      page,
      context,
      request,
    }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: lookup('welcome.title') })).toBeVisible()
      const manifest = await linkedManifest(page)
      expect(manifest).toMatchObject({
        name: lookup('app.name'),
        short_name: lookup('app.name'),
        lang,
        display: 'standalone',
        start_url: '/',
      })
      const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes)
      expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']))
      for (const icon of manifest.icons) {
        expect((await request.get(icon.src)).ok()).toBe(true)
      }

      // Both manifests are in the offline copy, so installing works with no internet.
      await page.evaluate(() => navigator.serviceWorker.ready)
      await context.setOffline(true)
      await page.reload()
      expect(await linkedManifest(page)).toMatchObject({ name: lookup('app.name'), lang })
    })
  })
}

test('the installed name follows a УК/EN tap', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  expect(await linkedManifest(page)).toMatchObject({ name: t('app.name'), lang: 'uk' })

  await page
    .getByRole('group', { name: t('header.language') })
    .getByRole('button', { name: t('languages.en') })
    .click()
  await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
  expect(await linkedManifest(page)).toMatchObject({ name: tEn('app.name'), lang: 'en' })

  await page
    .getByRole('group', { name: tEn('header.language') })
    .getByRole('button', { name: tEn('languages.uk') })
    .click()
  await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
  expect(await linkedManifest(page)).toMatchObject({ name: t('app.name'), lang: 'uk' })
})

test.describe('before the app loads', () => {
  // No service worker, so the app's script can be held back and only index.html runs.
  test.use({ serviceWorkers: 'block' })

  test('a saved language picks the manifest', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('teach-clock.locale', 'en'))
    await page.route(/\/assets\/index-.*\.js$/, (route) => route.abort())
    await page.goto('/')
    expect(await linkedManifest(page)).toMatchObject({ name: tEn('app.name'), lang: 'en' })
  })
})

test.describe('an installed Web App', () => {
  // Opened from the home screen: the page matches `(display-mode: standalone)`.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const device = window.matchMedia.bind(window)
      window.matchMedia = (query: string) =>
        query.includes('display-mode: standalone')
          ? ({ ...device(query), media: query, matches: true } as MediaQueryList)
          : device(query)
    })
  })

  test('links no manifest, so a УК/EN tap never renames it', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: t('welcome.title') })).toBeVisible()
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(0)

    await page
      .getByRole('group', { name: t('header.language') })
      .getByRole('button', { name: t('languages.en') })
      .click()
    await expect(page.getByRole('heading', { name: tEn('welcome.title') })).toBeVisible()
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(0)
  })
})
