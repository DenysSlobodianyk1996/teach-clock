import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePlayStore } from '../play'

describe('play store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('opens Settings on Set Time, Teach, 15 minutes', () => {
    expect(usePlayStore().settings).toEqual({ game: 'setTime', mode: 'teach', level: 15 })
  })

  it('has no Round until the Player starts one', () => {
    expect(usePlayStore().round).toBeNull()
  })

  it('starts a Round of 10 Tasks with the chosen Settings', () => {
    const play = usePlayStore()
    play.settings.game = 'dragArrows'
    play.settings.mode = 'test'
    play.settings.level = 5
    play.startRound()
    expect(play.round).toEqual({ game: 'dragArrows', mode: 'test', level: 5, taskCount: 10 })
  })

  it('starts Drag Numbers with 12 Tasks and no Level', () => {
    const play = usePlayStore()
    play.settings.game = 'dragNumbers'
    play.startRound()
    expect(play.round).toEqual({ game: 'dragNumbers', mode: 'teach', level: null, taskCount: 12 })
  })

  it('keeps the chosen Level while Drag Numbers is picked', () => {
    const play = usePlayStore()
    play.settings.level = 1
    play.settings.game = 'dragNumbers'
    play.settings.game = 'setTime'
    expect(play.settings.level).toBe(1)
  })

  it('a started Round does not change when Settings change', () => {
    const play = usePlayStore()
    play.startRound()
    play.settings.mode = 'test'
    expect(play.round?.mode).toBe('teach')
  })

  it('leaving a Round throws it away', () => {
    const play = usePlayStore()
    play.startRound()
    play.leaveRound()
    expect(play.round).toBeNull()
  })
})
