import { ref } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_SETTINGS, hasLevel, taskCount, type Settings } from '@/game/settings'

/**
 * Placeholder for the Round until the rules module arrives (ticket 03).
 * Holds only what the Round screen needs to draw an empty Round.
 */
export interface Round {
  game: Settings['game']
  mode: Settings['mode']
  level: Settings['level'] | null
  taskCount: number
}

/** Current Settings and Round. Memory only: a reload starts fresh (ADR 0002). */
export const usePlayStore = defineStore('play', () => {
  const settings = ref<Settings>({ ...DEFAULT_SETTINGS })
  const round = ref<Round | null>(null)

  function startRound() {
    const { game, mode, level } = settings.value
    round.value = { game, mode, level: hasLevel(game) ? level : null, taskCount: taskCount(game) }
  }

  function leaveRound() {
    round.value = null
  }

  return { settings, round, startRound, leaveRound }
})
