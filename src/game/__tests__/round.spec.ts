import { describe, expect, it } from 'vitest'
import { clockTime, type ClockTime } from '../clockTime'
import { currentTask, hint, isFinished, startRound, submitAnswer, type ClockRound } from '../round'
import { summarize } from '../summary'
import { seededRandom } from '../tasks'
import type { Level } from '../settings'

const SET_TIME_TEST = { game: 'setTime', mode: 'test', level: 15 } as const

/** A Clock Time that is not the given one. */
function wrong(time: ClockTime): ClockTime {
  return clockTime((time.hour % 12) + 1, time.minute)
}

function answerAll(round: ClockRound, rightAt: (i: number) => boolean): ClockRound {
  for (let i = 0; !isFinished(round); i++) {
    const correct = currentTask(round)!.answer
    round = submitAnswer(round, rightAt(i) ? correct : wrong(correct)).round
  }
  return round
}

describe('Round', () => {
  it('starts on the first of 10 pending Tasks', () => {
    const round = startRound(SET_TIME_TEST, seededRandom(1))
    expect(round.tasks).toHaveLength(10)
    expect(round.current).toBe(0)
    expect(round.tasks.every((t) => t.status === 'pending' && t.firstAnswer === null)).toBe(true)
    expect(isFinished(round)).toBe(false)
  })

  it('keeps the Settings it started with, with no Level for Drag Numbers', () => {
    expect(startRound(SET_TIME_TEST, seededRandom(1))).toMatchObject(SET_TIME_TEST)
    const dragNumbers = startRound(
      { game: 'dragNumbers', mode: 'teach', level: 5 },
      seededRandom(1),
    )
    expect(dragNumbers.level).toBeNull()
    expect(dragNumbers.tasks).toHaveLength(12)
  })

  it('records a right Answer and moves on', () => {
    const round = startRound(SET_TIME_TEST, seededRandom(1))
    const answer = currentTask(round)!.answer
    const { round: next, outcome } = submitAnswer(round, answer)
    expect(outcome).toEqual({ right: true, movedOn: true, finished: false })
    expect(next.tasks[0]).toMatchObject({ status: 'right', firstAnswer: answer })
    expect(next.current).toBe(1)
  })

  it('in Test, records a wrong Answer and still moves on', () => {
    const round = startRound(SET_TIME_TEST, seededRandom(1))
    const answer = wrong(currentTask(round)!.answer)
    const { round: next, outcome } = submitAnswer(round, answer)
    expect(outcome).toEqual({ right: false, movedOn: true, finished: false })
    expect(next.tasks[0]).toMatchObject({ status: 'wrong', firstAnswer: answer })
    expect(next.current).toBe(1)
  })

  it('does not change the Round it was given', () => {
    const round = startRound(SET_TIME_TEST, seededRandom(1))
    submitAnswer(round, currentTask(round)!.answer)
    expect(round.current).toBe(0)
    expect(round.tasks[0]!.status).toBe('pending')
  })

  it('finishes after the 10th Answer', () => {
    let round = startRound(SET_TIME_TEST, seededRandom(1))
    let last
    for (let i = 0; i < 10; i++) {
      last = submitAnswer(round, currentTask(round)!.answer)
      round = last.round
    }
    expect(last!.outcome).toEqual({ right: true, movedOn: true, finished: true })
    expect(isFinished(round)).toBe(true)
    expect(currentTask(round)).toBeNull()
    expect(() => submitAnswer(round, clockTime(1, 0))).toThrow('already finished')
  })
})

const SET_TIME_TEACH = { game: 'setTime', mode: 'teach', level: 15 } as const

describe('Round in Teach', () => {
  it('stays on the Task after a wrong Answer and keeps it as the first Answer', () => {
    const round = startRound(SET_TIME_TEACH, seededRandom(1))
    const given = wrong(currentTask(round)!.answer)
    const { round: next, outcome } = submitAnswer(round, given)
    expect(outcome).toEqual({ right: false, movedOn: false, finished: false })
    expect(next.current).toBe(0)
    expect(next.tasks[0]).toMatchObject({ status: 'pending', firstAnswer: given })
  })

  it('wrong, then Hint, then help used, then right: the Task ends as helped', () => {
    let round = startRound(SET_TIME_TEACH, seededRandom(1))
    const correct = currentTask(round)!.answer
    expect(hint(round)).toBeNull()

    const firstTry = wrong(correct)
    round = submitAnswer(round, firstTry).round
    expect(hint(round)).toEqual(correct)

    // More wrong tries are allowed and do not replace the first Answer.
    round = submitAnswer(round, wrong(firstTry)).round
    expect(round.current).toBe(0)

    const { round: next, outcome } = submitAnswer(round, hint(round)!)
    expect(outcome).toEqual({ right: true, movedOn: true, finished: false })
    expect(next.tasks[0]).toMatchObject({ status: 'helped', firstAnswer: firstTry })
    expect(next.current).toBe(1)
    expect(hint(next)).toBeNull()
  })

  it('marks a right first try right', () => {
    const round = startRound(SET_TIME_TEACH, seededRandom(1))
    const { round: next } = submitAnswer(round, currentTask(round)!.answer)
    expect(next.tasks[0]!.status).toBe('right')
  })
})

describe('Round in Test', () => {
  it('never gives a Hint', () => {
    const round = startRound(SET_TIME_TEST, seededRandom(1))
    expect(hint(round)).toBeNull()
    const next = submitAnswer(round, wrong(currentTask(round)!.answer)).round
    expect(hint(next)).toBeNull()
  })
})

describe('Summary', () => {
  it('counts right Answers and lists right and wrong Tasks with the first Answer', () => {
    const round = answerAll(startRound(SET_TIME_TEST, seededRandom(7)), (i) => i % 3 !== 0)
    const summary = summarize(round)
    expect(summary.rightCount).toBe(6)
    expect(summary.total).toBe(10)
    expect(summary.right).toEqual([1, 2, 4, 5, 7, 8].map((i) => round.tasks[i]!.answer))
    expect(summary.wrong).toEqual(
      [0, 3, 6, 9].map((i) => ({
        answer: round.tasks[i]!.answer,
        firstAnswer: wrong(round.tasks[i]!.answer),
      })),
    )
  })

  it('lists a helped Task under Wrong with the first Answer', () => {
    let round = startRound(SET_TIME_TEACH, seededRandom(3))
    const helped = currentTask(round)!.answer
    round = submitAnswer(round, wrong(helped)).round
    round = answerAll(round, () => true)
    const summary = summarize(round)
    expect(summary.rightCount).toBe(9)
    expect(summary.wrong).toEqual([{ answer: helped, firstAnswer: wrong(helped) }])
    expect(summary.right).not.toContainEqual(helped)
  })

  it('keeps the Mode, the Level and every Task status for the dots', () => {
    const round = answerAll(startRound(SET_TIME_TEST, seededRandom(7)), (i) => i % 3 !== 0)
    const summary = summarize(round)
    expect(summary).toMatchObject({ game: 'setTime', mode: 'test', level: 15 })
    expect(summary.statuses).toEqual(round.tasks.map((t) => t.status))
  })

  it('tells a perfect Round to try the next smaller Level, if there is one', () => {
    const perfect = (level: Level) =>
      summarize(answerAll(startRound({ ...SET_TIME_TEST, level }, seededRandom(2)), () => true))
    expect(perfect(15).nudge).toEqual({ level: 5 })
    expect(perfect(5).nudge).toEqual({ level: 1 })
    expect(perfect(1).nudge).toEqual({ level: null })
  })

  it('gives no nudge when something was wrong', () => {
    const round = answerAll(startRound(SET_TIME_TEST, seededRandom(7)), (i) => i > 0)
    expect(summarize(round).nudge).toBeNull()
  })

  it('cannot be built before the Round finishes', () => {
    expect(() => summarize(startRound(SET_TIME_TEST, seededRandom(1)))).toThrow('not finished')
  })
})
