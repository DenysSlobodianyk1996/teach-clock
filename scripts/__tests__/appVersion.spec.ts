import { describe, expect, it } from 'vitest'
import { appVersion } from '../appVersion'

describe('appVersion: the version the Privacy Page and Google Play show', () => {
  it("is package.json's major.minor with the Android build's run number as the patch", () => {
    expect(appVersion({ packageVersion: '1.0.0', versionCode: '23' })).toBe('1.0.23')
    expect(appVersion({ packageVersion: '2.1.7', versionCode: '40' })).toBe('2.1.40')
  })

  it("keeps package.json's version for a local build, with no run number", () => {
    expect(appVersion({ packageVersion: '1.0.0' })).toBe('1.0.0')
    expect(appVersion({ packageVersion: '1.0.0', versionCode: '' })).toBe('1.0.0')
    expect(appVersion({ packageVersion: '1.0.0', versionCode: 'abc' })).toBe('1.0.0')
  })
})
