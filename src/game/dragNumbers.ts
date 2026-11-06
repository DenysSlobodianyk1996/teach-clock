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
 * Drops a number from the tray on a slot. In Teach only the right slot takes it: a wrong drop
 * leaves it on the tray and gives the neighbour hint, and the number ends as helped. A drop on a
 * filled slot is ignored.
 */
export function dropNumber(
  round: NumbersRound,
  number: number,
  slot: number,
): { round: NumbersRound; outcome: DropOutcome } {
  if (round.mode !== 'teach') throw new Error('Drag Numbers in Test is not built yet')
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
