import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePlayerStore } from '../player'

describe('player store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('has no name on a fresh device', () => {
    expect(usePlayerStore().name).toBe('')
  })

  it('keeps the name trimmed', () => {
    const player = usePlayerStore()
    player.setName('  Оля  ')
    expect(player.name).toBe('Оля')
  })

  it('cuts the name to 20 characters', () => {
    const player = usePlayerStore()
    player.setName('Максиміліан-Олександр Великий')
    expect(player.name).toBe('Максиміліан-Олександ')
  })

  it('never cuts a character in half', () => {
    const player = usePlayerStore()
    player.setName('Олександра-Марійка🌻🌻🌻')
    expect(player.name).toBe('Олександра-Марійка🌻🌻')
  })

  it('remembers the last name on the device', () => {
    usePlayerStore().setName('Оля')
    setActivePinia(createPinia())
    expect(usePlayerStore().name).toBe('Оля')
  })
})
