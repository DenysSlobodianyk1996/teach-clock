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
})

describe('platform module', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('reads the build env once into isAndroidApp', async () => {
    vi.stubEnv('VITE_TARGET', 'android')
    vi.resetModules()
    const platform = await import('../platform')
    expect(platform.isAndroidApp).toBe(true)
  })
})
