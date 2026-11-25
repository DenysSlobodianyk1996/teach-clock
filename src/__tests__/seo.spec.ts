// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import { build, type Rollup } from 'vite'
import { SITE_URL } from '@/config'
import { tEn } from '@/test/i18n'
import { seoPlugin } from '../../vite.config.ts'

/** A page as small as the app's index.html head, built with only the link-preview plugin. */
let root = ''

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'teach-clock-seo-'))
  writeFileSync(
    join(root, 'index.html'),
    '<!doctype html><html lang="en"><head><title>x</title></head><body></body></html>',
  )
})

afterAll(() => rmSync(root, { recursive: true, force: true }))

/** What the build writes for the given environment, by file name. */
async function built(env: Record<string, string>) {
  const output = (await build({
    root,
    configFile: false,
    logLevel: 'silent',
    build: { write: false },
    plugins: [seoPlugin(env)],
  })) as Rollup.RollupOutput
  return new Map(output.output.map((file) => [file.fileName, file]))
}

function source(file: Rollup.OutputAsset | Rollup.OutputChunk | undefined): string | Uint8Array {
  if (!file) throw new Error('not built')
  return file.type === 'asset' ? file.source : file.code
}

describe('link previews and the sitemap', () => {
  describe('in the Web App on GitHub Pages', () => {
    let files: Awaited<ReturnType<typeof built>>
    let head: HTMLHeadElement
    const meta = (key: string) =>
      head.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute('content')

    beforeAll(async () => {
      files = await built({ GITHUB_PAGES: '1' })
      head = new JSDOM(source(files.get('index.html')) as string).window.document.head
    }, 60_000)

    it('names and describes the game in English for Open Graph and Twitter', () => {
      expect(meta('og:type')).toBe('website')
      expect(meta('og:site_name')).toBe(tEn('app.name'))
      expect(meta('og:title')).toBe(tEn('app.name'))
      expect(meta('og:description')).toBe(tEn('app.description'))
      expect(meta('og:locale')).toBe('en_US')
      expect(meta('twitter:card')).toBe('summary_large_image')
      expect(meta('twitter:title')).toBe(tEn('app.name'))
      expect(meta('twitter:description')).toBe(tEn('app.description'))
    })

    it('shows the feature graphic, at its size and with its alt text', () => {
      expect(meta('og:image')).toBe(
        'https://denysslobodianyk1996.github.io/teach-clock/og-image.png',
      )
      expect(meta('twitter:image')).toBe(meta('og:image'))
      expect(meta('og:image:width')).toBe('1024')
      expect(meta('og:image:height')).toBe('500')
      expect(meta('og:image:alt')).toBe(tEn('app.previewAlt'))
      expect(meta('twitter:image:alt')).toBe(tEn('app.previewAlt'))
    })

    it('points the page and its canonical link at the public address', () => {
      expect(SITE_URL).toBe('https://denysslobodianyk1996.github.io/teach-clock/')
      expect(meta('og:url')).toBe(SITE_URL)
      expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(SITE_URL)
    })

    it('emits the image and a sitemap of the game and its Privacy Page', () => {
      const image = Buffer.from(source(files.get('og-image.png')))
      // The English store feature graphic, as is (decision 1).
      expect(image.equals(readFileSync('docs/store/en/feature-graphic.png'))).toBe(true)

      const sitemap = new JSDOM(source(files.get('sitemap.xml')) as string, {
        contentType: 'application/xml',
      }).window.document
      const urls = [...sitemap.querySelectorAll('url > loc')].map((loc) => loc.textContent)
      expect(urls).toEqual([SITE_URL, `${SITE_URL}privacy/`])
    })
  })

  for (const [name, env] of [
    ['the Android App', { GITHUB_PAGES: '1', VITE_TARGET: 'android' }],
    ['a build for elsewhere', {}],
  ] as const) {
    it(`adds nothing in ${name}`, async () => {
      const files = await built(env)
      const html = source(files.get('index.html')) as string
      expect(html).not.toMatch(/og:|twitter:|canonical/)
      expect(files.has('og-image.png')).toBe(false)
      expect(files.has('sitemap.xml')).toBe(false)
    }, 60_000)
  }
})
