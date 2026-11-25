/**
 * Set Time entry: an hour box and a minute box, each up to two digits.
 * A box is complete when no further digit could make a value in its Range: the hours after a first
 * digit of 2-9 (kept as typed, `8`), the minutes after a first digit of 6-9 (kept as `0X`), either
 * after two digits. A complete hour box hands over to the minutes; a complete box takes no more
 * digits until it is cleared or selected again. Two-digit values stay as typed, impossible ones
 * included (`13`, `00`): those are reported only when the Player submits.
 * A selected box is retyped: selecting it (by hand, by the hour hand-over or by "Set correct
 * answer") keeps its value but sets `replace`, so the first digit typed replaces the value and later
 * digits add to it; that digit, or Clear, ends `replace`. Plain TypeScript, no Vue.
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
  /** The selected box was just selected: the next digit replaces its value instead of adding. */
  readonly replace: boolean
}

/** The numbers each box takes, shown under it. Other digits can still be typed. */
export const BOX_RANGE: Record<Box, { readonly from: number; readonly to: number }> = {
  hour: HOUR_RANGE,
  minute: MINUTE_RANGE,
}

export const EMPTY_ENTRY: TimeEntry = { hour: '', minute: '', selected: 'hour', replace: false }

const MAX_DIGITS = 2

/** Selects a box; its value stays until the next digit replaces it. */
export function selectBox(entry: TimeEntry, box: Box): TimeEntry {
  return { ...entry, selected: box, replace: true }
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
 * Adds a digit to the selected box, or replaces its value if it was just selected; a complete box
 * takes no more. A lone minute digit that completes the box becomes 0X; a complete hour box hands
 * over to the minutes, selecting them.
 */
export function pressDigit(entry: TimeEntry, digit: number): TimeEntry {
  const box = entry.selected
  const before = entry.replace ? '' : entry[box]
  if (isComplete(box, before)) return entry
  let value = before + String(digit)
  const complete = isComplete(box, value)
  if (complete && box === 'minute') value = value.padStart(MAX_DIGITS, '0')
  const typed = { ...entry, [box]: value, replace: false }
  return complete && box === 'hour' ? selectBox(typed, 'minute') : typed
}

/** Empties the whole selected box. */
export function clearBox(entry: TimeEntry): TimeEntry {
  return { ...entry, [entry.selected]: '', replace: false }
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
    replace: true,
  }
}
