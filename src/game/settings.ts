/** Settings: the Game, Mode and Level a Player picks before a Round. Plain TypeScript, no Vue. */

export const GAMES = ['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const
export type Game = (typeof GAMES)[number]

export const MODES = ['teach', 'test'] as const
export type Mode = (typeof MODES)[number]

/** The minute step Clock Times snap to, in the order Settings shows them. */
export const LEVELS = [1, 5, 15] as const
export type Level = (typeof LEVELS)[number]

/**
 * Hours: the numbers Drag Hours places, by the last one. 12: 1–12; 24: 13–24 (24 at the top), with
 * the Hour Badges on the face. In the order Settings shows them.
 */
export const HOURS = [12, 24] as const
export type Hours = (typeof HOURS)[number]

export interface Settings {
  game: Game
  mode: Mode
  level: Level
  /** Drag Hours only; the other Games ignore it. */
  hours: Hours
}

export const DEFAULT_SETTINGS: Settings = { game: 'dragHours', mode: 'teach', level: 1, hours: 12 }

/** The drag Games, where the Player drags 12 tiles onto an empty face. */
export type NumbersGame = 'dragHours' | 'dragMinutes'

export function isNumbersGame(game: Game): game is NumbersGame {
  return game === 'dragHours' || game === 'dragMinutes'
}

/** Only Drag Hours has Hours. */
export function hasHours(game: Game): boolean {
  return game === 'dragHours'
}

/** The drag Games place 12 fixed tiles and have no minute step. */
export function hasLevel(game: Game): boolean {
  return !isNumbersGame(game)
}

/** Ten Tasks, or one Task per tile in a drag Game. */
export function taskCount(game: Game): number {
  return isNumbersGame(game) ? 12 : 10
}
