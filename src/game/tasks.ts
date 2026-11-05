/** Task generation. The random source is passed in so Rounds can be reproduced. Plain TypeScript, no Vue. */
import { clockTime, type ClockTime } from './clockTime'
import type { Level } from './settings'

/** Returns a number in [0, 1), like Math.random. */
export type Random = () => number

/** `count` different Clock Times whose minutes are multiples of the Level step. */
export function generateClockTimes(level: Level, count: number, random: Random): ClockTime[] {
  const all: ClockTime[] = []
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += level) all.push(clockTime(hour, minute))
  }
  if (count > all.length) {
    throw new RangeError(`Only ${all.length} Clock Times on the ${level}-minute step, not ${count}`)
  }
  // Partial Fisher–Yates: shuffle only the first `count` places.
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(random() * (all.length - i))
    ;[all[i], all[j]] = [all[j]!, all[i]!]
  }
  return all.slice(0, count)
}

/** A small reproducible random source (mulberry32), for tests and replays. */
export function seededRandom(seed: number): Random {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
