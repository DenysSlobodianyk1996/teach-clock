import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import { mountScreen } from '@/test/mountScreen'
import { t, tEn } from '@/test/i18n'

type Screen = Awaited<ReturnType<typeof mountScreen>>['wrapper']

/** The pressed button in the switch group named `group`, by its accessible name. */
function switchButton(wrapper: Screen, group: string, name: string) {
  const found = wrapper
    .find(`[role="group"][aria-label="${group}"]`)
    .findAll('button')
    .find((b) => (b.attributes('aria-label') ?? b.text()) === name)
  if (!found) throw new Error(`No "${name}" in "${group}"`)
  return found
}

async function open() {
  const screen = await mountScreen(App, '/')
  await flushPromises()
  return screen.wrapper
}

describe('Preferences in the header', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('starts in Ukrainian with the middle theme', async () => {
    const wrapper = await open()
    expect(document.documentElement.lang).toBe('uk')
    expect(document.documentElement.dataset.theme).toBe('middle')
    expect(
      switchButton(wrapper, t('header.language'), t('languages.uk')).attributes('aria-pressed'),
    ).toBe('true')
    expect(
      switchButton(wrapper, t('header.theme'), t('themes.middle')).attributes('aria-pressed'),
    ).toBe('true')
  })

  it('switches the interface to English', async () => {
    const wrapper = await open()
    await switchButton(wrapper, t('header.language'), t('languages.en')).trigger('click')
    expect(wrapper.find('h1').text()).toBe(tEn('welcome.title'))
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(tEn('app.name'))
    expect(localStorage.getItem('teach-clock.locale')).toBe('en')
  })

  it('switches the theme', async () => {
    const wrapper = await open()
    await switchButton(wrapper, t('header.theme'), t('themes.light')).trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('teach-clock.theme')).toBe('light')
  })

  it('has one button that cycles the theme, for phones', async () => {
    const wrapper = await open()
    const cycle = () =>
      wrapper
        .findAll('button')
        .find((b) => b.attributes('aria-label')?.startsWith(t('header.theme')))!
    expect(cycle().attributes('aria-label')).toBe(t('header.nextTheme.middle'))
    await cycle().trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(cycle().attributes('aria-label')).toBe(t('header.nextTheme.dark'))
  })
})
