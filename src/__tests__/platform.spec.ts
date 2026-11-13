import { afterEach, describe, expect, it, vi } from 'vitest'
import { readPlatform } from '../platform'

describe('readPlatform', () => {
  it('is the Web App when no target is set', () => {
    expect(readPlatform({}).isAndroidApp).toBe(false)
  })

  it('is the Android App when the target is android', () => {
    expect(readPlatform({ VITE_TARGET: 'android' }).isAndroidApp).toBe(true)
  })

  it('is the Web App for any other target', () => {
    expect(readPlatform({ VITE_TARGET: 'web' }).isAndroidApp).toBe(false)
  })

  it('keeps an https support link', () => {
    const url = 'https://send.monobank.ua/jar/abc'
    expect(readPlatform({ VITE_SUPPORT_URL: url }).supportUrl).toBe(url)
  })

  it.each([undefined, '', 'unset', 'http://example.com', 'javascript:alert(1)', 'https://'])(
    'has no support link for %j',
    (value) => {
      expect(readPlatform({ VITE_SUPPORT_URL: value }).supportUrl).toBeNull()
    },
  )

  it('trims spaces around the support link', () => {
    expect(readPlatform({ VITE_SUPPORT_URL: '  https://x.example/  ' }).supportUrl).toBe(
      'https://x.example/',
    )
  })
})

describe('platform module', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('reads the build env once into isAndroidApp and supportUrl', async () => {
    vi.stubEnv('VITE_TARGET', 'android')
    vi.stubEnv('VITE_SUPPORT_URL', 'https://x.example/')
    vi.resetModules()
    const platform = await import('../platform')
    expect(platform.isAndroidApp).toBe(true)
    expect(platform.supportUrl).toBe('https://x.example/')
  })
})
