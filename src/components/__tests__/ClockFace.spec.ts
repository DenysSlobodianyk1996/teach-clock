import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import ClockFace from '../ClockFace.vue'
import { clockTime } from '@/game/clockTime'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

/** Fires a pointer event at a spot on the page, the way a finger or mouse would. */
async function pointer(
  target: DOMWrapper<Element> | VueWrapper,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  clientX = 0,
  clientY = 0,
  init: PointerEventInit = {},
) {
  target.element.dispatchEvent(
    new PointerEvent(type, { pointerId: 1, clientX, clientY, bubbles: true, ...init }),
  )
  await nextTick()
}

/** The rotation a hand is drawn with. */
const turn = (wrapper: VueWrapper, hand: 'hour' | 'minute') =>
  (wrapper.get(`[data-hand="${hand}"]`).element as SVGElement).style.transform

describe('ClockFace', () => {
  it('names the Clock Time it shows', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(7, 45) })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe(t('app.clockShows', { time: '7:45' }))
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
    expect(turn(wrapper, 'hour')).toBe('rotate(232.5deg)')
    expect(turn(wrapper, 'minute')).toBe('rotate(270deg)')
  })

  it('winds both hands together the shorter way, forward across 12', async () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(11, 55), animate: true })
    expect(wrapper.classes()).toContain('animate')
    await wrapper.setProps({ time: clockTime(12, 5) })
    expect(turn(wrapper, 'minute')).toBe('rotate(390deg)')
    expect(turn(wrapper, 'hour')).toBe('rotate(362.5deg)')
  })

  it('never turns the hands in opposite directions', async () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(12, 0), animate: true })
    // 6:30 is 5½ hours back: the Minute Hand winds back 5½ turns, the Hour Hand 165°.
    await wrapper.setProps({ time: clockTime(6, 30) })
    expect(turn(wrapper, 'minute')).toBe('rotate(-1980deg)')
    expect(turn(wrapper, 'hour')).toBe('rotate(-165deg)')
  })

  it('jumps straight to the new time when not animating', async () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(11, 55) })
    await wrapper.setProps({ time: clockTime(12, 5) })
    expect(turn(wrapper, 'minute')).toBe('rotate(30deg)')
    expect(turn(wrapper, 'hour')).toBe('rotate(2.5deg)')
  })

  it('lights no tick on a clock that is not being dragged', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(7, 45) })
    expect(wrapper.find('[data-target-tick]').exists()).toBe(false)
  })

  it('only animates when asked', () => {
    expect(mountComponent(ClockFace, { time: clockTime(3, 0) }).classes()).not.toContain('animate')
  })

  it('has no grips and emits nothing when read-only', async () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(3, 0) })
    expect(wrapper.find('.c-grip').exists()).toBe(false)
    await pointer(wrapper.find('[data-hand="minute"]'), 'pointerdown')
    await pointer(wrapper, 'pointermove', 200, 100)
    expect(wrapper.emitted('drag')).toBeUndefined()
  })
})

describe('ClockFace with draggable hands', () => {
  /** A draggable clock drawn 200 px square at the page's top-left, so its centre is (100, 100). */
  function draggable() {
    const wrapper = mountComponent(ClockFace, { time: clockTime(12, 0), draggable: true })
    wrapper.element.getBoundingClientRect = () => DOMRect.fromRect({ width: 200, height: 200 })
    return wrapper
  }

  it('says the hands can be dragged', () => {
    expect(draggable().attributes('aria-label')).toBe(t('app.clockDrag', { time: '12:00' }))
  })

  it('emits the pointer angle for the grabbed hand while it is dragged', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown')
    await pointer(wrapper, 'pointermove', 200, 100)
    await pointer(wrapper, 'pointermove', 100, 200)
    expect(wrapper.emitted('drag')).toEqual([
      [{ hand: 'minute', angle: 90 }],
      [{ hand: 'minute', angle: 180 }],
    ])
  })

  it('drags the Hour Hand when its grip is grabbed', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="hour"] .c-grip'), 'pointerdown')
    await pointer(wrapper, 'pointermove', 0, 100)
    expect(wrapper.emitted('drag')).toEqual([[{ hand: 'hour', angle: 270 }]])
  })

  it('only a grip starts a drag, so pressing the tail past the pin cannot flip a hand', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-hand="minute"]'), 'pointerdown')
    await pointer(wrapper, 'pointermove', 100, 200)
    expect(wrapper.emitted('drag')).toBeUndefined()
  })

  it('ignores moves close to the pin, where the direction swings wildly', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown')
    await pointer(wrapper, 'pointermove', 105, 108)
    await pointer(wrapper, 'pointermove', 100, 140)
    expect(wrapper.emitted('drag')).toEqual([[{ hand: 'minute', angle: 180 }]])
  })

  it('ends the drag when a mouse moves with no button pressed', async () => {
    const wrapper = draggable()
    const mouse = { pointerType: 'mouse' }
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown', 0, 0, mouse)
    await pointer(wrapper, 'pointermove', 200, 100, { ...mouse, buttons: 0 })
    await pointer(wrapper, 'pointermove', 100, 200, { ...mouse, buttons: 1 })
    expect(wrapper.emitted('drag')).toBeUndefined()
  })

  it('ignores a right-click on a grip', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown', 0, 0, { button: 2 })
    await pointer(wrapper, 'pointermove', 200, 100)
    expect(wrapper.emitted('drag')).toBeUndefined()
  })

  it('marks the dragged hand and stops on release', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown')
    expect(wrapper.find('[data-grip="minute"]').classes()).toContain('dragging')
    expect(wrapper.find('[data-grip="hour"]').classes()).not.toContain('dragging')
    await pointer(wrapper, 'pointerup')
    expect(wrapper.find('[data-grip="minute"]').classes()).not.toContain('dragging')
    await pointer(wrapper, 'pointermove', 200, 100)
    expect(wrapper.emitted('drag')).toBeUndefined()
  })

  it('lights the tick for the minute the Minute Hand lands on while it is dragged', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown')
    expect(wrapper.get('[data-target-tick]').attributes('style')).toContain('rotate(0deg)')
    await wrapper.setProps({ time: clockTime(12, 20) })
    expect(wrapper.get('[data-target-tick]').attributes('style')).toContain('rotate(120deg)')
    await pointer(wrapper, 'pointerup')
    expect(wrapper.find('[data-target-tick]').exists()).toBe(false)
  })

  it('lights the tick for the hour the Hour Hand lands on while it is dragged', async () => {
    const wrapper = draggable()
    await wrapper.setProps({ time: clockTime(4, 30) })
    await pointer(wrapper.find('[data-grip="hour"] .c-grip'), 'pointerdown')
    // On the 4, not where the hand sits halfway to 5.
    expect(wrapper.get('[data-target-tick]').attributes('style')).toContain('rotate(120deg)')
    expect(wrapper.get('[data-target-tick]').classes()).toContain('hour')
  })

  it('ignores moves that are not part of a drag', async () => {
    const wrapper = draggable()
    await pointer(wrapper, 'pointermove', 200, 100)
    expect(wrapper.emitted('drag')).toBeUndefined()
  })
})
