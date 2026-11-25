import { describe, expect, it } from 'vitest'
import {
  canSubmit,
  clearBox,
  EMPTY_ENTRY,
  entryFor,
  pressDigit,
  readEntry,
  selectBox,
  type TimeEntry,
} from '../timeEntry'
import { clockTime } from '../clockTime'

function type(entry: TimeEntry, digits: string): TimeEntry {
  return [...digits].reduce((e, d) => pressDigit(e, Number(d)), entry)
}

describe('time entry', () => {
  it('starts empty with the hour box selected', () => {
    expect(EMPTY_ENTRY).toEqual({ hour: '', minute: '', selected: 'hour' })
  })

  it('moves to the minutes after the second hour digit', () => {
    const entry = type(EMPTY_ENTRY, '10')
    expect(entry).toEqual({ hour: '10', minute: '', selected: 'minute' })
    expect(type(entry, '55')).toEqual({ hour: '10', minute: '55', selected: 'minute' })
  })

  it('stays on the hour after 0 or 1, which a second digit can follow', () => {
    expect(type(EMPTY_ENTRY, '1')).toEqual({ hour: '1', minute: '', selected: 'hour' })
    expect(type(EMPTY_ENTRY, '0')).toEqual({ hour: '0', minute: '', selected: 'hour' })
    expect(type(EMPTY_ENTRY, '11')).toEqual({ hour: '11', minute: '', selected: 'minute' })
    expect(type(EMPTY_ENTRY, '08')).toEqual({ hour: '08', minute: '', selected: 'minute' })
  })

  it('moves to the minutes after one hour digit of 2-9, shown as typed', () => {
    for (const d of '23456789')
      expect(type(EMPTY_ENTRY, d)).toEqual({ hour: d, minute: '', selected: 'minute' })
  })

  it('completes the minutes as 0X after one digit of 6-9, and keeps them selected', () => {
    const minutes = selectBox(EMPTY_ENTRY, 'minute')
    for (const d of '6789')
      expect(type(minutes, d)).toEqual({ hour: '', minute: `0${d}`, selected: 'minute' })
  })

  it('waits for a second minute digit after 0-5', () => {
    const minutes = selectBox(EMPTY_ENTRY, 'minute')
    for (const d of '012345') expect(type(minutes, d).minute).toBe(d)
    expect(type(minutes, '35').minute).toBe('35')
  })

  it('ignores further digits in a complete box while it stays selected', () => {
    expect(type(EMPTY_ENTRY, '85')).toEqual({ hour: '8', minute: '5', selected: 'minute' })
    expect(type(selectBox(type(EMPTY_ENTRY, '8'), 'hour'), '5').hour).toBe('8')
    expect(type(selectBox(EMPTY_ENTRY, 'minute'), '73').minute).toBe('07')
  })

  it('takes digits again once the complete box is cleared', () => {
    const hour = clearBox(selectBox(type(EMPTY_ENTRY, '8'), 'hour'))
    expect(type(hour, '11')).toEqual({ hour: '11', minute: '', selected: 'minute' })
    const minute = clearBox(type(selectBox(EMPTY_ENTRY, 'minute'), '7'))
    expect(type(minute, '45').minute).toBe('45')
  })

  it('still hands over impossible two-digit hours, reported only on Submit', () => {
    expect(type(EMPTY_ENTRY, '13')).toEqual({ hour: '13', minute: '', selected: 'minute' })
    expect(type(EMPTY_ENTRY, '00')).toEqual({ hour: '00', minute: '', selected: 'minute' })
  })

  it('types into whichever box the Player selects', () => {
    const entry = type(selectBox(type(EMPTY_ENTRY, '1'), 'minute'), '55')
    expect(entry).toEqual({ hour: '1', minute: '55', selected: 'minute' })
    expect(type(selectBox(entry, 'hour'), '2').hour).toBe('12')
  })

  it('ignores a third digit in a full box', () => {
    expect(type(selectBox(EMPTY_ENTRY, 'minute'), '123').minute).toBe('12')
  })

  it('clears the whole selected box and leaves the other', () => {
    const entry = type(EMPTY_ENTRY, '0754')
    expect(clearBox(entry)).toEqual({ hour: '07', minute: '', selected: 'minute' })
    expect(clearBox(selectBox(entry, 'hour'))).toEqual({
      hour: '',
      minute: '54',
      selected: 'hour',
    })
  })

  it('can be submitted only when both boxes have a digit', () => {
    expect(canSubmit(EMPTY_ENTRY)).toBe(false)
    expect(canSubmit(type(EMPTY_ENTRY, '7'))).toBe(false)
    expect(canSubmit(type(selectBox(type(EMPTY_ENTRY, '7'), 'minute'), '5'))).toBe(true)
  })

  it('reads one digit as a leading zero: 1 and 5 mean 1:05', () => {
    const entry = type(selectBox(type(EMPTY_ENTRY, '1'), 'minute'), '5')
    expect(readEntry(entry)).toEqual({ time: { hour: 1, minute: 5 } })
    expect(readEntry(type(EMPTY_ENTRY, '0745'))).toEqual({ time: { hour: 7, minute: 45 } })
  })

  it('reports an impossible hour or minute instead of a Clock Time', () => {
    expect(readEntry(type(EMPTY_ENTRY, '1330'))).toEqual({ errors: ['hour'] })
    expect(readEntry(type(EMPTY_ENTRY, '0030'))).toEqual({ errors: ['hour'] })
    // A minute of 60 or more can no longer be typed (6-9 completes as 0X), but is still read as one.
    const entry = (hour: string, minute: string): TimeEntry => ({
      hour,
      minute,
      selected: 'minute',
    })
    expect(readEntry(entry('12', '60'))).toEqual({ errors: ['minute'] })
    expect(readEntry(entry('00', '99'))).toEqual({ errors: ['hour', 'minute'] })
  })

  it('reports an incomplete entry as missing boxes', () => {
    expect(readEntry(type(EMPTY_ENTRY, '7'))).toEqual({ errors: ['minute'] })
  })
})

describe('entryFor (Set correct answer)', () => {
  it('fills both boxes with the Clock Time, minutes as two digits', () => {
    const entry = entryFor(clockTime(7, 5))
    expect(entry).toMatchObject({ hour: '7', minute: '05' })
    expect(canSubmit(entry)).toBe(true)
    expect(readEntry(entry)).toEqual({ time: clockTime(7, 5) })
  })

  it('selects the minutes, so a typed digit does not change the hour', () => {
    expect(pressDigit(entryFor(clockTime(12, 30)), 4)).toMatchObject({ hour: '12', minute: '30' })
  })
})
