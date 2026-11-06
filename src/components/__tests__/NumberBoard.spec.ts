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
  type: 'pointerdown' | 'pointermove' | 'pointerup',
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
