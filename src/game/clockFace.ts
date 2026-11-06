/** Where things sit on the clock face, in SVG units around the centre (y grows downwards). Plain TypeScript. */

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
