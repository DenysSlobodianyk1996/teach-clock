import { describe, expect, it } from 'vitest'
import { clockTime, formatClockTime, handAngles, minutesBetween, sameClockTime } from '../clockTime'

describe('Clock Time', () => {
  it('formats as H:MM with two-digit minutes', () => {
    expect(formatClockTime(clockTime(4, 5))).toBe('4:05')
    expect(formatClockTime(clockTime(12, 30))).toBe('12:30')
    expect(formatClockTime(clockTime(7, 0))).toBe('7:00')
  })

  it('rejects hours outside 1–12 and minutes outside 0–59', () => {
    expect(() => clockTime(0, 0)).toThrow('Not a Clock Time')
    expect(() => clockTime(13, 0)).toThrow('Not a Clock Time')
    expect(() => clockTime(1, 60)).toThrow('Not a Clock Time')
    expect(() => clockTime(1.5, 0)).toThrow('Not a Clock Time')
  })

  it('points the Minute Hand 6° per minute from 12', () => {
    expect(handAngles(clockTime(3, 0)).minute).toBe(0)
    expect(handAngles(clockTime(3, 15)).minute).toBe(90)
    expect(handAngles(clockTime(3, 45)).minute).toBe(270)
  })

  it('creeps the Hour Hand between numbers as minutes pass', () => {
    expect(handAngles(clockTime(12, 0)).hour).toBe(0)
    expect(handAngles(clockTime(3, 0)).hour).toBe(90)
    expect(handAngles(clockTime(1, 30)).hour).toBe(45)
    expect(handAngles(clockTime(7, 45)).hour).toBe(232.5)
  })

  it('compares Clock Times by hour and minute', () => {
    expect(sameClockTime(clockTime(4, 15), clockTime(4, 15))).toBe(true)
    expect(sameClockTime(clockTime(4, 15), clockTime(3, 15))).toBe(false)
    expect(sameClockTime(clockTime(4, 15), clockTime(4, 16))).toBe(false)
  })
})

describe('minutesBetween', () => {
  it.each<[string, string, number]>([
    ['3:00', '3:00', 0],
    ['12:00', '3:45', 225],
    ['11:55', '12:05', 10],
    ['12:05', '11:55', -10],
    ['12:00', '6:30', -330],
    ['12:00', '6:00', 360],
    ['6:00', '12:00', 360],
  ])('winds a clock from %s to %s the shorter way: %i minutes', (from, to, minutes) => {
    const parse = (s: string) => clockTime(...(s.split(':').map(Number) as [number, number]))
    expect(minutesBetween(parse(from), parse(to))).toBe(minutes)
  })
})
