/** Summary of a finished Round. Plain TypeScript, no Vue. */
import type { ClockTime } from './clockTime'
import { isFinished, type Round } from './round'

export interface WrongTask {
  answer: ClockTime
  firstAnswer: ClockTime
}

export interface Summary {
  rightCount: number
  total: number
  right: ClockTime[]
  wrong: WrongTask[]
}

export function summarize(round: Round): Summary {
  if (!isFinished(round)) throw new Error('The Round is not finished')
  const right: ClockTime[] = []
  const wrong: WrongTask[] = []
  for (const { answer, firstAnswer, status } of round.tasks) {
    if (status === 'right') right.push(answer)
    else wrong.push({ answer, firstAnswer: firstAnswer! })
  }
  return { rightCount: right.length, total: round.tasks.length, right, wrong }
}
