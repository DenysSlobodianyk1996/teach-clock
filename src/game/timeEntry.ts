/**
 * Set Time entry: an hour box and a minute box, each up to two digits.
 * A box is complete when no further digit could make a value in its Range: the hours after a first
 * digit of 2-9 (kept as typed, `8`), the minutes after a first digit of 6-9 (kept as `0X`), either
 * after two digits. A complete hour box hands over to the minutes; a complete box takes no more
 * digits until it is cleared. Two-digit values stay as typed, impossible ones included (`13`, `00`):
 * those are reported only when the Player submits. Plain TypeScript, no Vue.
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

/** The largest first digit a second digit can still follow and stay in the box's Range. */
const LAST_OPEN_DIGIT: Record<Box, number> = {
  hour: Math.floor(HOUR_RANGE.to / 10),
  minute: Math.floor(MINUTE_RANGE.to / 10),
}

/** Whether no further digit could make a value in the box's Range. */
function isComplete(box: Box, value: string): boolean {
  if (value.length >= MAX_DIGITS) return true
  return value.length === 1 && Number(value) > LAST_OPEN_DIGIT[box]
}

/**
 * Adds a digit to the selected box, unless it is complete. A lone minute digit that completes the
 * box becomes 0X; a complete hour box hands over to the minutes.
 */
export function pressDigit(entry: TimeEntry, digit: number): TimeEntry {
  const box = entry.selected
  if (isComplete(box, entry[box])) return entry
  let value = entry[box] + String(digit)
  const complete = isComplete(box, value)
  if (complete && box === 'minute') value = value.padStart(MAX_DIGITS, '0')
  const selected = complete && box === 'hour' ? 'minute' : box
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
