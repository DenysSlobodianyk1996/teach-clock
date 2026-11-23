import { beforeEach, describe, expect, it } from 'vitest'
import WelcomeView from '../WelcomeView.vue'
import { mountScreen } from '@/test/mountScreen'
import { t } from '@/test/i18n'

describe('Welcome screen', () => {
  beforeEach(() => localStorage.clear())

  it('opens the Info Popup with the intro from the ⓘ, and Got it closes it, leaving the name', async () => {
    const { wrapper } = await mountScreen(WelcomeView, '/')
    const field = wrapper.get<HTMLInputElement>('#player-name')
    await field.setValue('Оля')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await wrapper.get(`button[aria-label="${t('info.more')}"]`).trigger('click')
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.text()).toContain(t('welcome.intro'))

    const gotIt = dialog.findAll('button').find((b) => b.text() === t('teach.gotIt'))!
    await gotIt.trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(field.element.value).toBe('Оля')
  })

  it('closes the Info Popup on Escape', async () => {
    const { wrapper } = await mountScreen(WelcomeView, '/')
    await wrapper.get(`button[aria-label="${t('info.more')}"]`).trigger('click')
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('keeps the name error while only spaces are typed, and clears it on a letter', async () => {
    const { wrapper } = await mountScreen(WelcomeView, '/')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[role="alert"]').text()).toBe(t('welcome.nameRequired'))

    await wrapper.get('#player-name').setValue(' ')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)

    await wrapper.get('#player-name').setValue(' О')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
