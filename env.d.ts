/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Build env vars. Read them only through src/platform.ts.
interface ImportMetaEnv {
  /** `android` for the Android App build; unset for the Web App. */
  readonly VITE_TARGET?: string
  /** The Support Button's link; only an `https://` value counts. */
  readonly VITE_SUPPORT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
