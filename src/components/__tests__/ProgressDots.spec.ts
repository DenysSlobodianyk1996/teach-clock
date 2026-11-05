import { describe, expect, it } from 'vitest'
import ProgressDots from '../ProgressDots.vue'
import { mountComponent } from '@/test/mountComponent'

describe('ProgressDots', () => {
  it('colours done Tasks green, red or yellow (needed help) and rings the current one', () => {
    const wrapper = mountComponent(ProgressDots, {
      statuses: ['right', 'wrong', 'helped', 'pending', 'pending'],
      current: 3,
    })
    expect(wrapper.findAll('.dot').map((d) => d.classes().filter((c) => c !== 'dot'))).toEqual([
      ['ok'],
      ['bad'],
      ['help'],
      ['now'],
      [],
    ])
  })

  it('tells screen readers which Task is being played', () => {
    const wrapper = mountComponent(ProgressDots, {
      statuses: Array(10).fill('pending'),
      current: 0,
    })
    expect(wrapper.attributes('aria-label')).toBe('Прогрес: завдання 1 з 10')
  })
})
