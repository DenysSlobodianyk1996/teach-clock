import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import { mountScreen } from '@/test/mountScreen'
import { t, tEn } from '@/test/i18n'
import { usePlayerStore } from '@/stores/player'
import { stubDeviceTheme } from '@/test/deviceTheme'
import { stubInstalledWebApp } from '@/test/installedWebApp'
import { webManifestHref } from '@/webManifest'

type Screen = Awaited<ReturnType<typeof mountScreen>>['wrapper']

/** The pressed button in the switch group named `group`, by its accessible name. */
function switchButton(wrapper: Screen, group: string, name: string) {
  const found = wrapper
    .find(`[role="group"][aria-label="${group}"]`)
    .findAll('button')
    .find((b) => (b.attributes('aria-label') ?? b.text()) === name)
  if (!found) throw new Error(`No "${name}" in "${group}"`)
  return found
}

/** The header's sun/moon toggle. */
function themeToggle(wrapper: Screen) {
  return wrapper.get(`[role="switch"][aria-label="${t('header.darkTheme')}"]`)
}

async function open() {
  const screen = await mountScreen(App, '/')
  await flushPromises()
  return screen.wrapper
}

const base = import.meta.env.BASE_URL

/** The page's manifest link, as index.html has it. */
function manifestLink() {
  return document.head.querySelector('link[rel="manifest"]')!
}

describe('Preferences in the header', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    // index.html's head: the Web App's manifest link and the page description.
    document.head.innerHTML =
      '<link rel="manifest" href="start.webmanifest" /><meta name="description" content="" />'
  })
  afterEach(() => vi.unstubAllGlobals())

  it('starts in Ukrainian and light on a device in light mode', async () => {
    stubDeviceTheme('light')
    const wrapper = await open()
    expect(document.documentElement.lang).toBe('uk')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(
      switchButton(wrapper, t('header.language'), t('languages.uk')).attributes('aria-pressed'),
    ).toBe('true')
    expect(themeToggle(wrapper).attributes('aria-checked')).toBe('false')
  })

  it('starts dark on a device in dark mode', async () => {
    stubDeviceTheme('dark')
    const wrapper = await open()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(themeToggle(wrapper).attributes('aria-checked')).toBe('true')
  })

  it('switches the interface to English', async () => {
    const wrapper = await open()
    await switchButton(wrapper, t('header.language'), t('languages.en')).trigger('click')
    expect(wrapper.find('h1').text()).toBe(tEn('welcome.title'))
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(tEn('app.name'))
    expect(localStorage.getItem('teach-clock.locale')).toBe('en')
  })

  it('describes the page in the interface language', async () => {
    const wrapper = await open()
    const description = () => document.head.querySelector('meta[name="description"]')
    expect(description()?.getAttribute('content')).toBe(t('app.description'))
    await switchButton(wrapper, t('header.language'), t('languages.en')).trigger('click')
    expect(description()?.getAttribute('content')).toBe(tEn('app.description'))
  })

  it('links the manifest in the interface language, to install under that Game Name', async () => {
    const wrapper = await open()
    expect(manifestLink().getAttribute('href')).toBe(webManifestHref(base, 'uk'))
    await switchButton(wrapper, t('header.language'), t('languages.en')).trigger('click')
    expect(manifestLink().getAttribute('href')).toBe(webManifestHref(base, 'en'))
  })

  it('never changes the manifest of an installed Web App, so its name stays', async () => {
    stubInstalledWebApp()
    manifestLink().setAttribute('href', 'installed.webmanifest')
    const wrapper = await open()
    await switchButton(wrapper, t('header.language'), t('languages.en')).trigger('click')
    expect(wrapper.find('h1').text()).toBe(tEn('welcome.title'))
    expect(manifestLink().getAttribute('href')).toBe('installed.webmanifest')
  })

  it('switches between light and dark with one tap and saves the choice', async () => {
    stubDeviceTheme('light')
    const wrapper = await open()
    await themeToggle(wrapper).trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(themeToggle(wrapper).attributes('aria-checked')).toBe('true')
    expect(localStorage.getItem('teach-clock.theme')).toBe('dark')
    await themeToggle(wrapper).trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('teach-clock.theme')).toBe('light')
  })

  it('has one theme control for every screen size', async () => {
    const wrapper = await open()
    expect(wrapper.findAll('[role="switch"]')).toHaveLength(1)
  })
})

describe('the Footer', () => {
  beforeEach(() => localStorage.clear())

  it('is a page footer outside <main> on Welcome and Settings', async () => {
    const { wrapper, router } = await mountScreen(App, '/')
    await flushPromises()
    expect(wrapper.find('main').exists()).toBe(true)
    // Outside <main>, a <footer> is the page's contentinfo landmark on its own.
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('main footer').exists()).toBe(false)
    expect(wrapper.find('footer').attributes('role')).toBeUndefined()

    usePlayerStore().setName('Оля')
    await router.push('/settings')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('settings')
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('main footer').exists()).toBe(false)
  })
})
