// @vitest-environment node
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'

/**
 * Every file the Web App build writes at the site root. GitHub Pages serves `name.html` for `/name`,
 * so an app route named like one of these opens the file on reload (F5) instead of the app.
 */
function filesAtSiteRoot(): string[] {
  const publicDir = fileURLToPath(new URL('../../public', import.meta.url))
  return [
    'index.html',
    // The deploy copies index.html here, so unknown addresses open the app (deploy.yml).
    '404.html',
    // The static Privacy Page for Google Play (vite.config.ts).
    'privacy.html',
    // The service worker and the manifest (vite-plugin-pwa).
    'sw.js',
    'manifest.webmanifest',
    ...readdirSync(publicDir),
  ]
}

describe('app routes and the files the build writes', () => {
  it('never share an address, so a reload always opens the app', () => {
    const files = new Set(filesAtSiteRoot())
    const paths = createAppRouter(createMemoryHistory())
      .getRoutes()
      .map((route) => route.path)
      // The catch-all matches everything by design; a file always wins over it.
      .filter((path) => !path.includes(':'))
    expect(paths.length).toBeGreaterThan(1)

    const clashes = paths.flatMap((path) => {
      const name = path.replace(/^\//, '')
      return [name, `${name}.html`]
        .filter((file) => name && files.has(file))
        .map((file) => `${path} → ${file}`)
    })
    expect(clashes).toEqual([])
  })
})
