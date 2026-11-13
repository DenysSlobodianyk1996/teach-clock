import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { createMemoryHistory } from 'vue-router'
import AppFooter from '../AppFooter.vue'
import { CONTACT_EMAIL, CONTACT_SUBJECT } from '@/config'
import { createAppI18n } from '@/i18n'
import { createAppRouter } from '@/router'
import { t } from '@/test/i18n'

/** The Footer with the app's i18n and router (its Privacy link is a router link). */
function mountComponent(component: Component) {
  const router = createAppRouter(createMemoryHistory())
  return mount(component, {
    global: { plugins: [createAppI18n(), router] },
    attachTo: document.body,
  })
}

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

function link(text: string) {
  const found = wrapper.findAll('a').find((a) => a.text() === text)
  if (!found) throw new Error(`No link "${text}"`)
  return found
}

describe('AppFooter', () => {
  it('opens the Privacy Page as an app screen, not a new tab', () => {
    wrapper = mountComponent(AppFooter)
    const privacy = link(t('footer.privacy'))
    expect(privacy.attributes('href')).toBe('/privacy')
    expect(privacy.attributes('target')).toBeUndefined()
  })

  it('writes to the author with a fixed subject', () => {
    wrapper = mountComponent(AppFooter)
    expect(link(t('footer.contact')).attributes('href')).toBe(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`,
    )
  })

  it('in the Android App, also opens the Privacy Page as an app screen, never the browser', async () => {
    vi.resetModules()
    vi.doMock('@/platform', () => ({ isAndroidApp: true, supportUrl: null }))
    const { default: AndroidFooter } = await import('../AppFooter.vue')
    wrapper = mountComponent(AndroidFooter)
    expect(link(t('footer.privacy')).attributes('href')).toBe('/privacy')
    expect(link(t('footer.privacy')).attributes('target')).toBeUndefined()
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
