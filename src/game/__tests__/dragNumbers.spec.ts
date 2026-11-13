import { describe, expect, it } from 'vitest'
import {
  canSubmit,
  dropNumber,
  hasHourBadges,
  neighbours,
  placeForMe,
  returnToTray,
  submitPlacements,
  shownNeighbours,
  tileValue,
} from '../dragNumbers'
import type { NumbersRound } from '../round'
import { isFinished, startRound } from '../round'
import { summarize } from '../summary'
import { seededRandom } from '../tasks'

const TEACH = { game: 'dragHours', mode: 'teach', level: 15 } as const
const TEST = { ...TEACH, mode: 'test' } as const
const ONE_TO_TWELVE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

describe('Drag Hours tile value', () => {
  it('shows the hour of its slot', () => {
    expect([1, 6, 12].map((n) => tileValue('dragHours', n))).toEqual([1, 6, 12])
  })

  it('has no Hour Badges on its face', () => {
    expect(hasHourBadges('dragHours')).toBe(false)
  })
})

describe('Drag Minutes tile value', () => {
  it('has Hour Badges on its face', () => {
    expect(hasHourBadges('dragMinutes')).toBe(true)
  })

  it('shows the minutes of its slot: 5 at the 1, 30 at the 6, 60 at the top', () => {
    expect([1, 2, 6, 11, 12].map((n) => tileValue('dragMinutes', n))).toEqual([5, 10, 30, 55, 60])
  })

  it('says the hint in minutes, wrapping round the top', () => {
    expect(shownNeighbours('dragMinutes', neighbours(2))).toEqual({
      number: 10,
      before: 5,
      after: 15,
    })
    expect(shownNeighbours('dragMinutes', neighbours(12))).toEqual({
      number: 60,
      before: 55,
      after: 5,
    })
    expect(shownNeighbours('dragMinutes', neighbours(1))).toEqual({
      number: 5,
      before: 60,
      after: 10,
    })
  })
})

describe('Drag Minutes Round', () => {
  const MINUTES_TEACH = { game: 'dragMinutes', mode: 'teach', level: 5 } as const

  it('starts like Drag Hours: no Level, 12 empty slots and a shuffled tray of slot ids', () => {
    const round = startRound(MINUTES_TEACH, seededRandom(1))
    expect(round).toMatchObject({ game: 'dragMinutes', mode: 'teach', level: null })
    expect(round.slots).toEqual(Array(12).fill(null))
    expect([...round.tray].sort((a, b) => a - b)).toEqual(ONE_TO_TWELVE)
  })

  it('places a minute with Set correct answer after a wrong drop, as helped', () => {
    const round = startRound(MINUTES_TEACH, seededRandom(1))
    const wrongDrop = dropNumber(round, 2, 5)
    expect(wrongDrop.outcome.hint).toEqual(neighbours(2))
    const { round: next, outcome } = placeForMe(wrongDrop.round, 2)
    expect(outcome.placed).toBe(true)
    expect(next.slots[1]).toBe(2)
    expect(next.tasks[1]!.status).toBe('helped')
  })

  it('is summarised as a Drag Minutes Summary', () => {
    let round: NumbersRound = startRound(MINUTES_TEACH, seededRandom(1))
    for (const n of ONE_TO_TWELVE) round = dropNumber(round, n, n).round
    expect(summarize(round)).toMatchObject({ game: 'dragMinutes', level: null, rightCount: 12 })
  })
})

describe('Drag Minutes in Test', () => {
  const MINUTES_TEST = { game: 'dragMinutes', mode: 'test', level: 5 } as const

  it('moves minutes freely with no feedback, and scores each minute by its slot at Submit', () => {
    let round = startRound(MINUTES_TEST, seededRandom(1))
    // 60 tried where 20 goes: no hint, and it can be moved home later.
    const tried = dropNumber(round, 12, 4)
    expect(tried.outcome).toEqual({ placed: true, hint: null, finished: false })
    round = returnToTray(tried.round, 12)
    round = placeAll(round, (n) => (n === 6 ? 7 : n === 7 ? 6 : n))
    expect(canSubmit(round)).toBe(true)
    const summary = summarize(submitPlacements(round).round)
    expect(summary).toMatchObject({ game: 'dragMinutes', mode: 'test', rightCount: 10 })
    expect(summary.wrong).toEqual([
      { answer: 6, firstAnswer: 7 },
      { answer: 7, firstAnswer: 6 },
    ])
  })
})

describe('Drag Hours neighbour hint', () => {
  it('names the numbers either side', () => {
    expect(neighbours(7)).toEqual({ number: 7, before: 6, after: 8 })
  })

  it('wraps around the top of the clock', () => {
    expect(neighbours(12)).toEqual({ number: 12, before: 11, after: 1 })
    expect(neighbours(1)).toEqual({ number: 1, before: 12, after: 2 })
  })

  it('says the hint with the values the tiles show', () => {
    expect(shownNeighbours('dragHours', neighbours(12))).toEqual({
      number: 12,
      before: 11,
      after: 1,
    })
  })
})

describe('Drag Hours Round', () => {
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

describe('Drag Hours in Teach', () => {
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

describe('Drag Hours Set correct answer in Teach', () => {
  it('puts a hinted number on its own slot, and it stays helped', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 2, 9).round
    const { round: next, outcome } = placeForMe(round, 2)
    expect(outcome).toEqual({ placed: true, hint: null, finished: false })
    expect(next.slots[1]).toBe(2)
    expect(next.tray).not.toContain(2)
    expect(next.tasks[1]).toMatchObject({ status: 'helped', firstAnswer: 9 })
  })

  it('leaves a number with no wrong drop yet on the tray', () => {
    const round = startRound(TEACH, seededRandom(1))
    const { round: next, outcome } = placeForMe(round, 2)
    expect(outcome).toEqual({ placed: false, hint: null, finished: false })
    expect(next).toBe(round)
  })

  it('leaves a number that is already placed alone', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 2, 9).round
    round = dropNumber(round, 2, 2).round
    const { round: next, outcome } = placeForMe(round, 2)
    expect(outcome.placed).toBe(false)
    expect(next).toBe(round)
  })

  it('leaves the face alone when the right slot is somehow taken', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 2, 9).round
    round = { ...round, slots: round.slots.map((s, i) => (i === 1 ? 5 : s)) }
    const { round: next, outcome } = placeForMe(round, 2)
    expect(outcome.placed).toBe(false)
    expect(next).toBe(round)
  })

  it('refuses in Test', () => {
    const round = startRound(TEST, seededRandom(1))
    expect(() => placeForMe(round, 2)).toThrow('Only Teach')
  })

  it('finishes the Round when it places the last number', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 12, 3).round
    for (const n of ONE_TO_TWELVE.slice(0, 11)) round = dropNumber(round, n, n).round
    const { round: done, outcome } = placeForMe(round, 12)
    expect(outcome).toEqual({ placed: true, hint: null, finished: true })
    expect(isFinished(done)).toBe(true)
    expect(summarize(done).wrong).toEqual([{ answer: 12, firstAnswer: 3 }])
  })
})

/** Puts number N on slot `slotOf(N)` for every number. */
function placeAll(round: NumbersRound, slotOf: (n: number) => number): NumbersRound {
  for (const n of ONE_TO_TWELVE) round = dropNumber(round, n, slotOf(n)).round
  return round
}

describe('Drag Hours in Test', () => {
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

describe('Drag Hours Summary', () => {
  it('lists numbers placed first time as Right and helped ones as Wrong with the first slot tried', () => {
    let round = startRound(TEACH, seededRandom(1))
    round = dropNumber(round, 4, 5).round
    round = dropNumber(round, 9, 3).round
    for (const n of ONE_TO_TWELVE) round = dropNumber(round, n, n).round
    expect(summarize(round)).toEqual({
      game: 'dragHours',
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
