import { describe, expect, it } from 'vitest'
import { clockTime, type ClockTime } from '../clockTime'
import { currentTask, isFinished, startRound, submitAnswer, type Round } from '../round'
import { summarize } from '../summary'
import { seededRandom } from '../tasks'

const SET_TIME_TEST = { game: 'setTime', mode: 'test', level: 15 } as const

/** A Clock Time that is not the given one. */
function wrong(time: ClockTime): ClockTime {
  return clockTime((time.hour % 12) + 1, time.minute)
}

function answerAll(round: Round, rightAt: (i: number) => boolean): Round {
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
    expect(outcome).toEqual({ right: true, finished: false })
    expect(next.tasks[0]).toMatchObject({ status: 'right', firstAnswer: answer })
    expect(next.current).toBe(1)
  })

  it('in Test, records a wrong Answer and still moves on', () => {
    const round = startRound(SET_TIME_TEST, seededRandom(1))
    const answer = wrong(currentTask(round)!.answer)
    const { round: next, outcome } = submitAnswer(round, answer)
    expect(outcome).toEqual({ right: false, finished: false })
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
    expect(last!.outcome).toEqual({ right: true, finished: true })
    expect(isFinished(round)).toBe(true)
    expect(currentTask(round)).toBeNull()
    expect(() => submitAnswer(round, clockTime(1, 0))).toThrow('already finished')
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

  it('cannot be built before the Round finishes', () => {
    expect(() => summarize(startRound(SET_TIME_TEST, seededRandom(1)))).toThrow('not finished')
  })
})
