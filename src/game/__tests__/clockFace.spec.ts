import { describe, expect, it } from 'vitest'
import { angleAt, numberPositions, slotAt } from '../clockFace'

describe('clock face layout', () => {
  it('places 1–12 clockwise from the top at the given radius', () => {
    const positions = numberPositions(66)
    expect(positions.map((p) => p.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(positions[2]).toEqual({ n: 3, x: 66, y: 0 })
    expect(positions[5]).toEqual({ n: 6, x: 0, y: 66 })
    expect(positions[11]).toEqual({ n: 12, x: 0, y: -66 })
    expect(positions[0]).toEqual({ n: 1, x: 33, y: -57.2 })
  })
})

describe('angleAt', () => {
  it.each([
    [0, -10, 0],
    [10, -10, 45],
    [10, 0, 90],
    [0, 10, 180],
    [-10, 0, 270],
    [-5, -8.66, 330],
  ])('turns the point (%d, %d) into %i°, 0° at 12, clockwise', (x, y, angle) => {
    expect(angleAt(x, y)).toBeCloseTo(angle, 0)
  })
})

describe('slotAt', () => {
  it('finds the slot under a point near it', () => {
    expect(slotAt(0, -66)).toBe(12)
    expect(slotAt(66, 0)).toBe(3)
    expect(slotAt(-50, 40)).toBe(8)
  })

  it('finds no slot at the centre or outside the clock', () => {
    expect(slotAt(0, 0)).toBeNull()
    expect(slotAt(0, -130)).toBeNull()
  })
})
