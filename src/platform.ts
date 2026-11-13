/**
 * Which build is running: the Web App (website and installed PWA) or the Android App (Capacitor,
 * ADR 0004). This is the only place that reads these build env vars (bar one test in main.ts); components import
 * `isAndroidApp` and `supportUrl` from here and never read `import.meta.env` themselves.
 */

export interface PlatformEnv {
  /** `android` for the Android App build; anything else is the Web App. */
  VITE_TARGET?: string
  /** The Support Button's link. Only an `https://` value counts; `unset` or empty means none. */
  VITE_SUPPORT_URL?: string
}

export interface Platform {
  isAndroidApp: boolean
  supportUrl: string | null
}

export function readPlatform(env: PlatformEnv): Platform {
  const url = env.VITE_SUPPORT_URL?.trim() ?? ''
  return {
    isAndroidApp: env.VITE_TARGET === 'android',
    supportUrl: /^https:\/\/\S+$/.test(url) ? url : null,
  }
}

const platform = readPlatform(import.meta.env)

/** True in the Android App build (`VITE_TARGET=android`). */
export const isAndroidApp = platform.isAndroidApp

/**
 * The Support Button's link, or null when none is set. The Footer shows the Support Button only
 * when this is set and the app is not the Android App (Google Play forbids outside payments).
 */
export const supportUrl = platform.supportUrl
