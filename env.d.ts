/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Build env var. Read them only through src/platform.ts.
interface ImportMetaEnv {
  /** `android` for the Android App build; unset for the Web App. */
  readonly VITE_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
