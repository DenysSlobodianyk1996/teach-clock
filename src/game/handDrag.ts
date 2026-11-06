/**
 * Hand dragging in Drag Arrows. One Clock Time drives both hands, so a drag returns a new
 * Clock Time and the hands are drawn from it. Angles are degrees, 0° at 12, clockwise. Plain TypeScript.
 */
import { clockTime, type ClockTime } from './clockTime'
import type { Level } from './settings'

const mod = (n: number, m: number) => ((n % m) + m) % m

/** Wraps any whole hour into 1–12 (0 becomes 12). */
const wrapHour = (hour: number) => mod(hour - 1, 12) + 1

/**
 * Minute Hand drag: the pointer's minute is snapped to the Level step. The hand moves the shorter
 * way round from the previous minute, so passing 12 clockwise rolls the hour forward and
 * anticlockwise rolls it back.
 */
export function dragMinuteHand(time: ClockTime, pointerAngle: number, step: Level): ClockTime {
  const pointerMinute = mod(pointerAngle, 360) / 6
  // The shorter way from the previous minute to the pointer, in (−30, 30].
  const delta = 30 - mod(30 - (pointerMinute - time.minute), 60)
  const snapped = Math.round((time.minute + delta) / step) * step
  return clockTime(wrapHour(time.hour + Math.floor(snapped / 60)), mod(snapped, 60))
}

/**
 * Hour Hand drag: only the hour changes. With minutes `m`, hour `h` is drawn at `h × 30° + m × 0.5°`;
 * the new hour is the one drawn nearest the pointer. `Math.round` sends an exact tie to the later hour.
 */
export function dragHourHand(time: ClockTime, pointerAngle: number): ClockTime {
  const nearest = Math.round((mod(pointerAngle, 360) - time.minute * 0.5) / 30)
  return clockTime(wrapHour(nearest), time.minute)
}
