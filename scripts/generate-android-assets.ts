// Draws the Android launcher icon, splash and Play Store icon from public/favicon.svg:
// `npm run generate-android-assets`. Commit the files it writes.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

/** The middle theme's background (--bg in src/styles/theme.css), as in pwa-assets.config.ts. */
export const THEME_COLOR = '#1d4b5c'

/** Android density buckets and their scale from dp to px. */
export const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 } as const

const root = fileURLToPath(new URL('../', import.meta.url))
const res = `${root}android/app/src/main/res/`
const favicon = readFileSync(`${root}public/favicon.svg`, 'utf8')

/** The clock's outer edge (r 90 + half the 7 stroke) over the favicon's 200-unit viewBox. */
const CLOCK_SHARE = 187 / 200

/** The favicon placed so the clock face is `diameter` wide, centred on (cx, cy). */
function clock(cx: number, cy: number, diameter: number): string {
  const box = diameter / CLOCK_SHARE
  return favicon.replace(
    '<svg ',
    `<svg x="${cx - box / 2}" y="${cy - box / 2}" width="${box}" height="${box}" `,
  )
}

function svg(width: number, height: number, body: string): Buffer {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
  )
}

async function png(file: string, image: Buffer): Promise<void> {
  mkdirSync(dirname(file), { recursive: true })
  await sharp(image).png({ compressionLevel: 9 }).toFile(file)
}

const background = (w: number, h: number) =>
  `<rect width="${w}" height="${h}" fill="${THEME_COLOR}"/>`

/**
 * Adaptive icon layers are 108dp; launchers show the middle 72dp through their mask and
 * keep a 66dp circle always visible. The clock is 58dp wide, so every mask shows it whole
 * with a ring of theme colour around it.
 */
const FOREGROUND_CLOCK = 58

async function launcherIcons(): Promise<void> {
  writeFileSync(
    `${res}values/ic_launcher_background.xml`,
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${THEME_COLOR}</color>\n</resources>\n`,
  )
  for (const [name, scale] of Object.entries(DENSITIES)) {
    const dir = `${res}mipmap-${name}/`
    const layer = 108 * scale
    await png(
      `${dir}ic_launcher_foreground.png`,
      svg(layer, layer, clock(layer / 2, layer / 2, FOREGROUND_CLOCK * scale)),
    )
    // Android 7.x (API 24-25) has no adaptive icons: a 48dp square and a round icon.
    const legacy = 48 * scale
    const c = legacy / 2
    await png(
      `${dir}ic_launcher.png`,
      svg(
        legacy,
        legacy,
        `<rect x="${2 * scale}" y="${2 * scale}" width="${44 * scale}" height="${44 * scale}" rx="${8 * scale}" fill="${THEME_COLOR}"/>` +
          clock(c, c, 36 * scale),
      ),
    )
    await png(
      `${dir}ic_launcher_round.png`,
      svg(
        legacy,
        legacy,
        `<circle cx="${c}" cy="${c}" r="${22 * scale}" fill="${THEME_COLOR}"/>` +
          clock(c, c, 34 * scale),
      ),
    )
  }
}

/**
 * Android 12+ draws its own splash: `windowSplashScreenBackground` and an icon on a 288dp
 * canvas, masked to a 192dp circle. The launch theme's window background, `drawable/splash`,
 * shows on older versions and between the system splash and the first web frame. It is a
 * layer-list that draws the same icon unscaled in the middle: a full-screen bitmap would be
 * stretched to the screen's shape and turn the round clock into an oval.
 */
async function splash(): Promise<void> {
  writeFileSync(
    `${res}values/splash.xml`,
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="splash_background">${THEME_COLOR}</color>\n</resources>\n`,
  )
  for (const [name, scale] of Object.entries(DENSITIES)) {
    const icon = 288 * scale
    await png(
      `${res}drawable-${name}/splash_icon.png`,
      svg(icon, icon, clock(icon / 2, icon / 2, 160 * scale)),
    )
  }
  writeFileSync(
    `${res}drawable/splash.xml`,
    `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item>
        <bitmap android:gravity="center" android:src="@drawable/splash_icon" />
    </item>
</layer-list>
`,
  )
  // The full-screen bitmaps from Capacitor's template would win over the XML.
  for (const dir of readdirSync(res).filter((d) => d.startsWith('drawable'))) {
    rmSync(`${res}${dir}/splash.png`, { force: true })
    if (dir !== 'drawable' && readdirSync(`${res}${dir}`).length === 0)
      rmSync(`${res}${dir}`, { recursive: true })
  }
}

/** Google Play wants a 512×512 32-bit PNG, full bleed: it rounds the corners itself. */
async function storeIcon(): Promise<void> {
  const file = `${root}docs/store/icon-512.png`
  const size = 512
  const image = svg(size, size, background(size, size) + clock(size / 2, size / 2, size * 0.66))
  mkdirSync(dirname(file), { recursive: true })
  await sharp(image).ensureAlpha().png({ compressionLevel: 9 }).toFile(file)
}

if (import.meta.main) {
  await launcherIcons()
  await splash()
  await storeIcon()
  console.log('Android icons, splash and docs/store/icon-512.png written.')
}
