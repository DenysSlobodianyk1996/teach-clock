/**
 * Which build is running: the Web App (website and installed PWA) or the Android App (Capacitor,
 * ADR 0004). This is the only place that reads the build env var (bar one test in main.ts); components
 * import `isAndroidApp` from here and never read `import.meta.env` themselves.
 */

export interface PlatformEnv {
  /** `android` for the Android App build; anything else is the Web App. */
  VITE_TARGET?: string
}

export interface Platform {
  isAndroidApp: boolean
}

export function readPlatform(env: PlatformEnv): Platform {
  return { isAndroidApp: env.VITE_TARGET === 'android' }
}

const platform = readPlatform(import.meta.env)

/** True in the Android App build (`VITE_TARGET=android`). */
export const isAndroidApp = platform.isAndroidApp
