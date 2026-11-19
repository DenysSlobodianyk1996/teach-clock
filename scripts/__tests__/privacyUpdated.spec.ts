import { describe, expect, it } from 'vitest'
import { privacyUpdated } from '../privacyUpdated'

describe('privacyUpdated: the Privacy Page date a build prints', () => {
  const today = new Date('2026-11-20T23:30:00Z')

  it('is the date of the commit being built, so every deploy from main gets its own date', () => {
    expect(privacyUpdated({ commitDate: () => '2026-11-19\n', now: today })).toBe('2026-11-19')
  })

  it('takes a date given in VITE_PRIVACY_UPDATED first', () => {
    expect(
      privacyUpdated({ given: '2026-01-02', commitDate: () => '2026-11-19', now: today }),
    ).toBe('2026-01-02')
  })

  it('falls back to today (UTC) without git or with something that is not a date', () => {
    const noGit = () => {
      throw new Error('not a git repository')
    }
    expect(privacyUpdated({ commitDate: noGit, now: today })).toBe('2026-11-20')
    expect(privacyUpdated({ given: 'soon', commitDate: () => 'oops', now: today })).toBe(
      '2026-11-20',
    )
  })
})
