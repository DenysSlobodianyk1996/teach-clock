import { beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsView from '../SettingsView.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { t } from '@/test/i18n'

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
    expect(wrapper.find('h1').text()).toBe(t('settings.greeting', { name: 'Оля' }))
  })

  it('shows the selected Game, Mode and Level as checked', async () => {
    const { wrapper } = await open()
    expect(choice(wrapper, t('games.setTime.name')).element.checked).toBe(true)
    expect(choice(wrapper, t('modes.teach.name')).element.checked).toBe(true)
    expect(choice(wrapper, t('levels.1.name')).element.checked).toBe(true)
    expect(choice(wrapper, t('modes.test.name')).element.checked).toBe(false)
  })

  it('offers the Levels 1, 5 and 15 minutes, smallest step first', async () => {
    const { wrapper } = await open()
    const levels = wrapper.findAll('.levels label.choice b').map((b) => b.text())
    expect(levels).toEqual([t('levels.1.name'), t('levels.5.name'), t('levels.15.name')])
  })

  it('hides the Level for Drag Numbers and shows it again for other Games', async () => {
    const { wrapper } = await open()
    expect(wrapper.text()).toContain(t('settings.level'))

    await choice(wrapper, t('games.dragNumbers.name')).setValue(true)
    expect(wrapper.text()).not.toContain(t('settings.level'))
    expect(wrapper.text()).not.toContain(t('levels.15.name'))

    await choice(wrapper, t('games.dragArrows.name')).setValue(true)
    expect(wrapper.text()).toContain(t('settings.level'))
  })

  it('starts a Round with the chosen Settings and opens it', async () => {
    const { wrapper, router } = await open()
    await choice(wrapper, t('modes.test.name')).setValue(true)
    await choice(wrapper, t('levels.5.name')).setValue(true)
    await button(wrapper, t('settings.play')).trigger('click')

    expect(usePlayStore().round).toMatchObject({ game: 'setTime', mode: 'test', level: 5 })
    expect(usePlayStore().round?.tasks).toHaveLength(10)
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('round'))
  })

  it('goes back to Welcome', async () => {
    const { wrapper, router } = await open()
    await button(wrapper, t('settings.back')).trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('welcome'))
  })
})
