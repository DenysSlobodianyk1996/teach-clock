// The Play Store screenshots and feature graphic: `npm run store-shots`. Not part of
// `npx playwright test` (that config only runs *.spec.ts). Writes into docs/store/.
import process from 'node:process'
import { defineConfig } from '@playwright/test'

const port = Number(process.env.PW_PORT ?? 4180)

export default defineConfig({
  testDir: './e2e',
  testMatch: /store-shots\.ts$/,
  timeout: 120 * 1000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // A 9:16 phone scaled to Play's 1080 × 1920. 468 × 832 rather than 360 × 640: on the
    // smaller one Welcome and Settings run below the fold and the shots cut their buttons off.
    viewport: { width: 468, height: 832 },
    deviceScaleFactor: 1080 / 468,
    isMobile: true,
    hasTouch: true,
  },
  webServer: {
    // The Android App's build: no Support Button, no service worker. Its own folder.
    command: `VITE_TARGET=android npx vite build --outDir dist-store && npx vite preview --outDir dist-store --port ${port} --strictPort`,
    port,
    reuseExistingServer: false,
  },
})
