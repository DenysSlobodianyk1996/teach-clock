import {
  createResizeOptions,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

/** The dark theme's background (--bg under [data-theme='dark'] in src/styles/theme.css). */
const background = '#121a24'

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
