import { vi } from 'vitest'
import { stubDeviceTheme } from './deviceTheme'

/**
 * Runs the app as an installed Web App: `matchMedia('(display-mode: standalone)')` matches, on a
 * device in light mode. Undo with `vi.unstubAllGlobals()`.
 */
export function stubInstalledWebApp() {
  stubDeviceTheme('light')
  const device = window.matchMedia
  vi.stubGlobal('matchMedia', (query: string) => {
    const list = device(query)
    if (!query.includes('display-mode: standalone')) return list
    return { ...list, media: query, matches: true }
  })
}
