import { spawn, type ChildProcess } from 'node:child_process'
import process from 'node:process'
import { expect, test } from '@playwright/test'
import { tEn } from './i18n.ts'

/**
 * The Web App as GitHub Pages serves it: a fresh build with GITHUB_PAGES, at /teach-clock/. Only
 * that build has the link preview tags (vite.config.ts, seoPlugin), so this spec makes and serves
 * its own, in its own folder, instead of the shared servers in playwright.config.ts.
 */
const port = Number(process.env.PW_PAGES_PORT ?? 4175)
const site = `http://localhost:${port}/teach-clock/`
let server: ChildProcess | undefined

test.beforeAll(async () => {
  test.setTimeout(180_000)
  const env = { ...process.env, GITHUB_PAGES: '1' }
  const outDir = 'dist-pages'
  server = spawn(
    `npx vite build --outDir ${outDir} && npx vite preview --outDir ${outDir} --port ${port} --strictPort`,
    { shell: true, env, detached: true, stdio: 'ignore' },
  )
  await expect
    .poll(
      () =>
        fetch(site).then(
          (response) => response.ok,
          () => false,
        ),
      { timeout: 170_000 },
    )
    .toBe(true)
})

test.afterAll(() => {
  // The whole group: the shell and the preview server it started.
  if (server?.pid) process.kill(-server.pid)
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
