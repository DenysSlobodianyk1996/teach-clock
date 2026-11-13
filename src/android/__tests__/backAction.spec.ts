import { describe, expect, it } from 'vitest'
import { backAction, type BackAction, type BackScreen } from '../backAction'

describe('backAction: what the Android back button does', () => {
  const rows: [BackScreen, boolean, BackAction][] = [
    ['welcome', false, 'exit'],
    ['settings', false, 'goWelcome'],
    ['round', false, 'openLeaveDialog'],
    ['summary', false, 'goWelcome'],
    // Any open popup closes first; in a Round that includes the leave dialog itself.
    ['welcome', true, 'closePopup'],
    ['settings', true, 'closePopup'],
    ['round', true, 'closePopup'],
    ['summary', true, 'closePopup'],
  ]

  it.each(rows)('on %s, popup open %s: %s', (screen, popupOpen, action) => {
    expect(backAction({ screen, popupOpen })).toBe(action)
  })
})
