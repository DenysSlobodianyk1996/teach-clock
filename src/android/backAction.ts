/**
 * What the Android back button does (spec, Back button). Plain TypeScript: no Vue, no Capacitor.
 * It never drops a Player out of a Round: in a Round it asks first with `LeaveRoundDialog`.
 */

export type BackScreen = 'welcome' | 'settings' | 'round' | 'summary'

export interface BackState {
  screen: BackScreen
  /** A popup is open: the Teach wrong-answer popup, `LeaveRoundDialog`, any `PopupDialog`. */
  popupOpen: boolean
}

export type BackAction = 'exit' | 'goWelcome' | 'openLeaveDialog' | 'closePopup'

export function backAction({ screen, popupOpen }: BackState): BackAction {
  if (popupOpen) return 'closePopup'
  switch (screen) {
    case 'welcome':
      return 'exit'
    case 'round':
      return 'openLeaveDialog'
    case 'settings':
    case 'summary':
      return 'goWelcome'
  }
}
