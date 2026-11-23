/**
 * The Play Store graphics: `npm run store-shots` (playwright.config.store.ts). Not a test and not
 * part of `npx playwright test`. Shoots the Android build in each language, once per project in
 * playwright.config.store.ts, into docs/store/<lang>/<project>/ (phone at 1080 × 1920, tablet-7,
 * tablet-10). The phone project also draws the feature graphic in each language
 * (scripts/featureGraphic.ts) into docs/store/<lang>/feature-graphic.png, 1024 × 500.
 * Every file is a PNG without alpha, as Play asks.
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { expect, test, type Page } from '@playwright/test'
import { LOCALES, startingWith, tIn, type Locale } from './i18n.ts'
import { setHands } from './hands.ts'
import { dragNumber, tapNumber } from './numbers.ts'
import { featureGraphicSvg } from '../scripts/featureGraphic.ts'

const STORE = fileURLToPath(new URL('../docs/store/', import.meta.url))

/** The folder for one language's screenshots on one device. */
function shotDir(project: string, lang: string) {
  return `${STORE}${lang}/${project}/`
}

/** The Player's name in each language's screenshots. */
const PLAYER_NAMES: Record<Locale, string> = { uk: 'Оля', en: 'Emma' }
type Game = 'setTime' | 'dragArrows' | 'dragHours' | 'dragMinutes'

/** Saves what the page shows as a PNG with no alpha channel. */
async function save(page: Page, file: string) {
  // Let entry animations settle, then freeze any that are still running.
  await page.waitForTimeout(600)
  const shot = await page.screenshot({ animations: 'disabled', caret: 'hide' })
  await sharp(shot).removeAlpha().png({ compressionLevel: 9 }).toFile(file)
}

/** A seeded Math.random, so every run deals the same Tasks. */
function seedRandom(seed: number) {
  let s = seed >>> 0
  Math.random = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let r = Math.imul(s ^ (s >>> 15), 1 | s)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

for (const lang of LOCALES) {
  test.describe(`screenshots ${lang}`, () => {
    const t = (key: Parameters<typeof tIn>[1], params?: Parameters<typeof tIn>[2]) =>
      tIn(lang, key, params)
    const name = PLAYER_NAMES[lang]
    const file = (n: number, slug: string) =>
      `${shotDir(test.info().project.name, lang)}${n}-${slug}.png`

    test.beforeAll(() => mkdirSync(shotDir(test.info().project.name, lang), { recursive: true }))

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(seedRandom, 2026)
      await page.addInitScript((locale) => {
        localStorage.setItem('teach-clock.locale', locale)
        localStorage.setItem('teach-clock.theme', 'light')
      }, lang)
    })

    const radio = (page: Page, text: string) =>
      page.getByRole('radio', { name: startingWith(text) })

    async function toSettings(page: Page) {
      await page.goto('/')
      await page.getByLabel(t('welcome.nameLabel')).fill(name)
      await page.getByRole('button', { name: t('welcome.start') }).click()
    }

    async function startRound(page: Page, game: Game, mode: 'teach' | 'test', level?: 5 | 15) {
      await toSettings(page)
      await radio(page, t(`games.${game}.name`)).check()
      await radio(page, t(`modes.${mode}.name`)).check()
      if (level) await radio(page, t(`levels.${level}.name`)).check()
      await page.getByRole('button', { name: t('settings.play') }).click()
    }

    const popup = (page: Page) => page.getByRole('dialog', { name: t('teach.wrongTitle') })

    /** The Set Time clock's time, read from its label. */
    async function shownTime(page: Page) {
      const prefix = t('app.clockShows', { time: '' })
      const label = await page
        .locator('.clock-side')
        .getByRole('img', { name: startingWith(prefix) })
        .getAttribute('aria-label')
      return label!.replace(prefix, '')
    }

    /** Types H:MM on the keyboard, without Enter. */
    async function typeTime(page: Page, time: string) {
      const [h, m] = time.split(':') as [string, string]
      await page.keyboard.type(h.padStart(2, '0') + m)
    }

    test('1 Welcome with a name', async ({ page }) => {
      await page.goto('/')
      await page.getByLabel(t('welcome.nameLabel')).fill(name)
      await page.getByLabel(t('welcome.nameLabel')).blur()
      await save(page, file(1, 'welcome'))
    })

    test('2 Settings', async ({ page }) => {
      await toSettings(page)
      // Drag Minutes has neither a minute step nor Hours (Drag Hours' 1–12 / 13–24), so the
      // screen ends cleanly under the Mode cards with Back and Play in view.
      await radio(page, t('games.dragMinutes.name')).check()
      await radio(page, t('modes.teach.name')).check()
      // In the phone layout (every store size is portrait) the Footer ends inside the screen.
      await save(page, file(2, 'settings'))
    })

    test('3 Set Time, Teach, wrong-answer popup', async ({ page }) => {
      await startRound(page, 'setTime', 'teach', 5)
      await expect(page.getByRole('heading', { name: t('round.question') })).toBeVisible()
      const [h, m] = (await shownTime(page)).split(':') as [string, string]
      // A common slip: the hour one too far.
      await typeTime(page, `${(Number(h) % 12) + 1}:${m}`)
      await page.keyboard.press('Enter')
      await expect(popup(page)).toBeVisible()
      await save(page, file(3, 'set-time-teach'))
    })

    test('4 Set Time, Test, and 8 Summary', async ({ page }) => {
      await startRound(page, 'setTime', 'test', 5)
      await expect(page.getByRole('heading', { name: t('round.question') })).toBeVisible()
      for (let n = 1; n <= 10; n++) {
        await expect(page.getByText(t('round.progress', { n, total: 10 }))).toBeVisible()
        const time = await shownTime(page)
        const [h, m] = time.split(':') as [string, string]
        // Two Answers wrong, so the Summary shows both lists.
        await typeTime(page, n === 2 || n === 6 ? `${(Number(h) % 12) + 1}:${m}` : time)
        if (n === 3) await save(page, file(4, 'set-time-test'))
        await page.keyboard.press('Enter')
      }
      await expect(page).toHaveURL(/\/summary$/)
      // On a phone the confetti lands on the headline; it is decoration, so leave it out.
      await page.addStyleTag({ content: '.confetti { display: none }' })
      await save(page, file(8, 'summary'))
    })

    test('5 Drag Arrows, Teach', async ({ page }) => {
      await startRound(page, 'dragArrows', 'teach', 5)
      await expect(page.getByRole('heading', { name: t('round.setHands') })).toBeVisible()
      await setHands(page, await page.locator('.target').innerText())
      await save(page, file(5, 'drag-arrows-teach'))
    })

    test('6 Drag Hours, Test', async ({ page }) => {
      await startRound(page, 'dragHours', 'test')
      // Part done: seven numbers on the face, five still in the tray.
      for (const n of [12, 1, 2, 3, 6, 9]) await tapNumber(page, n, n)
      await dragNumber(page, 5, 5)
      await save(page, file(6, 'drag-hours-test'))
    })

    test('7 Drag Minutes, Teach, wrong-answer popup', async ({ page }) => {
      await startRound(page, 'dragMinutes', 'teach')
      for (const n of [12, 3, 6, 9]) await tapNumber(page, n, n)
      // 10 minutes dropped where 20 goes.
      await dragNumber(page, 2, 4)
      await expect(popup(page)).toBeVisible()
      await save(page, file(7, 'drag-minutes-teach'))
    })
  })
}

/** @font-face rules for the app's Nunito, inlined, so the SVG draws in the app's own font. */
function nunitoFaces() {
  // Resolved like an import, so it works wherever node_modules is (a worktree uses its parent's).
  const pkg = createRequire(import.meta.url).resolve('@fontsource/nunito/package.json')
  const files = `${dirname(pkg)}/files/`
  return [700, 900]
    .flatMap((weight) =>
      ['cyrillic', 'latin'].map((subset) => {
        const font = readFileSync(`${files}nunito-${subset}-${weight}-normal.woff2`)
        return `@font-face{font-family:Nunito;font-weight:${weight};src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2')}`
      }),
    )
    .join('')
}

for (const lang of LOCALES) {
  test(`feature graphic, ${lang}`, async ({ page }, info) => {
    test.skip(info.project.name !== 'phone', 'drawn once, by the phone project')
    await page.setViewportSize({ width: 1024, height: 500 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setContent(
      `<style>${nunitoFaces()}html,body{margin:0}svg{display:block}</style>${featureGraphicSvg(lang)}`,
    )
    await page.evaluate(async () => {
      await Promise.all(
        [700, 900].map((w) => document.fonts.load(`${w} 20px Nunito`, 'Вчимо Teach')),
      )
    })
    const shot = await page.locator('svg').first().screenshot({ scale: 'css' })
    const png = sharp(shot).removeAlpha().png({ compressionLevel: 9 })
    expect((await png.clone().metadata()).width).toBe(1024)
    await png.toFile(`${STORE}${lang}/feature-graphic.png`)
  })
}
