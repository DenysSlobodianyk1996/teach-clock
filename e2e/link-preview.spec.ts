import { spawn, type ChildProcess } from 'node:child_process'
import { createServer } from 'node:net'
import process from 'node:process'
import { expect, test } from '@playwright/test'
import { t, tEn } from './i18n.ts'

/**
 * The Web App as GitHub Pages serves it: a fresh build with GITHUB_PAGES, at /teach-clock/, with
 * the 404.html deploy.yml copies from index.html. Only that build has the link preview tags and the
 * prerendered Welcome (vite.config.ts, seoPlugin, prerenderedWelcomePlugin), so this spec makes and
 * serves its own, in its own folder, instead of the shared servers in playwright.config.ts.
 */
const port = Number(process.env.PW_PAGES_PORT ?? 4175)
const site = `http://localhost:${port}/teach-clock/`
let server: ChildProcess | undefined
/** The build's and the preview server's output, shown when either fails. */
let log = ''

/** Whether something already listens on the port: a stale server would answer for this build. */
function portTaken(): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = createServer()
    probe.once('error', () => resolve(true))
    probe.once('listening', () => probe.close(() => resolve(false)))
    probe.listen(port)
  })
}

test.beforeAll(async () => {
  test.setTimeout(180_000)
  if (await portTaken()) {
    throw new Error(`Port ${port} is taken: stop that server or set PW_PAGES_PORT to a free port.`)
  }
  const env = { ...process.env, GITHUB_PAGES: '1' }
  const outDir = 'dist-pages'
  const child = spawn(
    `npx vite build --outDir ${outDir} && cp ${outDir}/index.html ${outDir}/404.html && npx vite preview --outDir ${outDir} --port ${port} --strictPort`,
    { shell: true, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] },
  )
  server = child
  child.stdout?.on('data', (chunk) => (log += chunk))
  child.stderr?.on('data', (chunk) => (log += chunk))
  // Settles only if the build or the preview server stops before the site is up.
  const exited = new Promise<never>((_, reject) =>
    child.once('exit', (code, signal) =>
      reject(new Error(`The build or preview exited (${signal ?? code}) before serving:\n${log}`)),
    ),
  )
  const up = expect
    .poll(
      () =>
        fetch(site).then(
          (response) => response.ok,
          () => false,
        ),
      { timeout: 170_000 },
    )
    .toBe(true)
  await Promise.race([up, exited])
})

test.afterAll(() => {
  // The whole group: the shell and the preview server it started. It is gone if it failed.
  if (!server?.pid) return
  try {
    process.kill(-server.pid)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
  }
})

test('a link unfurler sees the preview image, with no JavaScript', async ({ request }) => {
  const html = await (await request.get(site)).text()
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
  expect(image).toBe('https://denysslobodianyk1996.github.io/teach-clock/og-image.png')
  expect(html).toContain(`<meta property="og:title" content="${tEn('app.name')}"`)

  // The same file, from this server instead of the public address.
  const served = await request.get(`${site}og-image.png`)
  expect(served.status()).toBe(200)
  expect(served.headers()['content-type']).toBe('image/png')

  const sitemap = await request.get(`${site}sitemap.xml`)
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain(
    '<loc>https://denysslobodianyk1996.github.io/teach-clock/privacy/</loc>',
  )
})

test.describe('the prerendered English Welcome', () => {
  /** The page as it is before the app's JavaScript runs: index.html's own scripts only. */
  async function withoutTheApp(page: import('@playwright/test').Page, path: string) {
    await page.route('**/assets/*.js', (route) => route.abort())
    await page.goto(`${site}${path}`)
    return page.locator('[data-prerendered]')
  }

  test('a crawler reads it at the root with no JavaScript, under one h1', async ({ request }) => {
    const html = await (await request.get(site)).text()
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(tEn('welcome.intro'))
  })

  test('shows at the root before the app loads, in English', async ({ page }) => {
    const welcome = await withoutTheApp(page, '')
    await expect(welcome).toBeVisible()
    await expect(welcome).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(tEn('welcome.title'))
  })

  for (const path of ['settings', 'privacy-policy', '404.html']) {
    test(`never flashes up where the app opens another screen: ${path}`, async ({ page }) => {
      const welcome = await withoutTheApp(page, path)
      await expect(welcome).toBeAttached()
      await expect(welcome).toBeHidden()
    })
  }

  test("gives way to the app's Welcome in the Player's language, one h1", async ({ page }) => {
    await page.goto(site)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(t('welcome.title'))
    await expect(page.locator('[data-prerendered]')).toHaveCount(0)
    await expect(page.locator('h1')).toHaveCount(1)
  })
})
