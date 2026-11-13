/**
 * The popups open right now, newest last. `PopupDialog` adds itself while mounted, so the Android
 * back button can close the top one the same way Escape does.
 */
const dismissers: (() => void)[] = []

/** Adds a popup's dismiss; call the returned function when the popup closes. */
export function trackPopup(dismiss: () => void): () => void {
  dismissers.push(dismiss)
  return () => {
    const at = dismissers.lastIndexOf(dismiss)
    if (at >= 0) dismissers.splice(at, 1)
  }
}

export function hasOpenPopup(): boolean {
  return dismissers.length > 0
}

/** Dismisses the newest open popup, as Escape would. */
export function dismissTopPopup(): void {
  dismissers[dismissers.length - 1]?.()
}
