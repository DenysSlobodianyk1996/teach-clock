import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import App from '@/App.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { currentTask } from '@/game/round'
import { seededRandom } from '@/game/tasks'
import type { Mode } from '@/game/settings'
import { pressBack } from '../backButton'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

function startRound(mode: Mode = 'test') {
  return () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    play.settings = { game: 'setTime', mode, level: 15 }
    play.startRound(seededRandom(5))
  }
}

async function open(path: string, arrange?: () => void) {
  const screen = await mountScreen(App, path, arrange)
  wrapper = screen.wrapper
  await flushPromises()
  const exit = vi.fn<() => void>()
  const back = async () => {
    await pressBack(screen.router, exit)
    await flushPromises()
  }
  const at = () => screen.router.currentRoute.value.name
  return { at, exit, back }
}

const popupTitle = () => wrapper.find('[role="dialog"] h2')

/** Types H:MM on the number pad and presses Submit. */
async function answer(time: string) {
  const [hour, minute] = time.split(':') as [string, string]
  const pad = wrapper.findAll('.pad button')
  for (const d of hour.padStart(2, '0') + minute)
    await pad[d === '0' ? 9 : Number(d) - 1]!.trigger('click')
  await wrapper
    .findAll('button')
    .find((b) => b.text() === t('round.submit'))!
    .trigger('click')
  await flushPromises()
}

describe('the Android back button', () => {
  it('exits the app on Welcome', async () => {
    const { at, exit, back } = await open('/')
    await back()
    expect(exit).toHaveBeenCalledOnce()
    expect(at()).toBe('welcome')
  })

  it('goes from Settings to Welcome', async () => {
    const { at, exit, back } = await open('/settings', () => usePlayerStore().setName('Оля'))
    await back()
    expect(at()).toBe('welcome')
    expect(exit).not.toHaveBeenCalled()
  })

  it('in a Round opens the leave dialog, and closes it on the next press', async () => {
    const { at, exit, back } = await open('/round', startRound())
    await back()
    expect(at()).toBe('round')
    expect(popupTitle().text()).toBe(t('leave.title'))
    await back()
    expect(at()).toBe('round')
    expect(popupTitle().exists()).toBe(false)
    expect(usePlayStore().round).not.toBeNull()
    expect(exit).not.toHaveBeenCalled()
  })

  it('in Teach closes the wrong-answer popup first, and stays in the Round', async () => {
    const { at, back } = await open('/round', startRound('teach'))
    // Level 15 never asks for :59, so this Answer is wrong.
    await answer('12:59')
    expect(popupTitle().text()).toBe(t('teach.wrongTitle'))
    await back()
    expect(popupTitle().exists()).toBe(false)
    expect(at()).toBe('round')
    await back()
    expect(popupTitle().text()).toBe(t('leave.title'))
  })

  it('goes from Summary to Welcome', async () => {
    const { at, back } = await open('/summary', () => {
      startRound()()
      const play = usePlayStore()
      for (let i = 0; i < 10; i++) play.submitAnswer(currentTask(play.round!)!.answer)
    })
    expect(at()).toBe('summary')
    await back()
    expect(at()).toBe('welcome')
  })
})
