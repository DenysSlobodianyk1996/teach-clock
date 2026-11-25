// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import { build, type Rollup } from 'vite'
import { tEn } from '@/test/i18n'
import {
  PRERENDER_HIDDEN,
  PRERENDER_HIDDEN_CSS,
  prerenderedWelcomeScript,
} from '@/static/prerenderedWelcome'
import { prerenderedWelcomePlugin } from '../../vite.config.ts'

/** A page with the app's mount point, built with only the prerendered Welcome plugin. */
let root = ''

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'teach-clock-welcome-'))
  writeFileSync(
    join(root, 'index.html'),
    '<!doctype html><html lang="en"><head><title>x</title></head><body><div id="app"></div></body></html>',
  )
})

afterAll(() => rmSync(root, { recursive: true, force: true }))

/** The built index.html for the given environment. */
async function builtPage(env: Record<string, string>): Promise<Document> {
  const output = (await build({
    root,
    base: '/teach-clock/',
    configFile: false,
    logLevel: 'silent',
    build: { write: false },
    plugins: [prerenderedWelcomePlugin(env)],
  })) as Rollup.RollupOutput
  const page = output.output.find((file) => file.fileName === 'index.html')
  if (page?.type !== 'asset') throw new Error('no index.html')
  return new JSDOM(page.source as string).window.document
}

const text = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim()

describe('the prerendered Welcome in the GitHub Pages build', () => {
  let doc: Document
  let welcome: Element

  beforeAll(async () => {
    doc = await builtPage({ GITHUB_PAGES: '1' })
    welcome = doc.getElementById('app')!.firstElementChild!
  }, 120_000)

  it('is in English, whatever language the page gets', () => {
    expect(welcome.getAttribute('lang')).toBe('en')
    expect(welcome.hasAttribute('data-prerendered')).toBe(true)
  })

  it("names the game in the header and keeps room for the header's two round buttons", () => {
    expect(text(welcome.querySelector('header'))).toBe(tEn('app.name'))
    expect(welcome.querySelectorAll('header [aria-hidden="true"]:empty')).toHaveLength(2)
  })

  it('has exactly one h1, the Welcome heading', () => {
    expect([...doc.querySelectorAll('h1')].map(text)).toEqual([tEn('welcome.title')])
  })

  it('says what the game is, asks for the name and offers Start', () => {
    expect(text(welcome)).toContain(tEn('welcome.intro'))
    expect(text(welcome.querySelector('label[for="player-name"]'))).toContain(
      tEn('welcome.nameLabel'),
    )
    expect(text(welcome.querySelector('button[type="submit"]'))).toBe(tEn('welcome.start'))
  })

  it('draws the clock and has the Footer with the Privacy Page under the site', () => {
    expect(welcome.querySelector('svg.clock')).not.toBeNull()
    const privacy = welcome.querySelector('footer a')
    expect(text(privacy)).toBe(tEn('footer.privacy'))
    expect(privacy?.getAttribute('href')).toBe('/teach-clock/privacy-policy')
  })

  it("carries Welcome's own styles, and the rule and script that hide it off the root", () => {
    const styles = [...doc.head.querySelectorAll('style')].map((style) => style.textContent)
    expect(styles).toContain(PRERENDER_HIDDEN_CSS)
    expect(styles.some((css) => /\.welcome\[data-v-/.test(css ?? ''))).toBe(true)
    const scripts = [...doc.head.querySelectorAll('script:not([src])')].map((s) => s.textContent)
    expect(scripts).toContain(prerenderedWelcomeScript('/teach-clock/'))
  })
})

describe('the pre-paint script', () => {
  /** Whether the script hides the prerendered Welcome at `pathname`. */
  function hiddenAt(pathname: string): boolean {
    const { document } = new JSDOM('<!doctype html><html></html>').window
    new Function('location', 'document', prerenderedWelcomeScript('/teach-clock/'))(
      { pathname },
      document,
    )
    return document.documentElement.hasAttribute(PRERENDER_HIDDEN)
  }

  it('shows it at the site root, where the app opens Welcome', () => {
    expect(hiddenAt('/teach-clock/')).toBe(false)
    expect(hiddenAt('/teach-clock/index.html')).toBe(false)
    expect(hiddenAt('/teach-clock')).toBe(false)
  })

  it('hides it wherever the app opens another screen', () => {
    const elsewhere = [
      '/teach-clock/settings',
      '/teach-clock/round',
      '/teach-clock/summary',
      '/teach-clock/privacy-policy',
      '/teach-clock/404.html',
    ]
    expect(elsewhere.filter((path) => !hiddenAt(path))).toEqual([])
  })
})

for (const [name, env] of [
  ['the Android App', { GITHUB_PAGES: '1', VITE_TARGET: 'android' }],
  ['a build for elsewhere', {}],
] as const) {
  it(`is not in ${name}`, async () => {
    const doc = await builtPage(env)
    expect(doc.getElementById('app')!.innerHTML).toBe('')
    expect(doc.head.innerHTML).not.toContain(PRERENDER_HIDDEN)
  }, 60_000)
}
