import { vi } from 'vitest'

/**
 * Makes the device report `languages` as its language list (`navigator.languages`). `set` changes
 * it later and fires `languagechange`, as a browser does when the Player changes the list. Undo
 * with `vi.restoreAllMocks()`.
 */
export function stubDeviceLanguages(languages: readonly string[]) {
  let current = languages
  vi.spyOn(navigator, 'languages', 'get').mockImplementation(() => current)
  vi.spyOn(navigator, 'language', 'get').mockImplementation(() => current[0] ?? '')
  return {
    set(next: readonly string[]) {
      current = next
      window.dispatchEvent(new Event('languagechange'))
    },
  }
}
