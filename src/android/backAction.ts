/**
 * What the Android back button does (spec, Back button). Plain TypeScript: no Vue, no Capacitor.
 * It never drops a Player out of a Round: in a Round it asks first with `LeaveRoundDialog`.
 */

export type BackScreen = 'welcome' | 'settings' | 'round' | 'summary' | 'privacy'

export interface BackState {
  /** `undefined`: a screen this table does not know. Back then goes to Welcome, never exits. */
  screen: BackScreen | undefined
  /** A popup is open: the Teach wrong-answer popup, `LeaveRoundDialog`, any `PopupDialog`. */
  popupOpen: boolean
}

export type BackAction = 'exit' | 'goWelcome' | 'goBack' | 'openLeaveDialog' | 'closePopup'

export function backAction({ screen, popupOpen }: BackState): BackAction {
  if (popupOpen) return 'closePopup'
  switch (screen) {
    case 'welcome':
      return 'exit'
    case 'round':
      return 'openLeaveDialog'
    // Opened from the Footer of Welcome or Settings: back to that screen.
    case 'privacy':
      return 'goBack'
    case 'settings':
    case 'summary':
    case undefined:
      return 'goWelcome'
  }
}
