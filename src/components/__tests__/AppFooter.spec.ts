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
    expect(privacy.attributes('href')).toBe('/privacy-policy')
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
    vi.doMock('@/platform', () => ({ isAndroidApp: true }))
    const { default: AndroidFooter } = await import('../AppFooter.vue')
    wrapper = mountComponent(AndroidFooter)
    expect(link(t('footer.privacy')).attributes('href')).toBe('/privacy-policy')
    expect(link(t('footer.privacy')).attributes('target')).toBeUndefined()
    vi.doUnmock('@/platform')
  })

  it('is the page footer', () => {
    wrapper = mountComponent(AppFooter)
    expect(wrapper.element.tagName).toBe('FOOTER')
  })
})
