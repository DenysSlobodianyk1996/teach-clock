/**
 * Round: one playthrough of a Game in a Mode. Every action returns a new Round plus an outcome;
 * the Round passed in is never changed. Plain TypeScript, no Vue.
 */
import { sameClockTime, type ClockTime } from './clockTime'
import { hasLevel, taskCount, type Settings } from './settings'
import { generateClockTimes, type Random } from './tasks'

/** `helped` (Teach only) arrives with ticket 04. */
export type TaskStatus = 'pending' | 'right' | 'wrong'

export interface Task {
  /** The correct Answer. */
  readonly answer: ClockTime
  readonly firstAnswer: ClockTime | null
  readonly status: TaskStatus
}

export interface Round {
  readonly game: Settings['game']
  readonly mode: Settings['mode']
  readonly level: Settings['level'] | null
  readonly tasks: readonly Task[]
  /** Index of the Task being played; equals `tasks.length` once the Round is finished. */
  readonly current: number
}

export interface Outcome {
  right: boolean
  finished: boolean
}

export function startRound({ game, mode, level }: Settings, random: Random): Round {
  // Drag Numbers gets its own Tasks (numbers, not Clock Times) in ticket 07.
  const tasks = generateClockTimes(level, taskCount(game), random).map((answer): Task => ({
    answer,
    firstAnswer: null,
    status: 'pending',
  }))
  return { game, mode, level: hasLevel(game) ? level : null, tasks, current: 0 }
}

export function isFinished(round: Round): boolean {
  return round.current >= round.tasks.length
}

export function currentTask(round: Round): Task | null {
  return round.tasks[round.current] ?? null
}

/** Marks the current Task right or wrong and moves on. Teach's "stay and fix it" comes with ticket 04. */
export function submitAnswer(round: Round, time: ClockTime): { round: Round; outcome: Outcome } {
  const task = currentTask(round)
  if (!task) throw new Error('The Round is already finished')
  const right = sameClockTime(task.answer, time)
  const tasks = round.tasks.map((t, i): Task =>
    i === round.current ? { ...t, firstAnswer: time, status: right ? 'right' : 'wrong' } : t,
  )
  const next = { ...round, tasks, current: round.current + 1 }
  return { round: next, outcome: { right, finished: isFinished(next) } }
}
