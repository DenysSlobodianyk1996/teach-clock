import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePlayStore } from '../play'
import { clockTime } from '@/game/clockTime'
import { currentTask } from '@/game/round'
import { seededRandom } from '@/game/tasks'

describe('play store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('opens Settings on Drag Numbers, Teach, 1 minute', () => {
    expect(usePlayStore().settings).toEqual({ game: 'dragNumbers', mode: 'teach', level: 1 })
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
    expect(play.round).toMatchObject({ game: 'dragArrows', mode: 'test', level: 5, current: 0 })
    expect(play.round?.tasks).toHaveLength(10)
  })

  it('starts Drag Numbers with 12 Tasks and no Level', () => {
    const play = usePlayStore()
    play.settings.game = 'dragNumbers'
    play.startRound()
    expect(play.round).toMatchObject({ game: 'dragNumbers', mode: 'teach', level: null })
    expect(play.round?.tasks).toHaveLength(12)
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

  it('leaving a Round throws it away and stops asking', () => {
    const play = usePlayStore()
    play.startRound()
    play.askingToLeave = true
    play.leaveRound()
    expect(play.round).toBeNull()
    expect(play.askingToLeave).toBe(false)
  })

  it('submits Answers to the current Round and builds the Summary when it finishes', () => {
    const play = usePlayStore()
    play.settings.game = 'setTime'
    play.settings.mode = 'test'
    play.startRound(seededRandom(3))
    expect(play.summary).toBeNull()

    expect(play.submitAnswer(clockTime(12, 59))).toEqual({
      right: false,
      movedOn: true,
      finished: false,
    })
    for (let i = 1; i < 10; i++) play.submitAnswer(currentTask(play.round!)!.answer)

    expect(play.summary).toMatchObject({ rightCount: 9, total: 10 })
  })
})
