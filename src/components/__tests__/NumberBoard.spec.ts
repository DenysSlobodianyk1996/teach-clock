import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import NumberBoard from '../NumberBoard.vue'
import { mountComponent } from '@/test/mountComponent'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

/** The face drawn 220 px across at the page's top left, so 1 px is 1 clock unit from (110, 110). */
function mountBoard(props: Record<string, unknown> = {}) {
  wrapper = mountComponent(NumberBoard, {
    game: 'dragHours',
    slots: Array(12).fill(null),
    tray: [7, 3, 12],
    ...props,
  })
  vi.spyOn(wrapper.get('svg').element, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 220, 220),
  )
}

async function pointer(
  target: { element: Element },
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  clientX: number,
  clientY: number,
) {
  target.element.dispatchEvent(
    new PointerEvent(type, { pointerId: 1, button: 0, clientX, clientY, bubbles: true }),
  )
  await nextTick()
}

const tile = (n: number) => wrapper.get(`.tray [data-number="${n}"]`)
const slot = (n: number) => wrapper.get(`[data-slot="${n}"]`)
/** Slot 3 sits 66 units right of the centre. */
const AT_3 = [176, 110] as const
/** The free slots that show the orange "ready" ring. */
const readySlots = () =>
  wrapper
    .findAll('[data-slot]')
    .filter((s) => s.classes('ready'))
    .map((s) => Number(s.attributes('data-slot')))

describe('NumberBoard', () => {
  it('drops a tile dragged onto a free slot', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', 200, 110)
    await pointer(tile(7), 'pointermove', ...AT_3)
    expect(slot(3).find('.c-slot.target').exists()).toBe(true)
    await pointer(tile(7), 'pointerup', ...AT_3)
    expect(wrapper.emitted('drop')).toEqual([[7, 3]])
  })

  it('drops on the highlighted slot even when the finger slips off it as it lifts', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', ...AT_3)
    expect(slot(3).find('.c-slot.target').exists()).toBe(true)
    // 30 units right of slot 3: past its reach, the way a lifting finger can slide.
    await pointer(tile(7), 'pointerup', 206, 110)
    expect(wrapper.emitted('drop')).toEqual([[7, 3]])
  })

  it('rings every free slot while a tile is dragged, and clears them on the drop', async () => {
    mountBoard({ slots: [1, ...Array(11).fill(null)], tray: [7, 3, 12] })
    await pointer(tile(7), 'pointerdown', 300, 100)
    expect(readySlots()).toEqual([])
    await pointer(tile(7), 'pointermove', 200, 110)
    expect(readySlots()).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    await pointer(tile(7), 'pointermove', ...AT_3)
    expect(slot(3).find('.c-slot.target').exists()).toBe(true)
    await pointer(tile(7), 'pointerup', ...AT_3)
    expect(readySlots()).toEqual([])
  })

  it('clears the ringed slots when a drag is cancelled', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', 200, 110)
    expect(readySlots()).toHaveLength(12)
    await pointer(tile(7), 'pointercancel', 200, 110)
    expect(readySlots()).toEqual([])
  })

  it('lets go of a picked or dragged number that leaves the tray without the Player', async () => {
    mountBoard()
    await tile(7).trigger('click')
    await pointer(tile(3), 'pointerdown', 300, 100)
    await pointer(tile(3), 'pointermove', 200, 110)
    await wrapper.setProps({
      tray: [12],
      slots: [null, null, 3, null, null, null, 7, ...Array(5).fill(null)],
    })
    expect(readySlots()).toEqual([])
    await pointer(tile(12), 'pointerup', ...AT_3)
    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('does not ring the slots for a short press', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', 302, 101)
    expect(readySlots()).toEqual([])
  })

  it('drops nothing when let go away from a slot', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', 110, 110)
    await pointer(tile(7), 'pointerup', 110, 110)
    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('does not drop on a slot that already holds a number', async () => {
    mountBoard({ slots: [null, null, 3, ...Array(9).fill(null)], tray: [7, 12] })
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', ...AT_3)
    await pointer(tile(7), 'pointerup', ...AT_3)
    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('drops a tapped tile on the slot tapped next, by mouse or keyboard', async () => {
    mountBoard()
    await tile(12).trigger('click')
    expect(tile(12).attributes('aria-pressed')).toBe('true')
    await slot(5).trigger('click')
    expect(wrapper.emitted('drop')).toEqual([[12, 5]])
    await tile(3).trigger('click')
    await slot(1).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('drop')).toEqual([
      [12, 5],
      [3, 1],
    ])
  })

  it('shows placed numbers on the face and leaves their slots alone', async () => {
    mountBoard({ slots: [null, null, 3, ...Array(9).fill(null)], tray: [7, 12] })
    expect(slot(3).text()).toBe('3')
    await tile(7).trigger('click')
    await slot(3).trigger('click')
    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('takes a tap right after a drag that ended on the face', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', 110, 110)
    await pointer(tile(7), 'pointerup', 110, 110)
    await pointer(tile(3), 'pointerdown', 300, 100)
    await pointer(tile(3), 'pointerup', 300, 100)
    await tile(3).trigger('click')
    expect(tile(3).attributes('aria-pressed')).toBe('true')
  })

  it('takes a keyboard pick right after a drag that placed a tile', async () => {
    mountBoard()
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', ...AT_3)
    await pointer(tile(7), 'pointerup', ...AT_3)
    // Enter on a focused button clicks it with detail 0 and no pointer events.
    tile(12).element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
    await nextTick()
    expect(tile(12).attributes('aria-pressed')).toBe('true')
  })

  it('ignores the Player while disabled', async () => {
    mountBoard({ disabled: true })
    await pointer(tile(7), 'pointerdown', 300, 100)
    await pointer(tile(7), 'pointermove', ...AT_3)
    await pointer(tile(7), 'pointerup', ...AT_3)
    expect(wrapper.emitted('drop')).toBeUndefined()
  })
})

describe('NumberBoard in Test (movable)', () => {
  /** 3 on slot 3 and 7 on slot 9, 12 still on the tray. */
  const SLOTS = [null, null, 3, null, null, null, null, null, 7, null, null, null]
  /** Slot 9 sits 66 units left of the centre. */
  const AT_9 = [44, 110] as const

  it('drops a placed number dragged onto another one, for a swap', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    await pointer(slot(3), 'pointerdown', ...AT_3)
    await pointer(slot(3), 'pointermove', 100, 110)
    await pointer(slot(3), 'pointermove', ...AT_9)
    await pointer(slot(3), 'pointerup', ...AT_9)
    expect(wrapper.emitted('drop')).toEqual([[3, 9]])
  })

  it('drops a tray number on a taken slot', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    await tile(12).trigger('click')
    await slot(9).trigger('click')
    expect(wrapper.emitted('drop')).toEqual([[12, 9]])
  })

  it('drops a moved face number on the highlighted slot even when the release slips', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    await pointer(slot(3), 'pointerdown', ...AT_3)
    await pointer(slot(3), 'pointermove', 100, 110)
    await pointer(slot(3), 'pointermove', ...AT_9)
    await pointer(slot(3), 'pointerup', 14, 110)
    expect(wrapper.emitted('drop')).toEqual([[3, 9]])
  })

  it('rings only the free slots while a face number is dragged', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    await pointer(slot(3), 'pointerdown', ...AT_3)
    await pointer(slot(3), 'pointermove', 100, 110)
    expect(readySlots()).toEqual([1, 2, 4, 5, 6, 7, 8, 10, 11, 12])
  })

  it('takes a placed number back when it is let go over the tray', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    vi.spyOn(wrapper.get('.tray').element, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(300, 0, 200, 100),
    )
    await pointer(slot(3), 'pointerdown', ...AT_3)
    await pointer(slot(3), 'pointermove', 400, 50)
    await pointer(slot(3), 'pointerup', 400, 50)
    expect(wrapper.emitted('toTray')).toEqual([[3]])
    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('moves a tapped placed number to the slot tapped next, or back to the tray', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    await slot(3).trigger('click')
    expect(slot(3).attributes('aria-pressed')).toBe('true')
    await slot(9).trigger('click')
    expect(wrapper.emitted('drop')).toEqual([[3, 9]])
    await slot(9).trigger('keydown', { key: 'Enter' })
    await wrapper.get('.tray').trigger('click')
    expect(wrapper.emitted('toTray')).toEqual([[7]])
  })

  it('takes a picked-up face number back to the tray with Delete', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    await slot(9).trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('toTray')).toEqual([[7]])
  })

  it('keeps keyboard focus on a slot when its number moves away', async () => {
    mountBoard({ slots: SLOTS, tray: [12], movable: true })
    const before = slot(9).element
    ;(before as SVGElement).focus()
    await wrapper.setProps({ slots: [null, null, 3, null, null, 7, ...Array(6).fill(null)] })
    expect(slot(9).element).toBe(before)
    expect(document.activeElement).toBe(before)
  })

  it('in Teach, leaves placed numbers locked', async () => {
    mountBoard({ slots: SLOTS, tray: [12] })
    expect(slot(3).attributes('role')).toBeUndefined()
    await tile(12).trigger('click')
    await slot(9).trigger('click')
    expect(wrapper.emitted('drop')).toBeUndefined()
  })
})
