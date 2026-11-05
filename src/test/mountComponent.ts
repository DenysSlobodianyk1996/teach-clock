import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { createAppI18n } from '@/i18n'

/** Mounts a component with the app's i18n, attached to the page so focus works. */
export function mountComponent(component: Component, props: Record<string, unknown> = {}) {
  return mount(component, {
    props,
    global: { plugins: [createAppI18n()] },
    attachTo: document.body,
  })
}
