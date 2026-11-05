/** Clock Time: an hour 1–12 and a minute 0–59. No seconds, no 24-hour times. Plain TypeScript, no Vue. */

export interface ClockTime {
  readonly hour: number
  readonly minute: number
}

export function isValidHour(hour: number): boolean {
  return Number.isInteger(hour) && hour >= 1 && hour <= 12
}

export function isValidMinute(minute: number): boolean {
  return Number.isInteger(minute) && minute >= 0 && minute <= 59
}

/** Builds a Clock Time, throwing on an impossible hour or minute. */
export function clockTime(hour: number, minute: number): ClockTime {
  if (!isValidHour(hour) || !isValidMinute(minute)) {
    throw new RangeError(`Not a Clock Time: ${hour}:${minute}`)
  }
  return { hour, minute }
}

/** `H:MM`, for example 4:05. */
export function formatClockTime({ hour, minute }: ClockTime): string {
  return `${hour}:${String(minute).padStart(2, '0')}`
}

export function sameClockTime(a: ClockTime, b: ClockTime): boolean {
  return a.hour === b.hour && a.minute === b.minute
}

/**
 * Hand angles in degrees, 0° at 12, clockwise.
 * The Hour Hand includes the minute fraction, so it creeps between numbers.
 */
export function handAngles({ hour, minute }: ClockTime): { hour: number; minute: number } {
  return { hour: (hour % 12) * 30 + minute * 0.5, minute: minute * 6 }
}
