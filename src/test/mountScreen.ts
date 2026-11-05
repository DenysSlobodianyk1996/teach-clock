import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import type { Component } from 'vue'
import { createAppRouter } from '@/router'
import { createAppI18n } from '@/i18n'

/** Mounts a screen with the app's real Pinia, router and i18n, already on `path`. */
export async function mountScreen(screen: Component, path: string, arrange?: () => void) {
  const pinia = createPinia()
  setActivePinia(pinia)
  arrange?.()
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  const wrapper = mount(screen, { global: { plugins: [pinia, router, createAppI18n()] } })
  return { wrapper, router }
}
