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
  vi.restoreAllMocks()
  vi.useRealTimers()
})

const button = () => wrapper.get('button')

describe('SupportButton', () => {
  it('names itself and shows the hold hint', () => {
    expect(button().attributes('aria-label')).toBe(t('support.button'))
    expect(wrapper.text()).toContain(t('support.hold'))
  })

  it('opens nothing on release after a 1.9 s hold', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(1900)
    await button().trigger('pointerup')
    vi.advanceTimersByTime(5000)
    expect(open).not.toHaveBeenCalled()
  })

  it('opens the url once, on the release that follows a full 2 s hold', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(2000)
    // Still held: the ring is full, but browsers only allow a new tab on a user gesture.
    vi.advanceTimersByTime(5000)
    expect(open).not.toHaveBeenCalled()
    await button().trigger('pointerup')
    expect(open).toHaveBeenCalledExactlyOnceWith(url, '_blank', 'noopener')
    await button().trigger('pointerup')
    expect(open).toHaveBeenCalledOnce()
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
    await button().trigger('pointerup')
    expect(open).not.toHaveBeenCalled()
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(2000)
    await button().trigger('pointerup')
    expect(open).toHaveBeenCalledOnce()
  })

  it('takes a new hold after one has opened the url', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(2000)
    await button().trigger('pointerup')
    expect(button().classes()).not.toContain('holding')
    await button().trigger('pointerdown')
    expect(button().classes()).toContain('holding')
    vi.advanceTimersByTime(2000)
    await button().trigger('pointerup')
    expect(open).toHaveBeenCalledTimes(2)
  })

  it.each(['pointerleave', 'pointercancel'])(
    'cancels on %s, even after a full hold',
    async (event) => {
      await button().trigger('pointerdown')
      vi.advanceTimersByTime(1000)
      await button().trigger(event)
      vi.advanceTimersByTime(2000)
      await button().trigger('pointerup')
      expect(open).not.toHaveBeenCalled()

      await button().trigger('pointerdown')
      vi.advanceTimersByTime(2000)
      await button().trigger(event)
      expect(button().classes()).not.toContain('holding')
      await button().trigger('pointerup')
      expect(open).not.toHaveBeenCalled()
    },
  )

  it('resets when the page is hidden, so the next hold works', async () => {
    await button().trigger('pointerdown')
    vi.advanceTimersByTime(2000)
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    document.dispatchEvent(new Event('visibilitychange'))
    await wrapper.vm.$nextTick()
    expect(button().classes()).not.toContain('holding')
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    expect(open).not.toHaveBeenCalled()

    await button().trigger('pointerdown')
    vi.advanceTimersByTime(2000)
    await button().trigger('pointerup')
    expect(open).toHaveBeenCalledOnce()
  })

  it.each(['Enter', ' '])('opens on keyup after holding %j for 2 s', async (key) => {
    await button().trigger('keydown', { key })
    vi.advanceTimersByTime(1000)
    // Key repeat while held does not restart the hold.
    await button().trigger('keydown', { key, repeat: true })
    vi.advanceTimersByTime(1000)
    expect(open).not.toHaveBeenCalled()
    await button().trigger('keyup', { key })
    expect(open).toHaveBeenCalledOnce()
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
