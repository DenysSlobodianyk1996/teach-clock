import { registerSW } from 'virtual:pwa-register'
import type { Router } from 'vue-router'

/** Screens with no Round in play, where reloading into a new version loses nothing that matters. */
const SAFE_SCREENS = new Set(['welcome', 'settings'])

/**
 * Keeps a copy of the app for offline use (ticket 11) and moves to a new version only on a safe
 * screen, so an update never reloads the page in the middle of a Round or on its Summary.
 */
export function registerServiceWorker(router: Router) {
  let updateWaiting = false

  const update = registerSW({
    onNeedRefresh() {
      updateWaiting = true
      updateIfSafe()
    },
    onRegisteredSW(_url, registration) {
      // An installed app can stay open for days, so look for a new version each time it comes back.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration?.update().catch(() => {})
      })
    },
  })

  function updateIfSafe() {
    if (updateWaiting && SAFE_SCREENS.has(String(router.currentRoute.value.name))) {
      updateWaiting = false
      void update(true)
    }
  }

  router.afterEach(updateIfSafe)
}
