import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import LeaveRoundDialog from '../LeaveRoundDialog.vue'
import { mountComponent } from '@/test/mountComponent'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

describe('LeaveRoundDialog', () => {
  it('asks to confirm, with Keep playing focused', async () => {
    wrapper = mountComponent(LeaveRoundDialog)
    await wrapper.vm.$nextTick()
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.get('h2').text()).toBe('Покинути раунд?')
    expect(document.activeElement?.textContent?.trim()).toBe('Грати далі')
  })

  it('emits stay or leave', async () => {
    wrapper = mountComponent(LeaveRoundDialog)
    const [stay, leave] = wrapper.findAll('button')
    await stay!.trigger('click')
    await leave!.trigger('click')
    expect(wrapper.emitted('stay')).toHaveLength(1)
    expect(wrapper.emitted('leave')).toHaveLength(1)
  })

  it('keeps playing on Escape', async () => {
    wrapper = mountComponent(LeaveRoundDialog)
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('stay')).toHaveLength(1)
  })
})
