import { afterEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'
import { CONTACT_EMAIL, CONTACT_SUBJECT, PRIVACY_URL } from '@/config'
import { mountComponent } from '@/test/mountComponent'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

function link(text: string) {
  const found = wrapper.findAll('a').find((a) => a.text() === text)
  if (!found) throw new Error(`No link "${text}"`)
  return found
}

describe('AppFooter', () => {
  it('links to the Privacy Page under the app base, in a new tab', () => {
    wrapper = mountComponent(AppFooter)
    const privacy = link(t('footer.privacy'))
    expect(privacy.attributes('href')).toBe(`${import.meta.env.BASE_URL}privacy.html`)
    expect(privacy.attributes('target')).toBe('_blank')
    expect(privacy.attributes('rel')).toContain('noopener')
  })

  it('writes to the author with a fixed subject', () => {
    wrapper = mountComponent(AppFooter)
    expect(link(t('footer.contact')).attributes('href')).toBe(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`,
    )
  })

  it('in the Android App, links to the public Privacy Page, which opens in the system browser', async () => {
    vi.resetModules()
    vi.doMock('@/platform', () => ({ isAndroidApp: true, supportUrl: null }))
    const { default: AndroidFooter } = await import('../AppFooter.vue')
    wrapper = mountComponent(AndroidFooter)
    expect(link(t('footer.privacy')).attributes('href')).toBe(PRIVACY_URL)
    vi.doUnmock('@/platform')
  })

  describe('Support Button', () => {
    const SUPPORT_URL = 'https://example.com/support'

    async function mountWith(platform: { isAndroidApp: boolean; supportUrl: string | null }) {
      vi.resetModules()
      vi.doMock('@/platform', () => platform)
      const { default: Footer } = await import('../AppFooter.vue')
      wrapper = mountComponent(Footer)
      vi.doUnmock('@/platform')
    }

    const supportButton = () =>
      wrapper.findAll('button').find((b) => b.attributes('aria-label') === t('support.button'))

    it('shows in the Web App with a link', async () => {
      await mountWith({ isAndroidApp: false, supportUrl: SUPPORT_URL })
      expect(supportButton()).toBeDefined()
      expect(wrapper.text()).toContain(t('support.hold'))
    })

    it('hides in the Web App with no link (unset, empty or not https)', async () => {
      await mountWith({ isAndroidApp: false, supportUrl: null })
      expect(supportButton()).toBeUndefined()
    })

    it('hides in the Android App even with a link', async () => {
      await mountWith({ isAndroidApp: true, supportUrl: SUPPORT_URL })
      expect(supportButton()).toBeUndefined()
    })

    it('opens its link on the release after a hold', async () => {
      vi.useFakeTimers()
      const open = vi.spyOn(window, 'open').mockReturnValue(null)
      await mountWith({ isAndroidApp: false, supportUrl: SUPPORT_URL })
      await supportButton()!.trigger('pointerdown')
      vi.advanceTimersByTime(2000)
      await supportButton()!.trigger('pointerup')
      expect(open).toHaveBeenCalledWith(SUPPORT_URL, '_blank', 'noopener')
      open.mockRestore()
      vi.useRealTimers()
    })
  })

  it('is the page footer', () => {
    wrapper = mountComponent(AppFooter)
    expect(wrapper.element.tagName).toBe('FOOTER')
  })
})
