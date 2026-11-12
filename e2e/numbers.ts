/** Moving Drag Hours tiles onto the empty clock face, with a real mouse or by tapping. */
import type { Page } from '@playwright/test'
import { FACE_VIEW as VIEW, numberPositions, SLOT_RADIUS } from '../src/game/clockFace.ts'

const SLOTS = numberPositions(SLOT_RADIUS)

export const tile = (page: Page, n: number) => page.locator(`.tray [data-number="${n}"]`)
export const slot = (page: Page, n: number) => page.locator(`[data-slot="${n}"]`)

/** The page point at the centre of a slot. */
async function slotPoint(page: Page, n: number) {
  const face = (await page.locator('svg.number-face').boundingBox())!
  const scale = face.width / VIEW
  const { x, y } = SLOTS[n - 1]!
  return { x: face.x + face.width / 2 + x * scale, y: face.y + face.height / 2 + y * scale }
}

/** Presses on the tray tile, slides it over the face and lets go on the slot. */
export async function dragNumber(page: Page, number: number, onto: number) {
  const from = (await tile(page, number).boundingBox())!
  await slide(page, { x: from.x + from.width / 2, y: from.y + from.height / 2 }, onto)
}

/** Test: presses on the number on slot `from` and lets go on slot `onto`. */
export async function dragPlaced(page: Page, from: number, onto: number) {
  await slide(page, await slotPoint(page, from), onto)
}

async function slide(page: Page, from: { x: number; y: number }, onto: number) {
  const to = await slotPoint(page, onto)
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 8 })
  await page.mouse.up()
}

/** Taps the tray tile, then the slot. */
export async function tapNumber(page: Page, number: number, onto: number) {
  await tile(page, number).click()
  await slot(page, onto).click()
}
