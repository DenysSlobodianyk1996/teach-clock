import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import InfoPopup from '../InfoPopup.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

describe('InfoPopup', () => {
  it('lists each option by name with its description, under the heading', () => {
    wrapper = mountComponent(InfoPopup, {
      heading: 'Режим',
      items: [
        { name: 'Навчання', description: 'З підказками.' },
        { name: 'Перевірка', description: 'Без підказок.' },
      ],
    })
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.get('h2').text()).toBe('Режим')
    expect(dialog.findAll('dt').map((d) => d.text())).toEqual(['Навчання', 'Перевірка'])
    expect(dialog.findAll('dd').map((d) => d.text())).toEqual(['З підказками.', 'Без підказок.'])
  })

  it('has one Got it button, which dismisses it', async () => {
    wrapper = mountComponent(InfoPopup, { heading: 'Гра', text: 'Абзац.' })
    const buttons = wrapper.findAll('button')
    expect(buttons.map((b) => b.text())).toEqual([t('teach.gotIt')])
    await buttons[0]!.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })
})
