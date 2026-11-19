import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import App from '@/App.vue'
import { CONTACT_EMAIL, ISSUES_URL } from '@/config'
import { formatPrivacyDate, PRIVACY_UPDATED } from '@/privacy'
import { mountScreen } from '@/test/mountScreen'
import { t, tEn } from '@/test/i18n'
import { usePlayerStore } from '@/stores/player'
import { usePreferencesStore } from '@/stores/preferences'

let wrapper: VueWrapper
afterEach(() => {
  wrapper.unmount()
  localStorage.clear()
})

async function open(path: string, arrange?: () => void) {
  const screen = await mountScreen(App, path, arrange)
  wrapper = screen.wrapper
  await flushPromises()
  return screen.router
}

const backButton = () => wrapper.findAll('button').find((b) => b.text() === t('privacy.back'))!

describe('the Privacy Page in the app', () => {
  it('says that nothing is collected, with the author, the contact email, the issues and the date of the text', async () => {
    await open('/privacy-policy')
    expect(wrapper.find('h1').text()).toBe(t('privacy.title'))
    for (const key of ['intro', 'nothingSent', 'onDevice', 'results'])
      expect(wrapper.text()).toContain(t(`privacy.${key}`))
    expect(wrapper.find(`a[href="mailto:${CONTACT_EMAIL}"]`).exists()).toBe(true)
    expect(wrapper.text()).toContain(t('privacy.createdBy'))
    expect(wrapper.find(`a[href="${ISSUES_URL}"]`).exists()).toBe(true)
    // Only the contact email and the issues are links: no website.
    expect(wrapper.findAll('article a')).toHaveLength(2)
    expect(wrapper.find('time').attributes('datetime')).toBe(PRIVACY_UPDATED)
    expect(wrapper.find('time').text()).toBe(formatPrivacyDate('uk'))
  })

  it('is in the interface language', async () => {
    await open('/privacy-policy', () => (usePreferencesStore().locale = 'en'))
    expect(wrapper.find('h1').text()).toBe(tEn('privacy.title'))
    expect(wrapper.text()).toContain(tEn('privacy.nothingSent'))
    expect(wrapper.text()).toContain(tEn('privacy.createdBy'))
    expect(wrapper.find('time').text()).toBe(formatPrivacyDate('en'))
  })

  it('has no Footer of its own', async () => {
    await open('/privacy-policy')
    expect(wrapper.find('footer').exists()).toBe(false)
  })

  it('goes back to the screen that opened it', async () => {
    const router = await open('/settings', () => usePlayerStore().setName('Оля'))
    await router.push({ name: 'privacy' })
    await flushPromises()
    await backButton().trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('settings')
  })

  it('goes to Welcome when opened straight from its address', async () => {
    const router = await open('/privacy-policy')
    await backButton().trigger('click')
    // Welcome's component loads lazily, which takes longer than a flush.
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('welcome'))
  })
})
