/** Summary of a finished Round. Plain TypeScript, no Vue. */
import type { ClockTime } from './clockTime'
import {
  isFinished,
  type ClockGame,
  type ClockRound,
  type NumbersRound,
  type Round,
  type Task,
} from './round'

/** A Task that was wrong or helped: its correct Answer and the Player's first one. */
export interface WrongTask<A = ClockTime> {
  answer: A
  firstAnswer: A
}

interface Grouped<A> {
  rightCount: number
  total: number
  right: A[]
  wrong: WrongTask<A>[]
}

export interface ClockSummary extends Grouped<ClockTime> {
  game: ClockGame
}

/** Drag Numbers: Answers are slots, and the face as the Player left it. */
export interface NumbersSummary extends Grouped<number> {
  game: 'dragNumbers'
  /** What each slot held at the end: index N−1 is the slot where N belongs. */
  placements: (number | null)[]
}

export type Summary = ClockSummary | NumbersSummary

export function summarize(round: ClockRound): ClockSummary
export function summarize(round: NumbersRound): NumbersSummary
export function summarize(round: Round): Summary
export function summarize(round: Round): Summary {
  if (!isFinished(round)) throw new Error('The Round is not finished')
  if (round.game === 'dragNumbers') {
    return { game: round.game, ...group(round.tasks), placements: [...round.slots] }
  }
  return { game: round.game, ...group(round.tasks) }
}

function group<A>(tasks: readonly Task<A>[]): Grouped<A> {
  const right: A[] = []
  const wrong: WrongTask<A>[] = []
  for (const { answer, firstAnswer, status } of tasks) {
    if (status === 'right') right.push(answer)
    else wrong.push({ answer, firstAnswer: firstAnswer! })
  }
  return { rightCount: right.length, total: tasks.length, right, wrong }
}
