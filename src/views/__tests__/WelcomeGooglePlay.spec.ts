import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WelcomeView from '../WelcomeView.vue'
import { mountScreen } from '@/test/mountScreen'
import { t } from '@/test/i18n'
import { GOOGLE_PLAY_URL } from '@/config'

/** Whether the Android App is in production (the flag in src/config.ts) and which build runs. */
const state = vi.hoisted(() => ({ live: false, android: false }))

vi.mock('@/config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/config')>()),
  get GOOGLE_PLAY_LIVE() {
    return state.live
  },
}))
vi.mock('@/platform', () => ({
  get isAndroidApp() {
    return state.android
  },
}))

async function playLink() {
  const { wrapper } = await mountScreen(WelcomeView, '/')
  return wrapper.findAll('a').find((a) => a.text() === t('welcome.googlePlay'))
}

describe('the Google Play link on Welcome', () => {
  beforeEach(() => {
    localStorage.clear()
    state.live = false
    state.android = false
  })

  it('is not there until the Android App is in production', async () => {
    expect(await playLink()).toBeUndefined()
  })

  it('leads to the Play listing once it is', async () => {
    state.live = true
    const link = await playLink()
    expect(link?.attributes('href')).toBe(GOOGLE_PLAY_URL)
  })

  it('is never in the Android App itself', async () => {
    state.live = true
    state.android = true
    expect(await playLink()).toBeUndefined()
  })

  it('is the listing of the app id the Android App is built with', () => {
    const capacitor = readFileSync('capacitor.config.ts', 'utf8')
    const appId = /appId: '([^']+)'/.exec(capacitor)?.[1]
    expect(GOOGLE_PLAY_URL).toBe(`https://play.google.com/store/apps/details?id=${appId}`)
  })
})
