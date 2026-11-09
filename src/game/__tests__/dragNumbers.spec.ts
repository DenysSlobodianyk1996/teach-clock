import { describe, expect, it } from 'vitest'
import { canSubmit, dropNumber, neighbours, returnToTray, submitPlacements } from '../dragNumbers'
import type { NumbersRound } from '../round'
import { isFinished, startRound } from '../round'
import { summarize } from '../summary'
import { seededRandom } from '../tasks'

const TEACH = { game: 'dragNumbers', mode: 'teach', level: 15 } as const
const TEST = { ...TEACH, mode: 'test' } as const
const ONE_TO_TWELVE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

describe('Drag Numbers neighbour hint', () => {
  it('names the numbers either side', () => {
    expect(neighbours(7)).toEqual({ number: 7, before: 6, after: 8 })
  })

  it('wraps around the top of the clock', () => {
    expect(neighbours(12)).toEqual({ number: 12, before: 11, after: 1 })
    expect(neighbours(1)).toEqual({ number: 1, before: 12, after: 2 })
  })
})

describe('Drag Numbers Round', () => {
  it('starts with 12 empty slots, a shuffled tray of 1–12 and 12 pending Tasks', () => {
    const round = startRound(TEACH, seededRandom(1))
    expect(round.slots).toEqual(Array(12).fill(null))
    expect([...round.tray].sort((a, b) => a - b)).toEqual(ONE_TO_TWELVE)
    expect(round.tray).not.toEqual(ONE_TO_TWELVE)
    expect(round.tasks.map((t) => t.answer)).toEqual(ONE_TO_TWELVE)
    expect(round.tasks.every((t) => t.status === 'pending')).toBe(true)
    expect(isFinished(round)).toBe(false)
  })

  it('shuffles the tray differently for different random sources', () => {
    expect(startRound(TEACH, seededRandom(1)).tray).not.toEqual(
      startRound(TEACH, seededRandom(2)).tray,
    )
  })
})

describe('Drag Numbers in Teach', () => {
  it('locks a number dropped on its own slot and takes it off the tray', () => {
    const round = startRound(TEACH, seededRandom(1))
    const { round: next, outcome } = dropNumber(round, 7, 7)
    expect(outcome).toEqual({ placed: true, hint: null, finished: false })
    expect(next.slots[6]).toBe(7)
    expect(next.tray).not.toContain(7)
    expect(next.tasks[6]).toMatchObject({ status: 'right', firstAnswer: 7 })
  })

  it('sends a wrong drop back to the tray with the neighbour hint', () => {
    const round = startRound(TEACH, seededRandom(1))
    const { round: next, outcome } = dropNumber(round, 7, 4)
    expect(outcome).toEqual({
      placed: false,
      hint: { number: 7, before: 6, after: 8 },
      finished: false,
    })
    expect(next.slots).toEqual(round.slots)
    expect(next.tray).toEqual(round.tray)
    expect(next.tasks[6]).toMatchObject({ status: 'pending', firstAnswer: 4 })
  })

  it('counts a number placed after a wrong drop as helped, keeping the first slot tried', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 12, 3).round
    round = dropNumber(round, 12, 6).round
    round = dropNumber(round, 12, 12).round
    expect(round.tasks[11]).toMatchObject({ status: 'helped', firstAnswer: 3 })
  })

  it('ignores a drop on a slot that is already filled', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 5, 5).round
    const { round: next, outcome } = dropNumber(round, 6, 5)
    expect(outcome).toEqual({ placed: false, hint: null, finished: false })
    expect(next).toBe(round)
  })

  it('finishes the Round when all 12 are placed', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 2, 9).round
    for (const n of ONE_TO_TWELVE.slice(0, 11)) round = dropNumber(round, n, n).round
    expect(isFinished(round)).toBe(false)
    const { round: done, outcome } = dropNumber(round, 12, 12)
    expect(outcome).toEqual({ placed: true, hint: null, finished: true })
    expect(isFinished(done)).toBe(true)
    expect(done.tray).toEqual([])
    expect(done.tasks.map((t) => t.status)).toEqual(
      ONE_TO_TWELVE.map((n) => (n === 2 ? 'helped' : 'right')),
    )
  })

  it('does not change the Round it was given', () => {
    const round = startRound(TEACH, seededRandom(1))
    const copy = structuredClone(round)
    dropNumber(round, 7, 4)
    dropNumber(round, 7, 7)
    expect(round).toEqual(copy)
  })
})

/** Puts number N on slot `slotOf(N)` for every number. */
function placeAll(round: NumbersRound, slotOf: (n: number) => number): NumbersRound {
  for (const n of ONE_TO_TWELVE) round = dropNumber(round, n, slotOf(n)).round
  return round
}

describe('Drag Numbers in Test', () => {
  it('takes any number on any slot, with no feedback', () => {
    const round = startRound(TEST, seededRandom(1))
    const { round: next, outcome } = dropNumber(round, 7, 4)
    expect(outcome).toEqual({ placed: true, hint: null, finished: false })
    expect(next.slots[3]).toBe(7)
    expect(next.tray).not.toContain(7)
    expect(next.tasks[6]).toMatchObject({ status: 'pending', firstAnswer: null })
  })

  it('moves a placed number to a free slot', () => {
    let round = startRound(TEST, seededRandom(1))
    round = dropNumber(round, 7, 4).round
    round = dropNumber(round, 7, 9).round
    expect(round.slots[3]).toBeNull()
    expect(round.slots[8]).toBe(7)
  })

  it('swaps two placed numbers when one is dropped on the other', () => {
    let round = startRound(TEST, seededRandom(1))
    round = dropNumber(round, 7, 4).round
    round = dropNumber(round, 2, 9).round
    round = dropNumber(round, 7, 9).round
    expect(round.slots[8]).toBe(7)
    expect(round.slots[3]).toBe(2)
  })

  it('sends the number on a slot back to the tray when a tray number is dropped on it', () => {
    let round = startRound(TEST, seededRandom(1))
    round = dropNumber(round, 7, 4).round
    round = dropNumber(round, 2, 4).round
    expect(round.slots[3]).toBe(2)
    expect(round.tray).toContain(7)
    expect(round.tray).not.toContain(2)
  })

  it('takes a placed number back to the tray', () => {
    let round = startRound(TEST, seededRandom(1))
    round = dropNumber(round, 7, 4).round
    round = returnToTray(round, 7)
    expect(round.slots[3]).toBeNull()
    expect(round.tray).toContain(7)
    expect(round.tray).toHaveLength(12)
  })

  it('allows Submit only when all 12 slots are filled', () => {
    let round = startRound(TEST, seededRandom(1))
    for (const n of ONE_TO_TWELVE.slice(0, 11)) round = dropNumber(round, n, n).round
    expect(canSubmit(round)).toBe(false)
    expect(() => submitPlacements(round)).toThrow('Submit needs a Test Round')
    round = dropNumber(round, 12, 12).round
    expect(canSubmit(round)).toBe(true)
    expect(isFinished(round)).toBe(false)
  })

  it('scores each number by where it ended up, after any moves', () => {
    // 4 and 5 swapped; 9 tried on slot 1 first, then moved home.
    let round = startRound(TEST, seededRandom(1))
    round = dropNumber(round, 9, 1).round
    round = placeAll(round, (n) => (n === 4 ? 5 : n === 5 ? 4 : n))
    const { round: done, outcome } = submitPlacements(round)
    expect(outcome).toEqual({ placed: true, hint: null, finished: true })
    expect(isFinished(done)).toBe(true)
    expect(done.tasks.map((t) => t.status)).toEqual(
      ONE_TO_TWELVE.map((n) => (n === 4 || n === 5 ? 'wrong' : 'right')),
    )
    expect(done.tasks[3]).toMatchObject({ answer: 4, firstAnswer: 5 })
    expect(done.tasks[8]).toMatchObject({ answer: 9, firstAnswer: 9 })
  })

  it('ignores a drop on a slot that does not exist, or of a number that is not in play', () => {
    const round = startRound(TEST, seededRandom(1))
    expect(dropNumber(round, 7, 13).round).toBe(round)
    expect(dropNumber(round, 7, 0).round).toBe(round)
    expect(dropNumber(round, 13, 4).round).toBe(round)
  })

  it('does not let Teach use Test moves', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 7, 7).round
    expect(() => returnToTray(round, 7)).toThrow('Only Test can take numbers back')
    expect(() => submitPlacements(round)).toThrow('Submit needs a Test Round')
  })
})

describe('Drag Numbers Summary', () => {
  it('lists numbers placed first time as Right and helped ones as Wrong with the first slot tried', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 4, 5).round
    round = dropNumber(round, 9, 3).round
    for (const n of ONE_TO_TWELVE) round = dropNumber(round, n, n).round
    expect(summarize(round)).toEqual({
      game: 'dragNumbers',
      mode: 'teach',
      level: null,
      statuses: ONE_TO_TWELVE.map((n) => (n === 4 || n === 9 ? 'helped' : 'right')),
      nudge: null,
      rightCount: 10,
      total: 12,
      right: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12],
      wrong: [
        { answer: 4, firstAnswer: 5 },
        { answer: 9, firstAnswer: 3 },
      ],
      placements: ONE_TO_TWELVE,
    })
  })

  it('in Test, keeps the face as the Player left it', () => {
    const swapped = (n: number) => (n === 4 ? 5 : n === 5 ? 4 : n)
    const round = submitPlacements(placeAll(startRound(TEST, seededRandom(1)), swapped)).round
    const summary = summarize(round)
    expect(summary).toMatchObject({ mode: 'test', rightCount: 10, total: 12 })
    expect(summary.wrong).toEqual([
      { answer: 4, firstAnswer: 5 },
      { answer: 5, firstAnswer: 4 },
    ])
    expect(summary.placements).toEqual([1, 2, 3, 5, 4, 6, 7, 8, 9, 10, 11, 12])
  })

  it('has no smaller Level to suggest after a perfect Round', () => {
    let round = startRound(TEACH, seededRandom(1))
    for (const n of ONE_TO_TWELVE) round = dropNumber(round, n, n).round
    expect(summarize(round).nudge).toEqual({ level: null })
  })
})
