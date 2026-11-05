import { describe, expect, it } from 'vitest'
import NumberPad from '../NumberPad.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

describe('NumberPad', () => {
  it('has the digits 0–9 and a clear key', () => {
    const wrapper = mountComponent(NumberPad)
    expect(wrapper.findAll('button').map((b) => b.text() || b.attributes('aria-label'))).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      t('round.clear'),
    ])
  })

  it('emits the pressed digit and clear', async () => {
    const wrapper = mountComponent(NumberPad)
    const buttons = wrapper.findAll('button')
    await buttons[6]!.trigger('click')
    await buttons[9]!.trigger('click')
    await buttons[10]!.trigger('click')
    expect(wrapper.emitted('digit')).toEqual([[7], [0]])
    expect(wrapper.emitted('clear')).toEqual([[]])
  })
})
