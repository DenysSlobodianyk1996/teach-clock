import { describe, expect, it } from 'vitest'
import ProgressDots from '../ProgressDots.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

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
    expect(wrapper.attributes('aria-label')).toBe(t('round.progressLabel', { n: 1, total: 10 }))
  })

  it('shows placed numbers in a neutral colour, with no current dot and its own label', () => {
    const wrapper = mountComponent(ProgressDots, {
      statuses: ['placed', 'placed', 'pending'],
      label: t('numbers.placedLabel', { n: 2, total: 3 }),
    })
    expect(wrapper.findAll('.dot').map((d) => d.classes().filter((c) => c !== 'dot'))).toEqual([
      ['placed'],
      ['placed'],
      [],
    ])
    expect(wrapper.attributes('aria-label')).toBe(t('numbers.placedLabel', { n: 2, total: 3 }))
  })
})
