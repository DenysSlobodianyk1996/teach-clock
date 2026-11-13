import type { Router } from 'vue-router'
import { usePlayStore } from '@/stores/play'
import { dismissTopPopup, hasOpenPopup } from '@/components/openPopups'
import { backAction, type BackScreen } from './backAction'

const SCREENS: readonly BackScreen[] = ['welcome', 'settings', 'round', 'summary']

/** Does what `backAction` says for the screen on show. `exit` closes the app. */
export async function pressBack(router: Router, exit: () => unknown): Promise<void> {
  const name = router.currentRoute.value.name
  const screen = SCREENS.find((s) => s === name) ?? 'welcome'
  switch (backAction({ screen, popupOpen: hasOpenPopup() })) {
    case 'closePopup':
      dismissTopPopup()
      return
    case 'openLeaveDialog': {
      const play = usePlayStore()
      // A finished Round is already on its way to its Summary: nothing to leave.
      if (play.round && !play.summary) play.askingToLeave = true
      return
    }
    case 'goWelcome':
      await router.push({ name: 'welcome' })
      return
    case 'exit':
      await exit()
  }
}

/** The Android App only: the hardware back button acts per screen instead of WebView history. */
export async function listenToBackButton(router: Router): Promise<void> {
  const { App } = await import('@capacitor/app')
  await App.addListener('backButton', () => pressBack(router, () => App.exitApp()))
}
