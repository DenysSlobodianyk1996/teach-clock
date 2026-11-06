import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_SETTINGS, type Settings } from '@/game/settings'
import type { ClockTime } from '@/game/clockTime'
import {
  isFinished,
  startRound as newRound,
  submitAnswer as submit,
  type Round,
} from '@/game/round'
import { dropNumber as drop } from '@/game/dragNumbers'
import { summarize } from '@/game/summary'
import type { Random } from '@/game/tasks'

/** Current Settings and Round. Memory only: a reload starts fresh (ADR 0002). */
export const usePlayStore = defineStore('play', () => {
  const settings = ref<Settings>({ ...DEFAULT_SETTINGS })
  // The rules module returns a new Round for every action, so no deep reactivity is needed.
  const round = shallowRef<Round | null>(null)
  /** The "Leave this Round?" dialog is open. */
  const askingToLeave = ref(false)

  const summary = computed(() =>
    round.value && isFinished(round.value) ? summarize(round.value) : null,
  )

  function startRound(random: Random = Math.random) {
    round.value = newRound({ ...settings.value }, random)
  }

  function submitAnswer(time: ClockTime) {
    if (!round.value) throw new Error('No Round in play')
    const result = submit(round.value, time)
    round.value = result.round
    return result.outcome
  }

  /** Drag Numbers: drops a tray number on a slot. */
  function dropNumber(number: number, slot: number) {
    if (round.value?.game !== 'dragNumbers') throw new Error('No Drag Numbers Round in play')
    const result = drop(round.value, number, slot)
    round.value = result.round
    return result.outcome
  }

  /** Throws the Round away. Screens that need a Round step aside on their own. */
  function leaveRound() {
    round.value = null
    askingToLeave.value = false
  }

  return {
    settings,
    round,
    summary,
    askingToLeave,
    startRound,
    submitAnswer,
    dropNumber,
    leaveRound,
  }
})
