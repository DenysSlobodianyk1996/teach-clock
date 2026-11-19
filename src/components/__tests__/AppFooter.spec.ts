import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { createMemoryHistory } from 'vue-router'
import AppFooter from '../AppFooter.vue'
import { CONTACT_EMAIL, CONTACT_SUBJECT } from '@/config'
import { PRIVACY_PAGE } from '@/static/privacy'
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
  it('opens the static Privacy Page by its full file name, not in a new tab', () => {
    wrapper = mountComponent(AppFooter)
    const privacy = link(t('footer.privacy'))
    expect(privacy.attributes('href')).toBe(`${import.meta.env.BASE_URL}${PRIVACY_PAGE}`)
    expect(privacy.attributes('target')).toBeUndefined()
  })

  it('writes to the author with a fixed subject', () => {
    wrapper = mountComponent(AppFooter)
    expect(link(t('footer.contact')).attributes('href')).toBe(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`,
    )
  })

  it('is the page footer', () => {
    wrapper = mountComponent(AppFooter)
    expect(wrapper.element.tagName).toBe('FOOTER')
  })
})
