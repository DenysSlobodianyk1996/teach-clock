import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const port = process.env.CI ? 4173 : 5180
/** The offline check needs the service worker, so it always runs on the built app. */
const offlinePort = process.env.CI ? 4173 : 4174

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /offline\.spec/ },
    { name: 'phone', use: { ...devices['Pixel 7'] }, testIgnore: /offline\.spec/ },
    {
      name: 'offline',
      use: { ...devices['Pixel 7'], baseURL: `http://localhost:${offlinePort}` },
      testMatch: /offline\.spec/,
    },
  ],
  webServer: [
    {
      // Dev server locally for speed, the built app on CI.
      command: process.env.CI
        ? 'npm run build-only && npm run preview'
        : `npm run dev -- --port ${port} --strictPort`,
      port,
      reuseExistingServer: !process.env.CI,
    },
    // Locally the offline check gets its own build; on CI the server above already is one.
    ...(process.env.CI
      ? []
      : [
          {
            // Its own folder, so it never clashes with `npm run build` in dist/.
            command: `npx vite build --outDir dist-offline && npx vite preview --outDir dist-offline --port ${offlinePort} --strictPort`,
            port: offlinePort,
            reuseExistingServer: false,
          },
        ]),
  ],
})
