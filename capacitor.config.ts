import type { CapacitorConfig } from '@capacitor/cli'

/**
 * The Android App (ADR 0004): the built game from `dist/` packaged inside a Capacitor shell.
 * Build it with `npm run build:android`.
 */
const config: CapacitorConfig = {
  appId: 'app.teachclockforkids',
  appName: 'Вчимо годинник',
  webDir: 'dist',
}

export default config
