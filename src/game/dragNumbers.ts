/**
 * Drag Numbers: the Player puts the numbers 1–12 on an empty clock face. Every action returns a
 * new Round plus an outcome; the Round passed in is never changed. Plain TypeScript, no Vue.
 */
import { isFinished, type NumbersRound, type TaskStatus } from './round'

/** "N goes between `before` and `after`", wrapping round the top: 12 sits between 11 and 1. */
export interface Neighbours {
  number: number
  before: number
  after: number
}

export function neighbours(number: number): Neighbours {
  return { number, before: ((number + 10) % 12) + 1, after: (number % 12) + 1 }
}

export interface DropOutcome {
  /** The number is now on the slot. */
  placed: boolean
  /** Teach, after a wrong drop: where the number goes. */
  hint: Neighbours | null
  finished: boolean
}

/**
 * Drops a number on a slot.
 * - Teach: only from the tray, and only the right slot takes it. A wrong drop leaves the number on
 *   the tray with the neighbour hint, and the number ends as helped. A drop on a filled slot is
 *   ignored.
 * - Test: any number (from the tray or the face) on any slot, with no feedback. A number already
 *   on the slot swaps places with it, or goes back to the tray if the dropped one came from there.
 */
export function dropNumber(
  round: NumbersRound,
  number: number,
  slot: number,
): { round: NumbersRound; outcome: DropOutcome } {
  if (round.mode === 'test') return { round: moveFreely(round, number, slot), outcome: PLACED }
  if (round.slots[slot - 1] !== null || !round.tray.includes(number)) {
    return { round, outcome: { placed: false, hint: null, finished: isFinished(round) } }
  }
  const task = round.tasks[number - 1]!
  const right = slot === task.answer
  const status: TaskStatus = right ? (task.firstAnswer ? 'helped' : 'right') : 'pending'
  const tasks = round.tasks.map((t, i) =>
    i === number - 1 ? { ...t, firstAnswer: t.firstAnswer ?? slot, status } : t,
  )
  if (!right) {
    return {
      round: { ...round, tasks },
      outcome: { placed: false, hint: neighbours(number), finished: false },
    }
  }
  const next: NumbersRound = {
    ...round,
    tasks,
    slots: round.slots.map((s, i) => (i === slot - 1 ? number : s)),
    tray: round.tray.filter((n) => n !== number),
  }
  return { round: next, outcome: { placed: true, hint: null, finished: isFinished(next) } }
}

const PLACED: DropOutcome = { placed: true, hint: null, finished: false }

function moveFreely(round: NumbersRound, number: number, slot: number): NumbersRound {
  if (round.submitted) throw new Error('The Round is already finished')
  const known = round.tray.includes(number) || round.slots.includes(number)
  if (!known || !Number.isInteger(slot) || slot < 1 || slot > round.slots.length) return round
  const from = round.slots.indexOf(number) + 1 // 0 when on the tray
  const there = round.slots[slot - 1] ?? null
  if (from === slot) return round
  const slots = round.slots.map((n, i) => {
    if (i === slot - 1) return number
    if (i === from - 1) return there
    return n
  })
  // A tray number takes the place in the tray of the one it pushed off the face.
  let tray = [...round.tray]
  if (!from)
    tray =
      there === null
        ? tray.filter((n) => n !== number)
        : tray.map((n) => (n === number ? there : n))
  return { ...round, slots, tray }
}

/** Test: takes a placed number off the face, back to the end of the tray. */
export function returnToTray(round: NumbersRound, number: number): NumbersRound {
  if (round.mode !== 'test' || round.submitted) throw new Error('Only Test can take numbers back')
  const from = round.slots.indexOf(number)
  if (from < 0) return round
  return {
    ...round,
    slots: round.slots.map((n, i) => (i === from ? null : n)),
    tray: [...round.tray, number],
  }
}

/** Test: Submit is allowed once all 12 slots are filled. */
export function canSubmit(round: NumbersRound): boolean {
  return round.mode === 'test' && !round.submitted && round.slots.every((n) => n !== null)
}

/** Test: scores each number by the slot it ended on, its Answer, and finishes the Round. */
export function submitPlacements(round: NumbersRound): {
  round: NumbersRound
  outcome: DropOutcome
} {
  if (!canSubmit(round)) throw new Error('Submit needs a Test Round with all 12 slots filled')
  const tasks = round.tasks.map((t) => {
    const slot = round.slots.indexOf(t.answer) + 1
    return {
      ...t,
      firstAnswer: slot,
      status: slot === t.answer ? ('right' as const) : ('wrong' as const),
    }
  })
  return { round: { ...round, tasks, submitted: true }, outcome: { ...PLACED, finished: true } }
}
