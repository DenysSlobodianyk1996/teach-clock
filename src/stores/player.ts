import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

/** Longest name, in characters (not UTF-16 units, so an emoji is never cut in half). */
export const NAME_MAX_LENGTH = 20

/** The Player: known only by the name they type in. The last name stays on the device. */
export const usePlayerStore = defineStore('player', () => {
  const name = useStorage('teach-clock.name', '', undefined, { flush: 'sync' })

  function setName(raw: string) {
    name.value = [...raw.trim()].slice(0, NAME_MAX_LENGTH).join('').trim()
  }

  return { name, setName }
})
