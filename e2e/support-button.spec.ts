/**
 * The Support Button in the Footer. It only shows when the build has an https:// VITE_SUPPORT_URL,
 * and the default test server has none, so this spec starts its own dev server with a test link.
 */
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createServer, type ViteDevServer } from 'vite'
import { expect, test } from '@playwright/test'
import { t } from './i18n.ts'

const SUPPORT_URL = 'https://example.com/support'

let server: ViteDevServer
let baseURL: string

test.beforeAll(async () => {
  // Vite takes VITE_* values from process.env; this worker never serves anything else.
  process.env.VITE_SUPPORT_URL = SUPPORT_URL
  server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    // Any free port, so parallel workers and checkouts never clash.
    server: { port: 0, strictPort: false },
    logLevel: 'error',
  })
  await server.listen()
  baseURL = server.resolvedUrls!.local[0]!
})

test.afterAll(async () => {
  await server?.close()
  delete process.env.VITE_SUPPORT_URL
})

test('the Support Button is in the Footer on Welcome, and a full hold opens the support link on release', async ({
  page,
}) => {
  // Keep the test off the real internet: the support page is a stub.
  await page
    .context()
    .route(SUPPORT_URL, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<p>support</p>' }),
    )
  // The hold is timed on a fake clock, so the test never waits in real time.
  await page.clock.install()
  await page.goto(baseURL)

  const button = page.getByRole('contentinfo').getByRole('button', { name: t('support.button') })
  await expect(button).toBeVisible()
  await expect(page.getByRole('contentinfo').getByText(t('support.hold'))).toBeVisible()

  await button.hover()
  // A short press opens nothing.
  await page.mouse.down()
  await page.clock.runFor(500)
  await page.mouse.up()
  // A full 2 s hold opens the link on release (the release is the user gesture browsers need).
  await page.mouse.down()
  await page.clock.runFor(2000)
  expect(page.context().pages()).toHaveLength(1)
  const [supportPage] = await Promise.all([page.context().waitForEvent('page'), page.mouse.up()])
  await expect(supportPage).toHaveURL(SUPPORT_URL)
})
