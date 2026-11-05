import { describe, expect, it, vi } from 'vitest'
import SummaryView from '../SummaryView.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { clockTime, formatClockTime } from '@/game/clockTime'
import { currentTask } from '@/game/round'
import { seededRandom } from '@/game/tasks'

/** Plays a Set Time Test Round, getting the first two Tasks wrong with 12:59. */
function playRound() {
  usePlayerStore().setName('Оля')
  const play = usePlayStore()
  play.settings.mode = 'test'
  play.startRound(seededRandom(9))
  for (let i = 0; i < 10; i++) {
    const answer = currentTask(play.round!)!.answer
    play.submitAnswer(i < 2 ? clockTime(12, 59) : answer)
  }
}

describe('Summary screen', () => {
  it('shows how many were right and lists Right and Wrong with the first Answer', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound)
    const tasks = usePlayStore().round!.tasks
    expect(wrapper.get('h1').text()).toBe('8 з 10 правильно')

    const wrong = wrapper.findAll('[aria-labelledby="wrong-title"] li').map((li) => li.text())
    expect(wrong).toEqual(
      tasks.slice(0, 2).map((t) => `${formatClockTime(t.answer)} — твоя відповідь 12:59`),
    )
    const right = wrapper.findAll('[aria-labelledby="right-title"] li').map((li) => li.text())
    expect(right).toEqual(tasks.slice(2).map((t) => formatClockTime(t.answer)))
  })

  it('plays again with the same Settings', async () => {
    const { wrapper, router } = await mountScreen(SummaryView, '/summary', playRound)
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Грати ще')!
      .trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('round'))
    expect(usePlayStore().round).toMatchObject({ game: 'setTime', mode: 'test', current: 0 })
  })

  it('goes back to Settings and drops the Round', async () => {
    const { wrapper, router } = await mountScreen(SummaryView, '/summary', playRound)
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'До вибору гри')!
      .trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('settings'))
    expect(usePlayStore().round).toBeNull()
  })
})
