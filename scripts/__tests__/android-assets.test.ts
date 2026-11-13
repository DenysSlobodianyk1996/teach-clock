// @vitest-environment node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { DENSITIES, THEME_COLOR } from '../generate-android-assets.ts'

// Checks the files written by `npm run generate-android-assets` (committed in android/ and docs/store/).
const root = fileURLToPath(new URL('../../', import.meta.url))
const res = `${root}android/app/src/main/res/`

const hex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`

async function pixels(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const at = (x: number, y: number) => {
    const i = (y * info.width + x) * 4
    return { color: hex(data[i]!, data[i + 1]!, data[i + 2]!), alpha: data[i + 3]! }
  }
  return { info, at }
}

describe('Android launcher icon', () => {
  it('has the theme colour as its adaptive background', () => {
    const xml = readFileSync(`${res}values/ic_launcher_background.xml`, 'utf8')
    expect(xml.toLowerCase()).toContain(`>${THEME_COLOR}<`)
  })

  it.each(Object.entries(DENSITIES))(
    'keeps the %s foreground inside the 66dp safe zone',
    async (name, scale) => {
      const { info, at } = await pixels(`${res}mipmap-${name}/ic_launcher_foreground.png`)
      expect(info.width).toBe(108 * scale)
      const centre = info.width / 2
      const safe = 33 * scale
      let drawn = 0
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          if (at(x, y).alpha === 0) continue
          drawn++
          expect(Math.hypot(x + 0.5 - centre, y + 0.5 - centre)).toBeLessThanOrEqual(safe)
        }
      }
      expect(drawn).toBeGreaterThan(0)
    },
  )
})

describe('Android splash', () => {
  it('fills the splash images with the theme colour', async () => {
    for (const dir of ['drawable', 'drawable-port-xxxhdpi', 'drawable-land-mdpi']) {
      const { at } = await pixels(`${res}${dir}/splash.png`)
      expect(at(0, 0).color).toBe(THEME_COLOR)
    }
  })

  it('sets the theme colour as the system splash background', () => {
    const colors = readFileSync(`${res}values/splash.xml`, 'utf8').toLowerCase()
    expect(colors).toContain(`>${THEME_COLOR}<`)
    const styles = readFileSync(`${res}values/styles.xml`, 'utf8')
    expect(styles).toContain(
      '<item name="windowSplashScreenBackground">@color/splash_background</item>',
    )
    expect(styles).toContain(
      '<item name="windowSplashScreenAnimatedIcon">@drawable/splash_icon</item>',
    )
  })
})

describe('Play Store icon', () => {
  it('is a 512×512 32-bit PNG', async () => {
    const meta = await sharp(`${root}docs/store/icon-512.png`).metadata()
    expect(meta).toMatchObject({
      format: 'png',
      width: 512,
      height: 512,
      channels: 4,
      depth: 'uchar',
    })
  })
})
