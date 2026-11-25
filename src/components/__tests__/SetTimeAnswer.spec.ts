import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import SetTimeAnswer from '../SetTimeAnswer.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

let wrapper: VueWrapper

afterEach(() => wrapper?.unmount())

function open(props: Record<string, unknown> = {}) {
  wrapper = mountComponent(SetTimeAnswer, props)
  return wrapper
}

const box = (name: string) => wrapper.get(`[aria-label="${name}"]`)
const submit = () => wrapper.findAll('button').find((b) => b.text() === t('round.submit'))!

async function tap(...keys: string[]) {
  for (const key of keys) {
    const button = wrapper
      .findAll('.pad button')
      .find((b) => (b.text() || b.attributes('aria-label')) === key)!
    await button.trigger('click')
  }
}

async function press(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  await wrapper.vm.$nextTick()
}

describe('SetTimeAnswer', () => {
  it('starts with empty boxes, the hour selected and Submit disabled', () => {
    open()
    expect(box(t('round.hours')).attributes('aria-pressed')).toBe('true')
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('false')
    expect(submit().attributes('disabled')).toBeDefined()
  })

  it('shows each box its range underneath, tied to the box for screen readers', () => {
    open()
    const range = (name: string) => {
      const id = box(name).attributes('aria-describedby')!
      return wrapper.get(`[id="${id}"]`).text()
    }
    expect(range(t('round.hours'))).toBe(t('round.range', { from: 1, to: 12 }))
    expect(range(t('round.minutes'))).toBe(t('round.range', { from: 0, to: 59 }))
  })

  it('submits the Clock Time typed on the number pad', async () => {
    open()
    await tap('1', '0', '5', '5')
    expect(box(t('round.hours')).text()).toBe('10')
    expect(box(t('round.minutes')).text()).toBe('55')
    expect(submit().attributes('disabled')).toBeUndefined()
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 10, minute: 55 }]])
  })

  it('lets the Player pick a box, and reads one minute digit as 0X', async () => {
    open()
    await tap('1')
    await box(t('round.minutes')).trigger('click')
    await tap('5')
    await box(t('round.hours')).trigger('click')
    expect(box(t('round.minutes')).text()).toBe('05')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 1, minute: 5 }]])
  })

  it('clears the whole selected box', async () => {
    open()
    await tap('0', '7', '5', '4', t('round.clear'))
    expect(box(t('round.hours')).text()).toBe('07')
    expect(box(t('round.minutes')).text()).toBe('')
  })

  it('shows an error instead of submitting an impossible time, until the Player edits', async () => {
    open()
    await tap('1', '3', '3', '0')
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('true')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe(t('round.errors.hour'))

    await tap(t('round.clear'))
    expect(wrapper.get('[role="alert"]').text()).toBe('')
  })

  it('completes a box after one digit that no second digit could follow, on the pad', async () => {
    open()
    await tap('8')
    expect(box(t('round.hours')).text()).toBe('8')
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('true')
    await tap('7')
    expect(box(t('round.minutes')).text()).toBe('07')
    await tap('3')
    expect(box(t('round.minutes')).text()).toBe('07')
    expect(wrapper.emitted('submit')).toBeUndefined()

    await tap(t('round.clear'), '4', '5')
    expect(box(t('round.minutes')).text()).toBe('45')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 8, minute: 45 }]])
  })

  it('waits for a second digit after hour 0 or 1 and minute 0-5', async () => {
    open()
    await tap('1')
    expect(box(t('round.hours')).attributes('aria-pressed')).toBe('true')
    await tap('1')
    expect(box(t('round.hours')).text()).toBe('11')
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('true')
    await tap('3')
    expect(box(t('round.minutes')).text()).toBe('3')
  })

  it('completes a box after one digit on a physical keyboard too', async () => {
    open()
    await press('9')
    expect(box(t('round.hours')).text()).toBe('9')
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('true')
    await press('6')
    await press('2')
    expect(box(t('round.minutes')).text()).toBe('06')
    await press('ArrowLeft')
    await press('0')
    await press('8')
    expect(box(t('round.hours')).text()).toBe('08')
    await press('Enter')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 8, minute: 6 }]])
  })

  it('works with a physical keyboard', async () => {
    open()
    await press('7')
    await press('ArrowRight')
    await press('4')
    await press('5')
    await press('Backspace')
    await press('3')
    await press('Enter')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 7, minute: 3 }]])
  })

  it('ignores the keyboard while disabled', async () => {
    wrapper = mountComponent(SetTimeAnswer, { disabled: true })
    await press('7')
    expect(box(t('round.hours')).text()).toBe('')
  })

  it('submits on Enter even when a pad key has focus', async () => {
    open()
    await tap('7')
    await box(t('round.minutes')).trigger('click')
    await tap('3')
    const key = wrapper.findAll('.pad button')[2]!
    ;(key.element as HTMLButtonElement).focus()
    key.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 7, minute: 3 }]])
  })

  it('retypes a tapped box without Clear (#88)', async () => {
    open()
    await tap('8', '3', '0')
    await box(t('round.hours')).trigger('click')
    expect(box(t('round.hours')).text()).toBe('8')
    expect(submit().attributes('disabled')).toBeUndefined()
    await tap('1', '1')
    expect(box(t('round.hours')).text()).toBe('11')
    expect(box(t('round.minutes')).text()).toBe('30')

    await box(t('round.minutes')).trigger('click')
    await tap('4', '5')
    expect(box(t('round.minutes')).text()).toBe('45')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 11, minute: 45 }]])
  })

  it('retypes a box chosen with the arrows or Tab focus', async () => {
    open()
    await press('8')
    await press('3')
    await press('0')
    await press('ArrowLeft')
    await press('9')
    expect(box(t('round.hours')).text()).toBe('9')
    await press('ArrowRight')
    await press('4')
    await press('5')
    expect(box(t('round.minutes')).text()).toBe('45')
    await press('Tab')
    await box(t('round.hours')).trigger('focus')
    await press('7')
    await press('Enter')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 7, minute: 45 }]])
  })

  it('highlights the digits a selected box will replace, until a digit or Clear', async () => {
    open()
    const marked = (name: string) => box(name).classes().includes('replace')
    await tap('8', '3', '0')
    expect(marked(t('round.minutes'))).toBe(false)
    await box(t('round.hours')).trigger('click')
    expect(marked(t('round.hours'))).toBe(true)
    expect(marked(t('round.minutes'))).toBe(false)
    await tap('9')
    expect(marked(t('round.hours'))).toBe(false)
    // The hand-over selects the minutes, ready to be retyped.
    expect(marked(t('round.minutes'))).toBe(true)
    await tap(t('round.clear'))
    expect(marked(t('round.minutes'))).toBe(false)
    expect(box(t('round.minutes')).text()).toBe('')
  })

  it('highlights nothing in an empty box', async () => {
    open()
    await box(t('round.minutes')).trigger('click')
    expect(box(t('round.minutes')).classes()).not.toContain('replace')
  })

  it('after Set correct answer, a typed digit replaces the minutes', async () => {
    open()
    ;(wrapper.vm as unknown as { fill(time: { hour: number; minute: number }): void }).fill({
      hour: 4,
      minute: 20,
    })
    await wrapper.vm.$nextTick()
    expect(box(t('round.minutes')).classes()).toContain('replace')
    await tap('1', '5')
    expect(box(t('round.hours')).text()).toBe('4')
    expect(box(t('round.minutes')).text()).toBe('15')
  })

  it('keeps the minutes selected after Set correct answer when the popup gives focus back to the hours', async () => {
    open()
    const hours = box(t('round.hours')).element as HTMLButtonElement
    hours.focus()
    // The wrong-Answer popup takes the focus while it is open.
    hours.blur()
    ;(wrapper.vm as unknown as { fill(time: { hour: number; minute: number }): void }).fill({
      hour: 4,
      minute: 20,
    })
    await wrapper.vm.$nextTick()
    // The wrong-Answer popup closes after the fill and focuses what had the focus before it.
    hours.focus()
    await wrapper.vm.$nextTick()
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('true')
    await tap('1', '5')
    expect(box(t('round.hours')).text()).toBe('4')
    expect(box(t('round.minutes')).text()).toBe('15')
  })

  it('moves the focus with the selection, and a focus on coming back to the window re-arms nothing', async () => {
    open()
    ;(box(t('round.hours')).element as HTMLButtonElement).focus()
    await press('8')
    expect(document.activeElement).toBe(box(t('round.minutes')).element)
    await press('3')
    // The browser focuses the focused button again when the window or tab gets the focus back.
    await box(t('round.minutes')).trigger('focus')
    await press('0')
    expect(box(t('round.minutes')).text()).toBe('30')
    await press('ArrowLeft')
    expect(document.activeElement).toBe(box(t('round.hours')).element)
  })

  it('selects no box while disabled', async () => {
    open({ disabled: true })
    await box(t('round.minutes')).trigger('click')
    await press('Tab')
    await box(t('round.minutes')).trigger('focus')
    expect(box(t('round.hours')).attributes('aria-pressed')).toBe('true')
    expect(box(t('round.minutes')).attributes('aria-pressed')).toBe('false')
  })

  it('ignores the pad and Submit while disabled', async () => {
    open()
    await tap('0', '7', '3', '0')
    await wrapper.setProps({ disabled: true })
    await tap('5')
    expect(box(t('round.minutes')).text()).toBe('30')
    expect(submit().attributes('disabled')).toBeDefined()
  })
})
