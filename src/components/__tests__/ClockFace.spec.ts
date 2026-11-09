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

/** The rotation of the lit minute tick. */
const litTick = (wrapper: VueWrapper) =>
  (wrapper.get('[data-lit-tick]').element as SVGElement).style.transform

/** The numbers lit up on the face. */
const litNumbers = (wrapper: VueWrapper) => wrapper.findAll('.c-num.lit').map((n) => n.text())

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

  it('lights nothing unless asked, as on Summary and popup clocks', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(7, 45) })
    expect(wrapper.find('[data-lit-tick]').exists()).toBe(false)
    expect(wrapper.find('.c-num.lit').exists()).toBe(false)
  })

  it('lights the minute tick and the hour number the hands point to', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(2, 55), pointed: true })
    expect(litTick(wrapper)).toBe('rotate(330deg)')
    expect(litNumbers(wrapper)).toEqual(['2'])
  })

  it('at 3:15 lights both the tick at 3 and the number 3', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(3, 15), pointed: true })
    expect(litTick(wrapper)).toBe('rotate(90deg)')
    expect(litNumbers(wrapper)).toEqual(['3'])
  })

  it('moves the lit places with the time', async () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(12, 0), pointed: true })
    expect(litTick(wrapper)).toBe('rotate(0deg)')
    expect(litNumbers(wrapper)).toEqual(['12'])
    await wrapper.setProps({ time: clockTime(4, 20) })
    expect(litTick(wrapper)).toBe('rotate(120deg)')
    expect(litNumbers(wrapper)).toEqual(['4'])
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
  function draggable(pointed = false) {
    const wrapper = mountComponent(ClockFace, { time: clockTime(12, 0), draggable: true, pointed })
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

  it('draws no ring over the grips while a hand is dragged', async () => {
    const wrapper = draggable()
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown')
    expect(wrapper.find('.c-target').exists()).toBe(false)
  })

  it('draws the lit number over the grips, so at 3:15 the Minute Hand grip cannot hide the 3', async () => {
    const wrapper = draggable(true)
    await wrapper.setProps({ time: clockTime(3, 15) })
    const lit = wrapper.get('.c-num.lit').element
    const grip = wrapper.get('[data-grip="minute"]').element
    expect(grip.compareDocumentPosition(lit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(wrapper.findAll('.c-num:not(.c-lit-glow)').map((n) => n.text())).toHaveLength(12)
  })

  it('draws every number over the hands and grips in Drag Arrows, so no grip hides a number', async () => {
    const wrapper = draggable()
    await wrapper.setProps({ time: clockTime(9, 15) })
    const grips = wrapper.findAll('[data-grip]').map((g) => g.element)
    const numbers = wrapper.findAll('.c-num')
    expect(numbers.map((n) => n.text())).toHaveLength(12)
    for (const number of numbers)
      for (const grip of grips)
        expect(
          grip.compareDocumentPosition(number.element) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
  })

  it('keeps the numbers under the hands on a clock without grips', () => {
    const wrapper = mountComponent(ClockFace, { time: clockTime(1, 10) })
    const hand = wrapper.get('[data-hand="hour"]').element
    for (const number of wrapper.findAll('.c-num'))
      expect(
        hand.compareDocumentPosition(number.element) & Node.DOCUMENT_POSITION_PRECEDING,
      ).toBeTruthy()
  })

  it('draws both grips the same size', () => {
    const wrapper = draggable()
    const size = (hand: string) => wrapper.get(`[data-grip="${hand}"] .c-grip`).attributes('r')
    expect(size('hour')).toBe(size('minute'))
  })

  it('keeps the lit places on the hands through a drag and after letting go', async () => {
    const wrapper = draggable(true)
    expect(litNumbers(wrapper)).toEqual(['12'])
    await pointer(wrapper.find('[data-grip="minute"] .c-grip'), 'pointerdown')
    await wrapper.setProps({ time: clockTime(12, 20) })
    expect(litTick(wrapper)).toBe('rotate(120deg)')
    await pointer(wrapper, 'pointerup')
    expect(litTick(wrapper)).toBe('rotate(120deg)')
    expect(litNumbers(wrapper)).toEqual(['12'])
  })

  it('ignores moves that are not part of a drag', async () => {
    const wrapper = draggable()
    await pointer(wrapper, 'pointermove', 200, 100)
    expect(wrapper.emitted('drag')).toBeUndefined()
  })
})
