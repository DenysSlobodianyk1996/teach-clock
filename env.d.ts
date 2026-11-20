/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Build env vars. VITE_TARGET is read only through src/platform.ts.
interface ImportMetaEnv {
  /** `android` for the Android App build; unset for the Web App. */
  readonly VITE_TARGET?: string
  /** The Privacy Page's date, set by vite.config.ts; read only through src/privacy.ts. */
  readonly VITE_PRIVACY_UPDATED?: string
  /** The app's version, set by vite.config.ts; read only through src/privacy.ts. */
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
