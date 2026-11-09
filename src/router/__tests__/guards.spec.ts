import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '..'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { currentTask } from '@/game/round'

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

  it('sends Summary to Settings when no Round is in memory', async () => {
    usePlayerStore().setName('Оля')
    expect(await open('/summary')).toBe('settings')
  })

  it('sends Summary back to the Round while the Round is still being played', async () => {
    usePlayerStore().setName('Оля')
    usePlayStore().startRound()
    expect(await open('/summary')).toBe('round')
  })

  it('sends a finished Round to its Summary', async () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    play.settings.game = 'setTime'
    play.startRound()
    while (play.round && currentTask(play.round)) play.submitAnswer(currentTask(play.round)!.answer)
    expect(await open('/round')).toBe('summary')
    expect(await open('/summary')).toBe('summary')
  })

  it('asks to confirm instead of leaving a Round in play (browser Back)', async () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    play.startRound()
    const router = createAppRouter(createMemoryHistory())
    await router.push('/round')
    await router.push('/settings')
    expect(router.currentRoute.value.name).toBe('round')
    expect(play.askingToLeave).toBe(true)

    play.leaveRound()
    await router.push('/settings')
    expect(router.currentRoute.value.name).toBe('settings')
  })

  it('sends Back from a just-finished Round to its Summary (Teach "Right! Next…" pause)', async () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    play.settings.game = 'setTime'
    play.startRound()
    const router = createAppRouter(createMemoryHistory())
    await router.push('/round')
    while (play.round && currentTask(play.round)) play.submitAnswer(currentTask(play.round)!.answer)
    await router.push('/settings')
    expect(router.currentRoute.value.name).toBe('summary')
  })

  it('sends unknown paths to Welcome', async () => {
    expect(await open('/nope')).toBe('welcome')
  })
})
