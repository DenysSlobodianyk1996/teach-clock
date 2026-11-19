import type { CapacitorConfig } from '@capacitor/cli'

/**
 * The Android App (ADR 0004): the built game from `dist/` packaged inside a Capacitor shell.
 * Build it with `npm run android:sync`.
 */
const config: CapacitorConfig = {
  appId: 'app.teachclockforkids',
  appName: 'Teach Clock',
  webDir: 'dist',
  plugins: {
    // Edge to edge (index.html has `viewport-fit=cover`): the page draws under the status bar, a
    // camera cutout and the navigation bar. `css` also puts their sizes in --safe-area-inset-*,
    // right even on WebViews whose env(safe-area-inset-*) is wrong; src/styles/theme.css reads them.
    SystemBars: { insetsHandling: 'css' },
  },
}

export default config
