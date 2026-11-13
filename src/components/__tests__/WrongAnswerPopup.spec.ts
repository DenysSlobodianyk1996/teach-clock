import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import WrongAnswerPopup from '../WrongAnswerPopup.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

const LINE = 'The short hand shows the hour.'
const open = () =>
  mountComponent(WrongAnswerPopup, { line: LINE }, { default: '<div class="picture">7:30</div>' })

describe('WrongAnswerPopup', () => {
  it('shows the title, the picture and the teaching line, with Got it first and focused', async () => {
    wrapper = open()
    await wrapper.vm.$nextTick()
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.get('h2').text()).toBe(t('teach.wrongTitle'))
    expect(dialog.get('.picture').text()).toBe('7:30')
    expect(dialog.get('#wrong-why').text()).toBe(LINE)
    expect(dialog.findAll('button').map((b) => b.text())).toEqual([
      t('teach.gotIt'),
      t('teach.setCorrect'),
    ])
    expect(document.activeElement?.textContent?.trim()).toBe(t('teach.gotIt'))
  })

  it('Got it emits dismiss; Set correct answer emits setCorrect', async () => {
    wrapper = open()
    const [gotIt, setCorrect] = wrapper.findAll('button')
    await gotIt!.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
    expect(wrapper.emitted('setCorrect')).toBeUndefined()
    await setCorrect!.trigger('click')
    expect(wrapper.emitted('setCorrect')).toHaveLength(1)
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('Escape and a click on the scrim emit dismiss', async () => {
    wrapper = open()
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await wrapper.get('.scrim').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(2)
  })
})
