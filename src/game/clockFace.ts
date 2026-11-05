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
