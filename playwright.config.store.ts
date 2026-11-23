// The Play Store screenshots and feature graphic: `npm run store-shots`. Not part of
// `npx playwright test` (that config only runs *.spec.ts). Writes into docs/store/<lang>/.
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
    isMobile: true,
    hasTouch: true,
  },
  // One project per Play screenshot slot, all 9:16 portrait. e2e/store-shots.ts names the
  // folder after the project. Run one with `npm run store-shots -- --project=tablet-7`.
  projects: [
    {
      // A phone scaled to Play's 1080 × 1920. 468 × 832 rather than 360 × 640: on the smaller
      // one Welcome and Settings run below the fold and the shots cut their buttons off.
      name: 'phone',
      use: { viewport: { width: 468, height: 832 }, deviceScaleFactor: 1080 / 468 },
    },
    {
      // A 7-inch tablet (about 600 dp wide), 1216 × 2160.
      name: 'tablet-7',
      use: { viewport: { width: 608, height: 1080 }, deviceScaleFactor: 2 },
    },
    {
      // A 10-inch tablet (about 800 dp wide), 1620 × 2880.
      name: 'tablet-10',
      use: { viewport: { width: 810, height: 1440 }, deviceScaleFactor: 2 },
    },
  ],
  webServer: {
    // The Android App's build: no service worker. Its own folder.
    command: `VITE_TARGET=android npx vite build --outDir dist-store && npx vite preview --outDir dist-store --port ${port} --strictPort`,
    port,
    reuseExistingServer: false,
  },
})
