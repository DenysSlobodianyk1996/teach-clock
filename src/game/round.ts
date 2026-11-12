/**
 * Round: one playthrough of a Game in a Mode. Every action returns a new Round plus an outcome;
 * the Round passed in is never changed. Plain TypeScript, no Vue.
 */
import { sameClockTime, type ClockTime } from './clockTime'
import { taskCount, type Game, type Settings } from './settings'
import { generateClockTimes, shuffledNumbers, type Random } from './tasks'

/** `helped`: right only after a wrong try in Teach. It counts as wrong in the Summary. */
export type TaskStatus = 'pending' | 'right' | 'helped' | 'wrong'

/**
 * A Task with its correct Answer: a Clock Time, or in Drag Hours the slot a number belongs on
 * (number N belongs on slot N).
 */
export interface Task<A = ClockTime> {
  readonly answer: A
  /**
   * The Player's first Answer, set on the first try. In Teach it is set while the Task is still
   * pending after a wrong try. In Drag Hours Test it is the slot the number is on at Submit:
   * moves before then are not Answers, so that is the first and only one.
   */
  readonly firstAnswer: A | null
  readonly status: TaskStatus
}

/** The Games where the Player drags numbers onto an empty face (widened as drag Games are added). */
export type NumbersGame = 'dragHours'

export type ClockGame = Exclude<Game, NumbersGame>

/** A Round of a Game played on Clock Times, one Task after another. */
export interface ClockRound {
  readonly game: ClockGame
  readonly mode: Settings['mode']
  readonly level: Settings['level']
  readonly tasks: readonly Task[]
  /** Index of the Task being played; equals `tasks.length` once the Round is finished. */
  readonly current: number
}

/** A Round of Drag Hours: one Task per number, all on the face at once. */
export interface NumbersRound {
  readonly game: NumbersGame
  readonly mode: Settings['mode']
  readonly level: null
  /** Task N−1 is the number N. */
  readonly tasks: readonly Task<number>[]
  /** What each slot holds: index N−1 is the slot where N belongs. */
  readonly slots: readonly (number | null)[]
  /** The numbers not on the face, in tray order. */
  readonly tray: readonly number[]
  /** Test: the Player pressed Submit. */
  readonly submitted: boolean
}

export type Round = ClockRound | NumbersRound

export interface Outcome {
  right: boolean
  /** False only for a wrong Answer in Teach: the Player stays on the Task and fixes it. */
  movedOn: boolean
  finished: boolean
}

export function startRound(settings: Settings & { game: ClockGame }, random: Random): ClockRound
export function startRound(settings: Settings & { game: NumbersGame }, random: Random): NumbersRound
export function startRound(settings: Settings, random: Random): Round
export function startRound({ game, mode, level }: Settings, random: Random): Round {
  if (game === 'dragHours') {
    const tasks = Array.from({ length: taskCount(game) }, (_, i): Task<number> => ({
      answer: i + 1,
      firstAnswer: null,
      status: 'pending',
    }))
    const slots = tasks.map(() => null)
    return {
      game,
      mode,
      level: null,
      tasks,
      slots,
      tray: shuffledNumbers(random),
      submitted: false,
    }
  }
  const tasks = generateClockTimes(game, level, taskCount(game), random).map((answer): Task => ({
    answer,
    firstAnswer: null,
    status: 'pending',
  }))
  return { game, mode, level, tasks, current: 0 }
}

export function isFinished(round: Round): boolean {
  if (round.game !== 'dragHours') return round.current >= round.tasks.length
  return round.mode === 'test' ? round.submitted : round.tasks.every((t) => t.status !== 'pending')
}

/** The Clock Time Task being played; none in Drag Hours, where every number is on screen. */
export function currentTask(round: Round): Task | null {
  return round.game === 'dragHours' ? null : (round.tasks[round.current] ?? null)
}

/**
 * Checks an Answer to the current Task. A right Answer moves on. A wrong one moves on in Test;
 * in Teach the Player stays on the Task until they get it right, and the Task ends as helped.
 */
export function submitAnswer(
  round: Round,
  time: ClockTime,
): { round: ClockRound; outcome: Outcome } {
  const task = currentTask(round)
  if (round.game === 'dragHours') throw new Error('Drag Hours has no Clock Time Answers')
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
