import { afterEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'
import { CONTACT_EMAIL } from '@/config'
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
      `mailto:${CONTACT_EMAIL}?subject=Contact%20support%20from%20teach%20clock%20for%20kids`,
    )
  })

  it('is the page footer', () => {
    wrapper = mountComponent(AppFooter)
    expect(wrapper.element.tagName).toBe('FOOTER')
  })
})
