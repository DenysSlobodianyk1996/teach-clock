import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import HintClock from '../HintClock.vue'
import { clockTime } from '@/game/clockTime'
import { mountComponent } from '@/test/mountComponent'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

describe('HintClock', () => {
  it('shows the correct Clock Time with its Lit Place and its digits', () => {
    wrapper = mountComponent(HintClock, { time: clockTime(7, 15) })
    expect(wrapper.find('[data-lit-tick]').exists()).toBe(true)
    expect(wrapper.findAll('.c-num.lit').map((n) => n.text())).toEqual(['7'])
    expect(wrapper.text()).toContain('7:15')
  })
})
