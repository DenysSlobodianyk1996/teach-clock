/**
 * The teaching line shown in Teach after a wrong Answer: which kind of mistake it was, with the
 * numbers the message needs. The words live in i18n under `teach.mistakes.<kind>`.
 * Plain TypeScript, no Vue.
 */
import { formatClockTime, type ClockTime } from './clockTime'

export type Mistake =
  /** The hour after the right one: the Hour Hand has not reached it yet. */
  | { kind: 'hourAhead'; params: { hour: number; next: number } }
  /** On the hour: the Hour Hand points right at it. */
  | { kind: 'hourOn'; params: { hour: number } }
  | { kind: 'hourBetween'; params: { hour: number; next: number } }
  /** On the hour: the Minute Hand is on 12. */
  | { kind: 'minuteZero'; params: { time: string } }
  /** The Minute Hand is on a number: count in fives. */
  | { kind: 'minuteOn'; params: { number: number; minute: number } }
  /** The Minute Hand is past a number: count the small marks from it. */
  | { kind: 'minuteBetween'; params: { number: number; minute: number } }
  /** The Minute Hand read as hours and the Hour Hand as minutes. */
  | { kind: 'swapped'; params: Record<string, never> }
  /** Hour and minutes both wrong in some other way. */
  | { kind: 'both'; params: { hour: number; minute: string } }

/** How far a swapped reading of the minutes may be from where the Hour Hand points. */
const SWAP_SLACK_MINUTES = 5

/** The hour after `hour`, wrapping 12 to 1. */
function nextHour(hour: number): number {
  return (hour % 12) + 1
}

/** Whether `given` reads the Minute Hand as the hour and the Hour Hand as the minutes. */
function isSwapped(answer: ClockTime, given: ClockTime): boolean {
  const minuteHandNumber = Math.round(answer.minute / 5) % 12 || 12
  // The Hour Hand read on the minute scale: 5 minutes per number, creeping with the minutes.
  const hourHandMinutes = ((answer.hour % 12) + answer.minute / 60) * 5
  const off = Math.abs(given.minute - hourHandMinutes)
  return given.hour === minuteHandNumber && Math.min(off, 60 - off) <= SWAP_SLACK_MINUTES
}

/** Describes a wrong Answer `given` to a clock showing `answer`. */
export function describeMistake(answer: ClockTime, given: ClockTime): Mistake {
  const { hour, minute } = answer
  const next = nextHour(hour)
  if (given.hour === hour) {
    if (minute === 0) return { kind: 'minuteZero', params: { time: formatClockTime(answer) } }
    const number = Math.floor(minute / 5) || 12
    return { kind: minute % 5 ? 'minuteBetween' : 'minuteOn', params: { number, minute } }
  }
  if (isSwapped(answer, given)) return { kind: 'swapped', params: {} }
  if (given.minute !== minute) {
    return { kind: 'both', params: { hour, minute: String(minute).padStart(2, '0') } }
  }
  if (minute === 0) return { kind: 'hourOn', params: { hour } }
  if (given.hour === next) return { kind: 'hourAhead', params: { hour, next } }
  return { kind: 'hourBetween', params: { hour, next } }
}
