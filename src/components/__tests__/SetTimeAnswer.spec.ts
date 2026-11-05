import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import SetTimeAnswer from '../SetTimeAnswer.vue'
import { mountComponent } from '@/test/mountComponent'

let wrapper: VueWrapper

afterEach(() => wrapper?.unmount())

function open(props: Record<string, unknown> = {}) {
  wrapper = mountComponent(SetTimeAnswer, props)
  return wrapper
}

const box = (name: string) => wrapper.get(`[aria-label="${name}"]`)
const submit = () => wrapper.findAll('button').find((b) => b.text() === 'Перевірити')!

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
    expect(box('Години').attributes('aria-pressed')).toBe('true')
    expect(box('Хвилини').attributes('aria-pressed')).toBe('false')
    expect(submit().attributes('disabled')).toBeDefined()
  })

  it('submits the Clock Time typed on the number pad', async () => {
    open()
    await tap('1', '0', '5', '5')
    expect(box('Години').text()).toBe('10')
    expect(box('Хвилини').text()).toBe('55')
    expect(submit().attributes('disabled')).toBeUndefined()
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 10, minute: 55 }]])
  })

  it('lets the Player pick a box, and reads one minute digit as 0X', async () => {
    open()
    await tap('1')
    await box('Хвилини').trigger('click')
    await tap('5')
    await box('Години').trigger('click')
    expect(box('Хвилини').text()).toBe('05')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 1, minute: 5 }]])
  })

  it('clears the whole selected box', async () => {
    open()
    await tap('0', '7', '5', '4', 'Стерти')
    expect(box('Години').text()).toBe('07')
    expect(box('Хвилини').text()).toBe('')
  })

  it('shows an error instead of submitting an impossible time, until the Player edits', async () => {
    open()
    await tap('1', '3', '6', '0')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toContain('Години — від 1 до 12')
    expect(wrapper.get('[role="alert"]').text()).toContain('Хвилини — від 00 до 59')

    await tap('Стерти')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
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
    expect(box('Години').text()).toBe('')
  })

  it('submits on Enter even when a pad key has focus', async () => {
    open()
    await tap('7')
    await box('Хвилини').trigger('click')
    await tap('3')
    const key = wrapper.findAll('.pad button')[2]!
    ;(key.element as HTMLButtonElement).focus()
    key.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(wrapper.emitted('submit')).toEqual([[{ hour: 7, minute: 3 }]])
  })

  it('ignores the pad and Submit while disabled', async () => {
    open()
    await tap('0', '7', '3', '0')
    await wrapper.setProps({ disabled: true })
    await tap('5')
    expect(box('Хвилини').text()).toBe('30')
    expect(submit().attributes('disabled')).toBeDefined()
  })
})
