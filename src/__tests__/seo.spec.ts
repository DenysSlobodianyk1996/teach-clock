// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import { build, type Rollup } from 'vite'
import { GOOGLE_PLAY_LIVE, GOOGLE_PLAY_URL, GOOGLE_SITE_VERIFICATION, SITE_URL } from '@/config'
import { LOCALES, tEn } from '@/test/i18n'
import { seoPlugin, type SeoOptions } from '../../vite.config.ts'

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
async function built(env: Record<string, string>, options?: SeoOptions) {
  const output = (await build({
    root,
    configFile: false,
    logLevel: 'silent',
    build: { write: false },
    plugins: [seoPlugin(env, options)],
  })) as Rollup.RollupOutput
  return new Map(output.output.map((file) => [file.fileName, file]))
}

/** The page's head as the build wrote it. */
function headOf(files: Awaited<ReturnType<typeof built>>): HTMLHeadElement {
  return new JSDOM(source(files.get('index.html')) as string).window.document.head
}

/** The page's JSON-LD, parsed. */
function structuredDataOf(head: HTMLHeadElement): unknown {
  const scripts = head.querySelectorAll('script[type="application/ld+json"]')
  expect(scripts).toHaveLength(1)
  return JSON.parse(scripts[0]!.textContent!)
}

/** The Web App as JSON-LD describes it (batch 31). */
const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Teach Clock',
  description: 'A calm game where kids learn to read a clock and set its hands. No ads.',
  url: 'https://denysslobodianyk1996.github.io/teach-clock/',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  inLanguage: 'en',
  availableLanguage: ['en', 'uk', 'de', 'fr', 'it', 'es'],
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

    it('describes the game as a free educational web app in every language, in English', () => {
      expect(webApplication.name).toBe(tEn('app.name'))
      expect(webApplication.description).toBe(tEn('app.description'))
      expect(webApplication.availableLanguage).toEqual(LOCALES)
      expect(structuredDataOf(head)).toEqual(webApplication)
    })

    it('has a robots.txt that allows everything and names the sitemap', () => {
      expect(source(files.get('robots.txt'))).toBe(
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`,
      )
    })

    it("carries the owner's Search Console verification token", () => {
      expect(GOOGLE_SITE_VERIFICATION).toBe('jFybgwwGyr9yepRC53WaJmZYPZGWPFwLZD000UJpGIg')
      expect(meta('google-site-verification')).toBe(GOOGLE_SITE_VERIFICATION)
    })
  })

  it('leaves the verification tag out if its token is ever emptied', async () => {
    const head = headOf(await built({ GITHUB_PAGES: '1' }, { siteVerification: '' }))
    expect(head.querySelector('meta[name="google-site-verification"]')).toBeNull()
  }, 60_000)

  it('names the Android App on Google Play once it is in production', async () => {
    expect(GOOGLE_PLAY_LIVE).toBe(false)
    const head = headOf(await built({ GITHUB_PAGES: '1' }, { googlePlayLive: true }))
    expect(structuredDataOf(head)).toEqual([
      webApplication,
      {
        ...webApplication,
        '@type': 'MobileApplication',
        url: GOOGLE_PLAY_URL,
        installUrl: GOOGLE_PLAY_URL,
        operatingSystem: 'Android',
      },
    ])
  }, 60_000)

  for (const [name, env] of [
    ['the Android App', { GITHUB_PAGES: '1', VITE_TARGET: 'android' }],
    ['a build for elsewhere', {}],
  ] as const) {
    it(`adds nothing in ${name}`, async () => {
      const files = await built(env)
      const html = source(files.get('index.html')) as string
      expect(html).not.toMatch(/og:|twitter:|canonical|ld\+json|google-site-verification/)
      expect(files.has('og-image.png')).toBe(false)
      expect(files.has('sitemap.xml')).toBe(false)
      expect(files.has('robots.txt')).toBe(false)
    }, 60_000)
  }
})
