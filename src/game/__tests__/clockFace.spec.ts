import { describe, expect, it } from 'vitest'
import { numberPositions } from '../clockFace'

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
