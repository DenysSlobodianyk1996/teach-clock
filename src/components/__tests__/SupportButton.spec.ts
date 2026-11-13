import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import SupportButton from '../SupportButton.vue'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

const url = 'https://send.monobank.ua/jar/example'

let wrapper: VueWrapper
let open: ReturnType<typeof vi.fn<typeof window.open>>

beforeEach(() => {
  vi.useFakeTimers()
  open = vi.fn<typeof window.open>()
  vi.stubGlobal('open', open)
  wrapper = mountComponent(SupportButton, { url })
})
afterEach(() => {
  wrapper.unmount()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const button = () => wrapper.get('button')

describe('SupportButton', () => {
  it('names itself and shows the hold hint', () => {
    expect(button().attributes('aria-label')).toBe(t('support.button'))
    expect(wrapper.text()).toContain(t('support.hold'))
  })

  it('opens nothing after a 1.9 s hold', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(1900)
    expect(open).not.toHaveBeenCalled()
  })

  it('opens the url once after a 2 s hold', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(2000)
    vi.advanceTimersByTime(5000)
    expect(open).toHaveBeenCalledExactlyOnceWith(url, '_blank', 'noopener')
  })

  it('shows the ring filling while held, and resets on early release', async () => {
    await button().trigger('pointerdown')
    expect(button().classes()).toContain('holding')
    vi.advanceTimersByTime(1500)
    await button().trigger('pointerup')
    expect(button().classes()).not.toContain('holding')
    vi.advanceTimersByTime(1000)
    expect(open).not.toHaveBeenCalled()
    // A new hold starts from zero.
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(1900)
    expect(open).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(open).toHaveBeenCalledOnce()
  })

  it('cancels when the pointer leaves', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(1000)
    await button().trigger('pointerleave')
    vi.advanceTimersByTime(2000)
    expect(open).not.toHaveBeenCalled()
  })

  it.each(['Enter', ' '])('opens after holding %j for 2 s', async (key) => {
    await button().trigger('keydown', { key })
    vi.advanceTimersByTime(1000)
    // Key repeat while held does not restart the hold.
    await button().trigger('keydown', { key, repeat: true })
    vi.advanceTimersByTime(1000)
    expect(open).toHaveBeenCalledOnce()
    await button().trigger('keyup', { key })
  })

  it('cancels when the key is let go early', async () => {
    await button().trigger('keydown', { key: 'Enter' })
    vi.advanceTimersByTime(1500)
    await button().trigger('keyup', { key: 'Enter' })
    vi.advanceTimersByTime(2000)
    expect(open).not.toHaveBeenCalled()
  })

  it('does nothing on a plain click', async () => {
    await button().trigger('click')
    vi.advanceTimersByTime(3000)
    expect(open).not.toHaveBeenCalled()
  })
})
