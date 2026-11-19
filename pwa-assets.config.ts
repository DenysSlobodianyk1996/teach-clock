import {
  createResizeOptions,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'
import { ICON_BG } from './src/brandMark.ts'

/** The clock face's cream, as on the Android icon (the manifest's theme colour stays THEME_BG). */
const background = ICON_BG

// Generates the app icons in public/ from the brand mark: `npm run generate-pwa-assets`.
// Padding is the share of the side left empty around the 200-unit mark (the clock is 187 of it).
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // The maskable safe zone is the middle circle, 80% of the side: the clock is 79.5% wide.
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0.15,
      resizeOptions: createResizeOptions(false, { background }),
    },
    // iOS rounds the square's corners but never cuts its inscribed circle: the clock is 86% wide.
    apple: {
      ...minimal2023Preset.apple,
      padding: 0.08,
      resizeOptions: createResizeOptions(false, { background }),
    },
  },
  images: ['public/favicon.svg'],
})
