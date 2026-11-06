/** Dragging the hands of the Round's clock in Drag Arrows, with a real mouse. */
import { t } from './i18n.ts'
import type { Page } from '@playwright/test'
import { HAND_GEOMETRY } from '../src/game/clockFace.ts'

/** The clock's SVG is 200 units across; the grips sit at these distances from the centre. */
export const MINUTE_GRIP = HAND_GEOMETRY.minute.grip
export const HOUR_GRIP = HAND_GEOMETRY.hour.grip

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
export async function drag(page: Page, radius: number, from: number, through: number[]) {
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
export async function setHands(page: Page, time: string) {
  const [hour, minute] = time.split(':').map(Number) as [number, number]
  const steps = Array.from({ length: minute * 2 }, (_, i) => (i + 1) * 3)
  await drag(page, MINUTE_GRIP, 0, steps)
  await drag(page, HOUR_GRIP, minute * 0.5, [hour * 30 + minute * 0.5])
}

export const handsAt = (time: string) =>
  `.clock-side svg.clock[aria-label="${t('app.clockDrag', { time })}"]`
