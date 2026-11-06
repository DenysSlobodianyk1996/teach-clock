import { t, startingWith } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

/** The clock's SVG is 200 units across; the grips sit at these distances from the centre. */
const MINUTE_TIP = 70
const HOUR_TIP = 45

/** A page point at `angle` (0° at 12, clockwise) and `radius` clock units from the centre. */
async function clockPoint(page: Page, angle: number, radius: number) {
  const box = (await page.locator('.clock-side svg.clock').boundingBox())!
  const scale = box.width / 200
  const rad = (angle * Math.PI) / 180
  return {
    x: box.x + box.width / 2 + radius * scale * Math.sin(rad),
    y: box.y + box.height / 2 - radius * scale * Math.cos(rad),
  }
}

/** Presses on the point at `from`, slides through each angle in turn, then lets go. */
async function drag(page: Page, radius: number, from: number, through: number[]) {
  const start = await clockPoint(page, from, radius)
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  for (const angle of through) {
    const p = await clockPoint(page, angle, radius)
    await page.mouse.move(p.x, p.y)
  }
  await page.mouse.up()
}

/** From 12:00, turns the Minute Hand clockwise to the target minutes, then the Hour Hand to its hour. */
async function setHands(page: Page, time: string) {
  const [hour, minute] = time.split(':').map(Number) as [number, number]
  const steps = Array.from({ length: minute * 2 }, (_, i) => (i + 1) * 3)
  await drag(page, MINUTE_TIP, 0, steps)
  await drag(page, HOUR_TIP, minute * 0.5, [hour * 30 + minute * 0.5])
}

const handsAt = (time: string) =>
  `.clock-side svg.clock[aria-label="${t('app.clockDrag', { time })}"]`

test('a Drag Arrows Test Round ends on a Summary that lists the wrong Answer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t('games.dragArrows.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('modes.test.name')) }).check()
  await page.getByRole('radio', { name: startingWith(t('levels.15.name')) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
  await expect(page.getByRole('heading', { name: t('round.setHands') })).toBeVisible()

  const submit = page.getByRole('button', { name: t('round.submit') })
  const target = () => page.locator('.target').innerText()

  // Task 1: only the Hour Hand moves, grabbed where it lies under the Minute Hand at 12:00.
  await expect(page.locator(handsAt('12:00'))).toBeVisible()
  const first = await target()
  // The hour after the target's, on the hour: never the target.
  const wrongHour = (Number(first.split(':')[0]) % 12) + 1
  const wrong = `${wrongHour}:00`
  await drag(page, HOUR_TIP, 0, [15, wrongHour * 30])
  await expect(page.locator(handsAt(wrong))).toBeVisible()
  await submit.click()
  await expect(page.getByText(t('round.progress', { n: 2, total: 10 }))).toBeVisible()
  await expect(page.locator(handsAt('12:00'))).toBeVisible()

  /** Sets the hands to the target and checks the clock shows it before submitting. */
  async function answerRight() {
    const time = await target()
    await setHands(page, time)
    await expect(page.locator(handsAt(time))).toBeVisible()
    await submit.click()
  }

  for (let n = 2; n < 10; n++) {
    await answerRight()
    await expect(page.getByText(t('round.progress', { n: n + 1, total: 10 }))).toBeVisible()
  }
  await answerRight()

  await expect(page).toHaveURL(/\/summary$/)
  await expect(
    page.getByRole('heading', { name: t('summary.headline', { right: 9, total: 10 }) }),
  ).toBeVisible()
  await expect(page.getByRole('region', { name: t('summary.wrong') })).toContainText(
    `${first} — ${t('summary.yourAnswer', { time: wrong })}`,
  )
})
