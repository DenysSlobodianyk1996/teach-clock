/**
 * Set Time entry: an hour box and a minute box, each up to two digits.
 * Any digits can be typed; an impossible value is reported only when the Player submits.
 * Plain TypeScript, no Vue.
 */
import {
  clockTime,
  HOUR_RANGE,
  isValidHour,
  isValidMinute,
  MINUTE_RANGE,
  type ClockTime,
} from './clockTime'

export type Box = 'hour' | 'minute'

export interface TimeEntry {
  readonly hour: string
  readonly minute: string
  readonly selected: Box
}

/** The numbers each box takes, shown under it. Other digits can still be typed. */
export const BOX_RANGE: Record<Box, { readonly from: number; readonly to: number }> = {
  hour: HOUR_RANGE,
  minute: MINUTE_RANGE,
}

export const EMPTY_ENTRY: TimeEntry = { hour: '', minute: '', selected: 'hour' }

const MAX_DIGITS = 2

export function selectBox(entry: TimeEntry, box: Box): TimeEntry {
  return { ...entry, selected: box }
}

/** Adds a digit to the selected box. A full hour box hands over to the minutes. */
export function pressDigit(entry: TimeEntry, digit: number): TimeEntry {
  const box = entry.selected
  if (entry[box].length >= MAX_DIGITS) return entry
  const value = entry[box] + String(digit)
  const selected = box === 'hour' && value.length === MAX_DIGITS ? 'minute' : box
  return { ...entry, [box]: value, selected }
}

/** Empties the whole selected box. */
export function clearBox(entry: TimeEntry): TimeEntry {
  return { ...entry, [entry.selected]: '' }
}

export function canSubmit(entry: TimeEntry): boolean {
  return entry.hour !== '' && entry.minute !== ''
}

/** The Clock Time typed in, or which boxes hold an impossible (or no) value. One digit reads as 0X. */
export function readEntry(entry: TimeEntry): { time: ClockTime } | { errors: Box[] } {
  const hour = entry.hour === '' ? NaN : Number(entry.hour)
  const minute = entry.minute === '' ? NaN : Number(entry.minute)
  const errors: Box[] = []
  if (!isValidHour(hour)) errors.push('hour')
  if (!isValidMinute(minute)) errors.push('minute')
  return errors.length ? { errors } : { time: clockTime(hour, minute) }
}

/** The boxes filled in with a Clock Time, as "Set correct answer" does. The minutes stay selected. */
export function entryFor({ hour, minute }: ClockTime): TimeEntry {
  return {
    hour: String(hour),
    minute: String(minute).padStart(MAX_DIGITS, '0'),
    selected: 'minute',
  }
}
