import {
  createResizeOptions,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'
import { THEME_BG } from './src/themeColors.ts'

/** The dark theme's background, so the clock mark reads clearly. */
const background = THEME_BG.dark

// Generates the app icons in public/ from the brand mark: `npm run generate-pwa-assets`.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: createResizeOptions(false, { background }),
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: createResizeOptions(false, { background }),
    },
  },
  images: ['public/favicon.svg'],
})
