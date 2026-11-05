import { describe, expect, it } from 'vitest'
import { clockTime } from '../clockTime'
import { describeMistake } from '../mistakes'

/** The teaching line for answering `given` to a clock showing `answer`, both as H:MM. */
function mistake(answer: string, given: string) {
  const [ah, am] = answer.split(':').map(Number) as [number, number]
  const [gh, gm] = given.split(':').map(Number) as [number, number]
  return describeMistake(clockTime(ah, am), clockTime(gh, gm))
}

describe('describeMistake, wrong hour', () => {
  it('the next hour: the short hand has not reached it yet', () => {
    expect(mistake('7:45', '8:45')).toEqual({ kind: 'hourAhead', params: { hour: 7, next: 8 } })
  })

  it('wraps from 12 to 1', () => {
    expect(mistake('12:30', '1:30')).toEqual({ kind: 'hourAhead', params: { hour: 12, next: 1 } })
  })

  it('on the hour, the short hand points right at it', () => {
    expect(mistake('7:00', '8:00')).toEqual({ kind: 'hourOn', params: { hour: 7 } })
  })

  it('any other hour: the short hand sits between the hour and the next', () => {
    expect(mistake('4:20', '2:20')).toEqual({ kind: 'hourBetween', params: { hour: 4, next: 5 } })
  })
})

describe('describeMistake, wrong minutes', () => {
  it('on the hour, the long hand is on 12', () => {
    expect(mistake('4:00', '4:30')).toEqual({ kind: 'minuteZero', params: { time: '4:00' } })
  })

  it('on a number: count in fives', () => {
    expect(mistake('4:20', '4:40')).toEqual({ kind: 'minuteOn', params: { number: 4, minute: 20 } })
  })

  it('past a number: count the small marks from it, with 12 before 5 minutes', () => {
    expect(mistake('4:23', '4:20')).toEqual({
      kind: 'minuteBetween',
      params: { number: 4, minute: 23 },
    })
    expect(mistake('4:03', '4:00')).toEqual({
      kind: 'minuteBetween',
      params: { number: 12, minute: 3 },
    })
  })
})

describe('describeMistake, hands swapped or both wrong', () => {
  it('reading the long hand as hours and the short hand as minutes is swapped hands', () => {
    // 3:00: long hand on 12, short hand on 3 (= 15 minutes).
    expect(mistake('3:00', '12:15')).toEqual({ kind: 'swapped', params: {} })
    // 7:45: long hand on 9, short hand nearly at 8 (about 39 minutes); a near reading counts.
    expect(mistake('7:45', '9:35')).toEqual({ kind: 'swapped', params: {} })
  })

  it('anything else with both wrong names both hands', () => {
    expect(mistake('4:20', '9:50')).toEqual({ kind: 'both', params: { hour: 4, minute: '20' } })
    // Minutes as on the clock's digits: 5:00 → (00).
    expect(mistake('5:00', '12:01')).toEqual({ kind: 'both', params: { hour: 5, minute: '00' } })
  })
})
