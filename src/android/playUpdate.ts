import type { Router } from 'vue-router'
import { AppUpdateAvailability, type AppUpdatePlugin } from '@capawesome/capacitor-app-update'

/** Screens with no Round in play, where restarting into a new version loses nothing (as src/pwa.ts). */
const SAFE_SCREENS = new Set(['welcome', 'settings'])

export type PlayUpdates = Pick<AppUpdatePlugin, 'getAppUpdateInfo' | 'performImmediateUpdate'>

/**
 * Google Play's own "Update available" screen (an immediate in-app update): Play downloads the new
 * version and restarts the app into it. Play draws the screen in the phone's language.
 *
 * The returned function offers it when Play has a newer version and the Player is on a safe screen.
 * It asks once per start of the app: after the Player closes Play's screen, it stays quiet until the
 * app is started again. Errors (not installed from Play, offline) are ignored, and the next call tries again.
 */
export function playUpdateOffer(router: Router, play: PlayUpdates): () => Promise<void> {
  let asked = false
  let checking = false
  const onSafeScreen = () => SAFE_SCREENS.has(String(router.currentRoute.value.name))

  return async function offerIfSafe() {
    if (asked || checking || !onSafeScreen()) return
    checking = true
    try {
      const info = await play.getAppUpdateInfo()
      const available =
        info.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE &&
        info.immediateUpdateAllowed !== false
      // An update Play had started and the app was closed in the middle of: Play asks to finish it.
      const interrupted = info.updateAvailability === AppUpdateAvailability.UPDATE_IN_PROGRESS
      // The Player may have started a Round while Play was answering.
      if (!(available || interrupted) || !onSafeScreen()) return
      asked = true
      await play.performImmediateUpdate()
    } catch {
      // Not from Play, offline, or Play's screen failed: nothing to show; try again next time.
    } finally {
      checking = false
    }
  }
}

/** The Android App only: offers Play's update screen at start and each time the app comes back. */
export async function offerPlayUpdates(router: Router): Promise<void> {
  const [{ App }, { AppUpdate }] = await Promise.all([
    import('@capacitor/app'),
    import('@capawesome/capacitor-app-update'),
  ])
  const offer = playUpdateOffer(router, AppUpdate)
  await router.isReady()
  void offer()
  await App.addListener('resume', () => void offer())
}
