import { describe, expect, it } from 'vitest'
import { LEVELS } from '../settings'
import { formatClockTime } from '../clockTime'
import { generateClockTimes, seededRandom } from '../tasks'

describe('Task generation', () => {
  it.each(LEVELS)('gives 10 unique Clock Times on the %i-minute step', (level) => {
    const times = generateClockTimes(level, 10, seededRandom(level))
    expect(times).toHaveLength(10)
    expect(new Set(times.map(formatClockTime)).size).toBe(10)
    for (const { hour, minute } of times) {
      expect(hour).toBeGreaterThanOrEqual(1)
      expect(hour).toBeLessThanOrEqual(12)
      expect(minute % level).toBe(0)
    }
  })

  it('uses only :00 and :30 on the 30-minute step', () => {
    const minutes = new Set(generateClockTimes(30, 10, seededRandom(1)).map((t) => t.minute))
    expect([...minutes].every((m) => m === 0 || m === 30)).toBe(true)
  })

  it('refuses to make more Clock Times than the step allows', () => {
    expect(() => generateClockTimes(30, 25, seededRandom(1))).toThrow('Only 24 Clock Times')
  })

  it('gives the same Clock Times for the same random source', () => {
    const a = generateClockTimes(5, 10, seededRandom(42)).map(formatClockTime)
    const b = generateClockTimes(5, 10, seededRandom(42)).map(formatClockTime)
    const c = generateClockTimes(5, 10, seededRandom(43)).map(formatClockTime)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })
})
