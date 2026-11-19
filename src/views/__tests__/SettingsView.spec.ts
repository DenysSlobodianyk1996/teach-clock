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

  it('opens on Drag Hours and Teach, with no Level', async () => {
    const { wrapper } = await open()
    expect(choice(wrapper, t('games.dragHours.name')).element.checked).toBe(true)
    expect(choice(wrapper, t('games.setTime.name')).element.checked).toBe(false)
    expect(choice(wrapper, t('modes.teach.name')).element.checked).toBe(true)
    expect(choice(wrapper, t('modes.test.name')).element.checked).toBe(false)
    expect(wrapper.text()).not.toContain(t('settings.level'))
  })

  it('lists four Games, the two drag Games side by side, each with its own icon', async () => {
    const { wrapper } = await open()
    const games = wrapper.findAll('.games label.choice b').map((b) => b.text())
    expect(games).toEqual(
      (['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const).map((g) =>
        t(`games.${g}.name`),
      ),
    )
    const icons = wrapper.findAll('.games svg').map((s) => s.html())
    expect(new Set(icons).size).toBe(4)
  })

  it('shows no Level for Drag Minutes, and starts a Drag Minutes Round', async () => {
    const { wrapper } = await open()
    await choice(wrapper, t('games.setTime.name')).setValue(true)
    await choice(wrapper, t('games.dragMinutes.name')).setValue(true)
    expect(wrapper.text()).not.toContain(t('settings.level'))
    await button(wrapper, t('settings.play')).trigger('click')
    expect(usePlayStore().round).toMatchObject({
      game: 'dragMinutes',
      mode: 'teach',
      level: null,
      hours: null,
    })
  })

  it.each(['dragArrows', 'setTime'] as const)(
    'shows the Level with 1 minute checked once %s is picked',
    async (game) => {
      const { wrapper } = await open()
      await choice(wrapper, t(`games.${game}.name`)).setValue(true)
      expect(wrapper.text()).toContain(t('settings.level'))
      expect(choice(wrapper, t('levels.1.name')).element.checked).toBe(true)
    },
  )

  it('shows each Mode card with its own icon, hidden from screen readers like the Game icons', async () => {
    const { wrapper } = await open()
    for (const mode of ['teach', 'test'] as const) {
      const card = choice(wrapper, t(`modes.${mode}.name`)).element.closest('label')!
      const icon = card.querySelector('svg')
      expect(icon?.classList).toContain(mode)
      expect(icon?.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('offers the Levels 1, 5 and 15 minutes, smallest step first', async () => {
    const { wrapper } = await open()
    await choice(wrapper, t('games.setTime.name')).setValue(true)
    const levels = wrapper.findAll('.levels label.choice b').map((b) => b.text())
    expect(levels).toEqual([t('levels.1.name'), t('levels.5.name'), t('levels.15.name')])
  })

  it('hides the Level for Drag Hours and shows it again for other Games', async () => {
    const { wrapper } = await open()
    await choice(wrapper, t('games.setTime.name')).setValue(true)
    expect(wrapper.text()).toContain(t('settings.level'))

    await choice(wrapper, t('games.dragHours.name')).setValue(true)
    expect(wrapper.text()).not.toContain(t('settings.level'))
    expect(wrapper.text()).not.toContain(t('levels.15.name'))

    await choice(wrapper, t('games.dragArrows.name')).setValue(true)
    expect(wrapper.text()).toContain(t('settings.level'))
  })

  it('shows Hours for Drag Hours only, with 1–12 checked', async () => {
    const { wrapper } = await open()
    expect(wrapper.text()).toContain(t('settings.hours'))
    const hours = wrapper.findAll('.hours label.choice b').map((b) => b.text())
    expect(hours).toEqual([t('hours.12.name'), t('hours.24.name')])
    expect(choice(wrapper, t('hours.12.name')).element.checked).toBe(true)

    for (const game of ['dragMinutes', 'dragArrows', 'setTime'] as const) {
      await choice(wrapper, t(`games.${game}.name`)).setValue(true)
      expect(wrapper.text()).not.toContain(t('settings.hours'))
    }
  })

  it("names the picked Hours in the Drag Hours card's description", async () => {
    const { wrapper } = await open()
    const card = () => choice(wrapper, t('games.dragHours.name')).element.closest('label')!
    const describes = (hours: 12 | 24) =>
      t('games.dragHours.description', { range: t(`hours.${hours}.name`) })
    expect(card().textContent).toContain(describes(12))
    await choice(wrapper, t('hours.24.name')).setValue(true)
    expect(card().textContent).toContain(describes(24))
    expect(describes(24)).toContain('13–24')
  })

  it('starts a Drag Hours Round in 13–24', async () => {
    const { wrapper } = await open()
    await choice(wrapper, t('hours.24.name')).setValue(true)
    await button(wrapper, t('settings.play')).trigger('click')
    expect(usePlayStore().round).toMatchObject({ game: 'dragHours', hours: 24 })
  })

  it('starts a Round with the chosen Settings and opens it', async () => {
    const { wrapper, router } = await open()
    await choice(wrapper, t('games.setTime.name')).setValue(true)
    await choice(wrapper, t('modes.test.name')).setValue(true)
    await choice(wrapper, t('levels.5.name')).setValue(true)
    await button(wrapper, t('settings.play')).trigger('click')

    expect(usePlayStore().round).toMatchObject({ game: 'setTime', mode: 'test', level: 5 })
    expect(usePlayStore().round?.tasks).toHaveLength(10)
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('round'))
  })

  /** The ⓘ by a section's heading ("Гра" or "Режим"). */
  function infoButton(wrapper: Screen, section: string) {
    const group = wrapper.findAll('fieldset').find((f) => f.find('legend').text() === section)
    if (!group) throw new Error(`No section "${section}"`)
    return group.get(`button[aria-label="${t('info.more')}"]`)
  }

  function gotIt(wrapper: Screen) {
    const found = wrapper
      .get('[role="dialog"]')
      .findAll('button')
      .find((b) => b.text() === t('teach.gotIt'))
    if (!found) throw new Error('No Got it')
    return found
  }

  const describes = (hours: 12 | 24) =>
    t('games.dragHours.description', { range: t(`hours.${hours}.name`) })

  it('opens the Game Info Popup from the ⓘ: all four Games by name, with their descriptions', async () => {
    const { wrapper } = await open()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await infoButton(wrapper, t('settings.game')).trigger('click')
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.get('h2').text()).toBe(t('settings.game'))
    const games = ['dragHours', 'dragMinutes', 'dragArrows', 'setTime'] as const
    expect(dialog.findAll('dt').map((d) => d.text())).toEqual(
      games.map((g) => t(`games.${g}.name`)),
    )
    expect(dialog.findAll('dd').map((d) => d.text())).toEqual([
      describes(12),
      t('games.dragMinutes.description'),
      t('games.dragArrows.description'),
      t('games.setTime.description'),
    ])
    // Text only: no card icons.
    expect(dialog.findAll('svg')).toHaveLength(0)
  })

  it('names the picked Hours in the Drag Hours line of the Game Info Popup', async () => {
    const { wrapper } = await open()
    await choice(wrapper, t('hours.24.name')).setValue(true)
    await infoButton(wrapper, t('settings.game')).trigger('click')
    const text = wrapper.get('[role="dialog"]').text()
    expect(text).toContain(describes(24))
    expect(describes(24)).toContain('13–24')
    expect(text).not.toContain(describes(12))
  })

  it('opens the Mode Info Popup from the ⓘ: Teach and Test with their descriptions', async () => {
    const { wrapper } = await open()
    await infoButton(wrapper, t('settings.mode')).trigger('click')
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.get('h2').text()).toBe(t('settings.mode'))
    expect(dialog.findAll('dt').map((d) => d.text())).toEqual([
      t('modes.teach.name'),
      t('modes.test.name'),
    ])
    expect(dialog.findAll('dd').map((d) => d.text())).toEqual([
      t('modes.teach.description'),
      t('modes.test.description'),
    ])
  })

  it.each(['settings.game', 'settings.mode'] as const)(
    'closes the Info Popup of %s on Got it, leaving the Settings as they were',
    async (section) => {
      const { wrapper } = await open()
      await choice(wrapper, t('games.setTime.name')).setValue(true)
      await choice(wrapper, t('modes.test.name')).setValue(true)
      await choice(wrapper, t('levels.5.name')).setValue(true)
      const before = { ...usePlayStore().settings }

      await infoButton(wrapper, t(section)).trigger('click')
      await gotIt(wrapper).trigger('click')
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
      expect(usePlayStore().settings).toEqual(before)
      expect(choice(wrapper, t('games.setTime.name')).element.checked).toBe(true)
      expect(choice(wrapper, t('modes.test.name')).element.checked).toBe(true)
      expect(choice(wrapper, t('levels.5.name')).element.checked).toBe(true)
    },
  )

  it('goes back to Welcome', async () => {
    const { wrapper, router } = await open()
    await button(wrapper, t('settings.back')).trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('welcome'))
  })
})
