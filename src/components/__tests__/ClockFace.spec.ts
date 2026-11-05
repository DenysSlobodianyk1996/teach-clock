import { describe, expect, it } from 'vitest'
import ClockFace from '../ClockFace.vue'
import { clockTime } from '@/game/clockTime'
import { mountComponent } from '@/test/mountComponent'

describe('ClockFace', () => {
  it('names the Clock Time it shows', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(7, 45) })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Годинник показує 7:45')
  })

  it('draws the numbers 1–12', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(3, 0) })
    expect(wrapper.findAll('text').map((t) => t.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ])
  })

  it('turns the hands to the Clock Time, with the Hour Hand between numbers', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(7, 45) })
    expect(wrapper.find('[data-hand="hour"]').attributes('transform')).toBe('rotate(232.5)')
    expect(wrapper.find('[data-hand="minute"]').attributes('transform')).toBe('rotate(270)')
  })
})
