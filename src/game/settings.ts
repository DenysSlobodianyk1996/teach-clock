/** Settings: the Game, Mode and Level a Player picks before a Round. Plain TypeScript, no Vue. */

export const GAMES = ['dragHours', 'dragArrows', 'setTime'] as const
export type Game = (typeof GAMES)[number]

export const MODES = ['teach', 'test'] as const
export type Mode = (typeof MODES)[number]

/** The minute step Clock Times snap to, in the order Settings shows them. */
export const LEVELS = [1, 5, 15] as const
export type Level = (typeof LEVELS)[number]

export interface Settings {
  game: Game
  mode: Mode
  level: Level
}

export const DEFAULT_SETTINGS: Settings = { game: 'dragHours', mode: 'teach', level: 1 }

/** Drag Hours places the numbers 1–12 and has no minute step. */
export function hasLevel(game: Game): boolean {
  return game !== 'dragHours'
}

/** Ten Tasks, or one Task per number in Drag Hours. */
export function taskCount(game: Game): number {
  return game === 'dragHours' ? 12 : 10
}
