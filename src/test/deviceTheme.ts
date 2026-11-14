import { vi } from 'vitest'

type Scheme = 'light' | 'dark'

/**
 * Stubs `matchMedia` so the device reports `scheme` for `prefers-color-scheme`. `set` changes it
 * later and tells the listeners, as a device does when its dark mode is switched. Undo with
 * `vi.unstubAllGlobals()`.
 */
export function stubDeviceTheme(scheme: Scheme) {
  let current = scheme
  const lists: { query: string; listeners: Set<(e: MediaQueryListEvent) => void> }[] = []
  const matches = (query: string) => query.includes('dark') === (current === 'dark')

  vi.stubGlobal('matchMedia', (query: string) => {
    const entry = { query, listeners: new Set<(e: MediaQueryListEvent) => void>() }
    lists.push(entry)
    return {
      media: query,
      get matches() {
        return query.includes('prefers-color-scheme') && matches(query)
      },
      onchange: null,
      addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) =>
        entry.listeners.add(fn),
      removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) =>
        entry.listeners.delete(fn),
      addListener: (fn: (e: MediaQueryListEvent) => void) => entry.listeners.add(fn),
      removeListener: (fn: (e: MediaQueryListEvent) => void) => entry.listeners.delete(fn),
      dispatchEvent: () => true,
    }
  })

  return {
    set(next: Scheme) {
      current = next
      for (const { query, listeners } of lists) {
        const event = { matches: matches(query), media: query } as MediaQueryListEvent
        listeners.forEach((fn) => fn(event))
      }
    },
  }
}
