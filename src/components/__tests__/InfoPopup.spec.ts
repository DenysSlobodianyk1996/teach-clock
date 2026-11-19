import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import InfoPopup from '../InfoPopup.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

// The popup shows whatever it is given; neutral test data, not interface text.
describe('InfoPopup', () => {
  it('lists each option by name with its description, under the heading', () => {
    wrapper = mountComponent(InfoPopup, {
      heading: 'Section',
      items: [
        { name: 'Option A', description: 'About A.' },
        { name: 'Option B', description: 'About B.' },
      ],
    })
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.get('h2').text()).toBe('Section')
    expect(dialog.findAll('dt').map((d) => d.text())).toEqual(['Option A', 'Option B'])
    expect(dialog.findAll('dd').map((d) => d.text())).toEqual(['About A.', 'About B.'])
  })

  it('has one Got it button, which dismisses it', async () => {
    wrapper = mountComponent(InfoPopup, { heading: 'Section', text: 'A paragraph.' })
    const buttons = wrapper.findAll('button')
    expect(buttons.map((b) => b.text())).toEqual([t('teach.gotIt')])
    await buttons[0]!.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })
})
