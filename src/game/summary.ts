/** Summary of a finished Round. Plain TypeScript, no Vue. */
import type { ClockTime } from './clockTime'
import {
  isFinished,
  type ClockGame,
  type ClockRound,
  type NumbersGame,
  type NumbersRound,
  type Round,
  type Task,
  type TaskStatus,
} from './round'
import { LEVELS, type Level, type Mode } from './settings'

/** A Task that was wrong or helped: its correct Answer and the Player's first one. */
export interface WrongTask<A = ClockTime> {
  answer: A
  firstAnswer: A
}

interface Grouped<A> {
  mode: Mode
  /** Every Task's status in order, for the progress dots. */
  statuses: TaskStatus[]
  /** A perfect Round's nudge: the next smaller Level, or null when there is none. Null otherwise. */
  nudge: { level: Level | null } | null
  rightCount: number
  total: number
  right: A[]
  /** Wrong and helped Tasks. */
  wrong: WrongTask<A>[]
}

export interface ClockSummary extends Grouped<ClockTime> {
  game: ClockGame
  level: Level
}

/** Drag Hours: Answers are slots, and the face as the Player left it. */
export interface NumbersSummary extends Grouped<number> {
  game: NumbersGame
  level: null
  /** What each slot held at the end: index N−1 is the slot where N belongs. */
  placements: (number | null)[]
}

export type Summary = ClockSummary | NumbersSummary

export function summarize(round: ClockRound): ClockSummary
export function summarize(round: NumbersRound): NumbersSummary
export function summarize(round: Round): Summary
export function summarize(round: Round): Summary {
  if (!isFinished(round)) throw new Error('The Round is not finished')
  if (round.game === 'dragHours') {
    return { game: round.game, level: null, ...group(round), placements: [...round.slots] }
  }
  return { game: round.game, level: round.level, ...group(round) }
}

/** The next smaller Level (15 → 5 → 1), or null at 1 minute and for Drag Hours. */
function smallerLevel(level: Level | null): Level | null {
  if (level === null) return null
  const smaller = LEVELS.filter((step) => step < level)
  return smaller.length ? (Math.max(...smaller) as Level) : null
}

function group<A>(round: {
  mode: Mode
  level: Level | null
  tasks: readonly Task<A>[]
}): Grouped<A> {
  const { tasks } = round
  const right: A[] = []
  const wrong: WrongTask<A>[] = []
  for (const { answer, firstAnswer, status } of tasks) {
    if (status === 'right') right.push(answer)
    else wrong.push({ answer, firstAnswer: firstAnswer! })
  }
  return {
    mode: round.mode,
    statuses: tasks.map((t) => t.status),
    nudge: wrong.length ? null : { level: smallerLevel(round.level) },
    rightCount: right.length,
    total: tasks.length,
    right,
    wrong,
  }
}
