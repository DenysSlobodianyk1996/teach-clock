/** Where things sit on the clock face, in SVG units around the centre (y grows downwards). Plain TypeScript. */

import { mod } from './clockTime.ts'

/** The point at `radius` from the centre in the direction of `angle` (degrees, 0° at 12, clockwise). */
export function pointAt(angle: number, radius: number): { x: number; y: number } {
  const rad = (angle * Math.PI) / 180
  const round = (v: number) => Math.round(v * 10) / 10 || 0
  return { x: round(radius * Math.sin(rad)), y: round(-radius * Math.cos(rad)) }
}

/** The numbers 1–12 at their places, each 30° apart. */
export function numberPositions(radius: number): { n: number; x: number; y: number }[] {
  return Array.from({ length: 12 }, (_, i) => ({ n: i + 1, ...pointAt((i + 1) * 30, radius) }))
}

/** The direction of the point (x, y) from the centre, in degrees 0–360: 0° at 12, clockwise. */
export function angleAt(x: number, y: number): number {
  const angle = (Math.atan2(x, -y) * 180) / Math.PI
  return angle < 0 ? angle + 360 : angle
}

/**
 * The places the hands point to, lit up in Set Time and Drag Arrows: the minute tick (0–59) nearest
 * the Minute Hand, and the number (1–12) of the hour the Hour Hand has passed, so 2:55 lights the 2
 * and 12:40 the 12. Takes hand angles, which may be wound past a full turn.
 */
export function pointedPlace(angles: { hour: number; minute: number }): {
  tick: number
  number: number
} {
  const tick = mod(Math.round(angles.minute / 6), 60)
  const hour = Math.floor(mod(angles.hour, 360) / 30)
  return { tick, number: hour === 0 ? 12 : hour }
}

/** The Drag Numbers face's viewBox is this many units across. */
export const FACE_VIEW = 220

/** Where the number slots sit, and how near (in clock units) a dropped tile must land to take one. */
export const SLOT_RADIUS = 66
const SLOT_REACH = 26

/** The Drag Numbers slot under the point (x, y), or null when none is close enough. */
export function slotAt(x: number, y: number): number | null {
  let best: { n: number; distance: number } | null = null
  for (const { n, ...p } of numberPositions(SLOT_RADIUS)) {
    const distance = Math.hypot(x - p.x, y - p.y)
    if (distance <= SLOT_REACH && (!best || distance < best.distance)) best = { n, distance }
  }
  return best?.n ?? null
}
