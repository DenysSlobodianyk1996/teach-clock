import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import { mountScreen } from '@/test/mountScreen'
import { t, tEn, languageNow, languageKey } from '@/test/i18n'
import { usePlayerStore } from '@/stores/player'
import { stubDeviceTheme } from '@/test/deviceTheme'
import { stubInstalledWebApp } from '@/test/installedWebApp'
import { webManifestHref } from '@/webManifest'

type Screen = Awaited<ReturnType<typeof mountScreen>>['wrapper']

/** The header's round language button: it shows the language in use; a tap switches it. */
function languageButton(wrapper: Screen) {
  return wrapper.get('button.language')
}

/** The header's round theme button: it shows the theme in use; a tap switches it. */
function themeButton(wrapper: Screen) {
  return wrapper.get('button.theme')
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
    expect(languageButton(wrapper).text()).toBe(languageKey('uk'))
    expect(languageButton(wrapper).attributes('aria-label')).toBe(languageNow('uk'))
    expect(themeButton(wrapper).attributes('aria-label')).toBe(
      t('header.themeNow', { theme: t('themes.light') }),
    )
  })

  it('starts dark on a device in dark mode', async () => {
    stubDeviceTheme('dark')
    const wrapper = await open()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(themeButton(wrapper).attributes('aria-label')).toBe(
      t('header.themeNow', { theme: t('themes.dark') }),
    )
  })

  it('switches the interface to English', async () => {
    const wrapper = await open()
    await languageButton(wrapper).trigger('click')
    expect(wrapper.find('h1').text()).toBe(tEn('welcome.title'))
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(tEn('app.name'))
    expect(localStorage.getItem('teach-clock.locale')).toBe('en')
  })

  it('describes the page in the interface language', async () => {
    const wrapper = await open()
    const description = () => document.head.querySelector('meta[name="description"]')
    expect(description()?.getAttribute('content')).toBe(t('app.description'))
    await languageButton(wrapper).trigger('click')
    expect(description()?.getAttribute('content')).toBe(tEn('app.description'))
  })

  it('links the manifest in the interface language, to install under that Game Name', async () => {
    const wrapper = await open()
    expect(manifestLink().getAttribute('href')).toBe(webManifestHref(base, 'uk'))
    await languageButton(wrapper).trigger('click')
    expect(manifestLink().getAttribute('href')).toBe(webManifestHref(base, 'en'))
  })

  it('never changes the manifest of an installed Web App, so its name stays', async () => {
    stubInstalledWebApp()
    manifestLink().setAttribute('href', 'installed.webmanifest')
    const wrapper = await open()
    await languageButton(wrapper).trigger('click')
    expect(wrapper.find('h1').text()).toBe(tEn('welcome.title'))
    expect(manifestLink().getAttribute('href')).toBe('installed.webmanifest')
  })

  it('switches between light and dark with one tap and saves the choice', async () => {
    stubDeviceTheme('light')
    const wrapper = await open()
    await themeButton(wrapper).trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(themeButton(wrapper).attributes('aria-label')).toBe(
      t('header.themeNow', { theme: t('themes.dark') }),
    )
    expect(localStorage.getItem('teach-clock.theme')).toBe('dark')
    await themeButton(wrapper).trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('teach-clock.theme')).toBe('light')
  })

  it('has one theme control for every screen size', async () => {
    const wrapper = await open()
    expect(wrapper.findAll('button.theme')).toHaveLength(1)
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
