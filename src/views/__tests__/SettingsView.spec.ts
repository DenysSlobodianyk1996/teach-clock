import { beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsView from '../SettingsView.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

type Screen = Awaited<ReturnType<typeof mountScreen>>['wrapper']

/** The radio input of the choice card with this title. */
function choice(wrapper: Screen, title: string) {
  const card = wrapper.findAll('label.choice').find((c) => c.find('b').text() === title)
  if (!card) throw new Error(`No choice "${title}"`)
  return card.find<HTMLInputElement>('input[type="radio"]')
}

function button(wrapper: Screen, text: string) {
  const found = wrapper.findAll('button').find((b) => b.text() === text)
  if (!found) throw new Error(`No button "${text}"`)
  return found
}

describe('Settings screen', () => {
  beforeEach(() => localStorage.clear())

  const open = () => mountScreen(SettingsView, '/settings', () => usePlayerStore().setName('Оля'))

  it('greets the Player by name', async () => {
    const { wrapper } = await open()
    expect(wrapper.find('h1').text()).toBe('Оля, у що граємо?')
  })

  it('shows the selected Game, Mode and Level as checked', async () => {
    const { wrapper } = await open()
    expect(choice(wrapper, 'Який час?').element.checked).toBe(true)
    expect(choice(wrapper, 'Навчання').element.checked).toBe(true)
    expect(choice(wrapper, '15 хв').element.checked).toBe(true)
    expect(choice(wrapper, 'Перевірка').element.checked).toBe(false)
  })

  it('hides the Level for Drag Numbers and shows it again for other Games', async () => {
    const { wrapper } = await open()
    expect(wrapper.text()).toContain('Крок хвилин')

    await choice(wrapper, 'Розстав числа').setValue(true)
    expect(wrapper.text()).not.toContain('Крок хвилин')
    expect(wrapper.text()).not.toContain('30 хв')

    await choice(wrapper, 'Постав стрілки').setValue(true)
    expect(wrapper.text()).toContain('Крок хвилин')
  })

  it('starts a Round with the chosen Settings and opens it', async () => {
    const { wrapper, router } = await open()
    await choice(wrapper, 'Перевірка').setValue(true)
    await choice(wrapper, '5 хв').setValue(true)
    await button(wrapper, 'Грати').trigger('click')

    expect(usePlayStore().round).toEqual({ game: 'setTime', mode: 'test', level: 5, taskCount: 10 })
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('round'))
  })

  it('goes back to Welcome', async () => {
    const { wrapper, router } = await open()
    await button(wrapper, 'Назад').trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('welcome'))
  })
})
