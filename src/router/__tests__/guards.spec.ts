import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '..'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

async function open(path: string) {
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  return router.currentRoute.value.name
}

describe('screen guards', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('opens Welcome for a new Player', async () => {
    expect(await open('/')).toBe('welcome')
  })

  it('sends Settings back to Welcome when there is no name', async () => {
    expect(await open('/settings')).toBe('welcome')
  })

  it('opens Settings once the Player has a name', async () => {
    usePlayerStore().setName('Оля')
    expect(await open('/settings')).toBe('settings')
  })

  it('sends Round to Settings when no Round is in memory', async () => {
    usePlayerStore().setName('Оля')
    expect(await open('/round')).toBe('settings')
  })

  it('sends Round to Welcome when there is no name either', async () => {
    expect(await open('/round')).toBe('welcome')
  })

  it('opens Round when one has started', async () => {
    usePlayerStore().setName('Оля')
    usePlayStore().startRound()
    expect(await open('/round')).toBe('round')
  })

  it('sends unknown paths to Welcome', async () => {
    expect(await open('/nope')).toBe('welcome')
  })
})
