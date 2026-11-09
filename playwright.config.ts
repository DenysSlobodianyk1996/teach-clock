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
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /offline\.spec|small-phone|phone-layout-768/,
    },
    {
      name: 'phone',
      use: { ...devices['Pixel 7'] },
      // On a phone the clock may move when a hint appears, so clock-stays-put is desktop only.
      testIgnore: /offline\.spec|small-phone|clock-stays-put|phone-layout-768/,
    },
    {
      // A narrow, short phone: a 360 × 800 screen minus the status and navigation bars, as when
      // the game is installed. Checks that everything fits without scrolling.
      name: 'small-phone',
      use: { ...devices['Galaxy S8'], viewport: { width: 360, height: 720 } },
      testMatch: /fits-small-phone\.spec|number-size\.spec/,
    },
    {
      // Windows between phone and desktop: 601–768px wide, an upright tablet, a wide landscape window
      // and a sideways phone. Each test sets its own viewport; see phone-layout-768.spec.ts.
      name: 'tablet',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /phone-layout-768\.spec/,
    },
    {
      // The built app: the offline check, and checks that minified CSS has broken before.
      name: 'offline',
      use: { ...devices['Pixel 7'], baseURL: `http://localhost:${offlinePort}` },
      testMatch: /offline\.spec|dragged-number\.spec/,
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
