import { describe, expect, it } from 'vitest'
import { clockTime, formatClockTime, type ClockTime } from '../clockTime'
import { dragHourHand, dragMinuteHand } from '../handDrag'
import type { Level } from '../settings'

/** Drags the Minute Hand through each pointer angle in turn, starting at `start`. */
function minuteDrag(start: ClockTime, angles: number[], step: Level): string {
  return formatClockTime(angles.reduce((time, a) => dragMinuteHand(time, a, step), start))
}

describe('Minute Hand drag', () => {
  it.each<[Level, number, string]>([
    [15, 40, '4:00'],
    [15, 100, '4:15'],
    [15, 170, '4:30'],
    [5, 100, '4:15'],
    [5, 112, '4:20'],
    [1, 100, '4:17'],
    [1, 103, '4:17'],
  ])('snaps to the %i-minute step (pointer at %i°)', (step, angle, expected) => {
    expect(formatClockTime(dragMinuteHand(clockTime(4, 0), angle, step))).toBe(expected)
  })

  it('rolls the hour forward when the hand passes 12 clockwise', () => {
    expect(minuteDrag(clockTime(4, 45), [330, 20, 90], 15)).toBe('5:15')
  })

  it('rolls the hour back when the hand passes 12 anticlockwise', () => {
    expect(minuteDrag(clockTime(5, 15), [30, 330, 300], 15)).toBe('4:45')
  })

  it('wraps between 12 and 1 both ways', () => {
    expect(minuteDrag(clockTime(12, 55), [10], 5)).toBe('1:00')
    expect(minuteDrag(clockTime(1, 0), [354], 1)).toBe('12:59')
  })

  it('does not roll over when the hand goes back the way it came', () => {
    expect(minuteDrag(clockTime(4, 45), [330, 20, 330, 270], 15)).toBe('4:45')
  })
})

describe('Hour Hand drag', () => {
  it.each<[string, number, string]>([
    ['3:00', 100, '3:00'],
    ['12:00', 200, '7:00'],
    ['4:45', 200, '6:45'],
    ['4:30', 30, '1:30'],
  ])('at %s, pointing at %i° picks the nearest drawn hour → %s', (start, angle, expected) => {
    const [h, m] = start.split(':').map(Number) as [number, number]
    expect(formatClockTime(dragHourHand(clockTime(h, m), angle))).toBe(expected)
  })

  it('gives an exact tie to the later hour', () => {
    // At :00 the hands for 3 and 4 sit at 90° and 120°.
    expect(formatClockTime(dragHourHand(clockTime(9, 0), 105))).toBe('4:00')
    // At :30 the hands for 11 and 12 sit at 345° and 15°.
    expect(formatClockTime(dragHourHand(clockTime(9, 30), 0))).toBe('12:30')
  })

  it('changes only the hour', () => {
    expect(dragHourHand(clockTime(2, 17), 300).minute).toBe(17)
  })

  it('shows 1:30 the same whichever hand is set first', () => {
    const hourFirst = dragMinuteHand(dragHourHand(clockTime(12, 0), 30), 180, 15)
    const minutesFirst = dragHourHand(dragMinuteHand(clockTime(12, 0), 180, 15), 45)
    expect(formatClockTime(hourFirst)).toBe('1:30')
    expect(formatClockTime(minutesFirst)).toBe('1:30')
  })
})
