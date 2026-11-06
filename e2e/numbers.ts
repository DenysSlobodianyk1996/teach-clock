/** Moving Drag Numbers tiles onto the empty clock face, with a real mouse or by tapping. */
import type { Page } from '@playwright/test'
import { FACE_VIEW as VIEW, SLOT_RADIUS } from '../src/game/clockFace.ts'

export const tile = (page: Page, n: number) => page.locator(`.tray [data-number="${n}"]`)
export const slot = (page: Page, n: number) => page.locator(`[data-slot="${n}"]`)

/** Presses on the tray tile, slides it over the face and lets go on the slot. */
export async function dragNumber(page: Page, number: number, onto: number) {
  const from = (await tile(page, number).boundingBox())!
  const face = (await page.locator('svg.number-face').boundingBox())!
  const scale = face.width / VIEW
  const rad = (onto * 30 * Math.PI) / 180
  const to = {
    x: face.x + face.width / 2 + SLOT_RADIUS * scale * Math.sin(rad),
    y: face.y + face.height / 2 - SLOT_RADIUS * scale * Math.cos(rad),
  }
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 8 })
  await page.mouse.up()
}

/** Taps the tray tile, then the slot. */
export async function tapNumber(page: Page, number: number, onto: number) {
  await tile(page, number).click()
  await slot(page, onto).click()
}
