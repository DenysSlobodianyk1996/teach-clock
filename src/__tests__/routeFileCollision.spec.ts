// @vitest-environment node
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import { webManifestFile } from '@/webManifest'

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
    // The static Privacy Page for Google Play, privacy/index.html (vite.config.ts).
    'privacy',
    // The service worker and its loader (vite-plugin-pwa), and a manifest per language.
    'sw.js',
    'registerSW.js',
    webManifestFile('uk'),
    webManifestFile('en'),
    // The bundled scripts, styles and fonts.
    'assets',
    ...readdirSync(publicDir),
  ]
}

/** Root files whose names carry a hash, so only their start is known. */
const HASHED_AT_SITE_ROOT = [/^workbox-/]

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
      // The first segment: `/assets/x` would sit inside the assets folder.
      const name = path.replace(/^\//, '').split('/')[0]!
      if (!name) return []
      return [name, `${name}.html`]
        .filter((file) => files.has(file) || HASHED_AT_SITE_ROOT.some((re) => re.test(file)))
        .map((file) => `${path} → ${file}`)
    })
    expect(clashes).toEqual([])
  })
})
