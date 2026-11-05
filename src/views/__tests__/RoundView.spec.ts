import { afterEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import RoundView from '../RoundView.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { seededRandom } from '@/game/tasks'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

async function open(game: 'setTime' | 'dragArrows' = 'setTime') {
  const screen = await mountScreen(RoundView, '/round', () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    Object.assign(play.settings, { game, mode: 'test', level: 30 })
    play.startRound(seededRandom(5))
  })
  wrapper = screen.wrapper
  return screen
}

/** Types H:MM on the number pad and presses Submit. */
async function answer(time: string) {
  const [hour, minute] = time.split(':') as [string, string]
  const pad = wrapper.findAll('.pad button')
  for (const d of hour.padStart(2, '0') + minute)
    await pad[d === '0' ? 9 : Number(d) - 1]!.trigger('click')
  await wrapper
    .findAll('button')
    .find((b) => b.text() === 'Перевірити')!
    .trigger('click')
}

const clockLabel = () => wrapper.get('svg.clock').attributes('aria-label')!
const shownTime = () => clockLabel().replace('Годинник показує ', '')

describe('Round screen, Set Time', () => {
  it('shows a clock and asks what time it is', async () => {
    await open()
    expect(wrapper.get('h1').text()).toBe('Котра година?')
    expect(clockLabel()).toMatch(/^Годинник показує \d{1,2}:\d{2}$/)
    expect(wrapper.text()).toContain('Завдання 1 з 10 · Перевірка')
  })

  it('moves on after every Answer and colours the dots', async () => {
    await open()
    const first = shownTime()
    await answer(first)
    const second = shownTime()
    expect(second).not.toBe(first)
    await answer(second === '12:00' ? '1:00' : '12:00')
    expect(
      wrapper
        .findAll('.dot')
        .slice(0, 3)
        .map((d) => d.classes()[1]),
    ).toEqual(['ok', 'bad', 'now'])
    expect(wrapper.text()).toContain('Завдання 3 з 10')
  })

  it('opens the Summary after the 10th Answer', async () => {
    const { router } = await open()
    for (let i = 0; i < 10; i++) await answer(shownTime())
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    expect(usePlayStore().summary).toMatchObject({ rightCount: 10 })
  })

  it('does not take keyboard input while asking to leave', async () => {
    await open()
    usePlayStore().askingToLeave = true
    await wrapper.vm.$nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '7' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[aria-label="Години"]').text()).toBe('')
  })

  it('keeps the placeholder for Games that are not built yet', async () => {
    await open('dragArrows')
    expect(wrapper.get('[data-testid="play-area"]').text()).toContain('Тут скоро буде гра')
  })
})
