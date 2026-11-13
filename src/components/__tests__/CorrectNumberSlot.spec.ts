import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import CorrectNumberSlot from '../CorrectNumberSlot.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

/** What each filled slot on the picture shows, by slot id. */
const shown = () =>
  Object.fromEntries(
    wrapper.findAll('[data-slot]').map((g) => [Number(g.attributes('data-slot')), g.text()]),
  )

describe('CorrectNumberSlot', () => {
  it('Drag Hours: lights the right slot in green with its number, between its two neighbours', () => {
    wrapper = mountComponent(CorrectNumberSlot, { game: 'dragHours', number: 7 })
    expect(shown()).toEqual({ 6: '6', 7: '7', 8: '8' })
    expect(wrapper.get('[data-slot="7"]').classes()).toContain('good')
    expect(wrapper.get('[data-slot="6"]').classes()).not.toContain('good')
    expect(wrapper.findAll('.c-slot')).toHaveLength(9)
    expect(wrapper.find('.hour-badge').exists()).toBe(false)
    expect(wrapper.get('svg').attributes('aria-label')).toBe(
      t('numbers.between', { number: 7, before: 6, after: 8 }),
    )
  })

  it('Drag Minutes: shows minutes with Hour Badges, wrapping round the top', () => {
    wrapper = mountComponent(CorrectNumberSlot, { game: 'dragMinutes', number: 12 })
    expect(shown()).toEqual({ 11: '55', 12: '60', 1: '5' })
    expect(wrapper.get('[data-slot="12"]').classes()).toContain('good')
    expect(wrapper.findAll('.hour-badge')).toHaveLength(12)
  })
})
