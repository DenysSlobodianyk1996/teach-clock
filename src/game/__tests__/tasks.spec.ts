import { describe, expect, it } from 'vitest'
import { LEVELS } from '../settings'
import { formatClockTime } from '../clockTime'
import { generateClockTimes, seededRandom, shuffledNumbers } from '../tasks'

describe('shuffledNumbers', () => {
  it('never leaves the tray in order, even with a stuck random source', () => {
    for (const stuck of [0, 0.5, 0.99]) {
      const tray = shuffledNumbers(() => stuck)
      expect([...tray].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      expect(tray).not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    }
  })
})

describe('Task generation', () => {
  it.each(LEVELS)('gives 10 unique Clock Times on the %i-minute step', (level) => {
    const times = generateClockTimes('setTime', level, 10, seededRandom(level))
    expect(times).toHaveLength(10)
    expect(new Set(times.map(formatClockTime)).size).toBe(10)
    for (const { hour, minute } of times) {
      expect(hour).toBeGreaterThanOrEqual(1)
      expect(hour).toBeLessThanOrEqual(12)
      expect(minute % level).toBe(0)
    }
  })

  it('uses only :00, :15, :30 and :45 on the 15-minute step', () => {
    const minutes = new Set(
      generateClockTimes('setTime', 15, 10, seededRandom(1)).map((t) => t.minute),
    )
    expect([...minutes].every((m) => [0, 15, 30, 45].includes(m))).toBe(true)
  })

  it('refuses to make more Clock Times than the step allows', () => {
    expect(() => generateClockTimes('setTime', 15, 49, seededRandom(1))).toThrow(
      'Only 48 Clock Times',
    )
  })

  it('gives the same Clock Times for the same random source', () => {
    const a = generateClockTimes('setTime', 5, 10, seededRandom(42)).map(formatClockTime)
    const b = generateClockTimes('setTime', 5, 10, seededRandom(42)).map(formatClockTime)
    const c = generateClockTimes('setTime', 5, 10, seededRandom(43)).map(formatClockTime)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('never uses 12:00 in Drag Arrows, where the hands start at 12:00', () => {
    // All 48 Clock Times on the 15-minute step but one: only 12:00 is left out.
    const times = generateClockTimes('dragArrows', 15, 47, seededRandom(7)).map(formatClockTime)
    expect(times).toHaveLength(47)
    expect(times).not.toContain('12:00')
    expect(() => generateClockTimes('dragArrows', 15, 48, seededRandom(7))).toThrow(
      'Only 47 Clock Times',
    )
  })

  it('may use 12:00 in Set Time', () => {
    const times = generateClockTimes('setTime', 15, 48, seededRandom(7)).map(formatClockTime)
    expect(times).toContain('12:00')
  })
})
