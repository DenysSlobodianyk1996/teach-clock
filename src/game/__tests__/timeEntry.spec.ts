import { describe, expect, it } from 'vitest'
import {
  canSubmit,
  clearBox,
  EMPTY_ENTRY,
  pressDigit,
  readEntry,
  selectBox,
  type TimeEntry,
} from '../timeEntry'

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

  it('stays on the hour after one digit, so 1 can still become 10', () => {
    expect(type(EMPTY_ENTRY, '1')).toEqual({ hour: '1', minute: '', selected: 'hour' })
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
    expect(readEntry(type(EMPTY_ENTRY, '1260'))).toEqual({ errors: ['minute'] })
    expect(readEntry(type(EMPTY_ENTRY, '0099'))).toEqual({ errors: ['hour', 'minute'] })
  })

  it('reports an incomplete entry as missing boxes', () => {
    expect(readEntry(type(EMPTY_ENTRY, '7'))).toEqual({ errors: ['minute'] })
  })
})
