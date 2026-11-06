/**
 * Round: one playthrough of a Game in a Mode. Every action returns a new Round plus an outcome;
 * the Round passed in is never changed. Plain TypeScript, no Vue.
 */
import { sameClockTime, type ClockTime } from './clockTime'
import { hasLevel, taskCount, type Settings } from './settings'
import { generateClockTimes, type Random } from './tasks'

/** `helped`: right only after a wrong try in Teach. It counts as wrong in the Summary. */
export type TaskStatus = 'pending' | 'right' | 'helped' | 'wrong'

export interface Task {
  /** The correct Answer. */
  readonly answer: ClockTime
  /** Set on the first submit. In Teach it is set while the Task is still pending after a wrong try. */
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
  /** False only for a wrong Answer in Teach: the Player stays on the Task and fixes it. */
  movedOn: boolean
  finished: boolean
}

export function startRound({ game, mode, level }: Settings, random: Random): Round {
  // Drag Numbers gets its own Tasks (numbers, not Clock Times) in ticket 07.
  const tasks = generateClockTimes(game, level, taskCount(game), random).map((answer): Task => ({
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

/**
 * Checks an Answer to the current Task. A right Answer moves on. A wrong one moves on in Test;
 * in Teach the Player stays on the Task until they get it right, and the Task ends as helped.
 */
export function submitAnswer(round: Round, time: ClockTime): { round: Round; outcome: Outcome } {
  const task = currentTask(round)
  if (!task) throw new Error('The Round is already finished')
  const right = sameClockTime(task.answer, time)
  let status: TaskStatus
  if (right) status = task.firstAnswer ? 'helped' : 'right'
  else status = round.mode === 'teach' ? 'pending' : 'wrong'
  const stays = status === 'pending'
  const tasks = round.tasks.map((t, i): Task =>
    i === round.current ? { ...t, firstAnswer: task.firstAnswer ?? time, status } : t,
  )
  const next = { ...round, tasks, current: stays ? round.current : round.current + 1 }
  return { round: next, outcome: { right, movedOn: !stays, finished: isFinished(next) } }
}

/** The Hint: the correct Answer, given in Teach once the Player has made a wrong try at the current Task. */
export function hint(round: Round): ClockTime | null {
  const task = currentTask(round)
  return round.mode === 'teach' && task?.firstAnswer ? task.answer : null
}
