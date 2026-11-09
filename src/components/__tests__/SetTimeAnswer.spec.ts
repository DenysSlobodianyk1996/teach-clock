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
    await tap('1', '3', '6', '0')
    await submit().trigger('click')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toContain(t('round.errors.hour'))
    expect(wrapper.get('[role="alert"]').text()).toContain(t('round.errors.minute'))

    await tap(t('round.clear'))
    expect(wrapper.get('[role="alert"]').text()).toBe('')
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

  it('ignores the pad and Submit while disabled', async () => {
    open()
    await tap('0', '7', '3', '0')
    await wrapper.setProps({ disabled: true })
    await tap('5')
    expect(box(t('round.minutes')).text()).toBe('30')
    expect(submit().attributes('disabled')).toBeDefined()
  })
})
