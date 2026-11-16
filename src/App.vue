<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/components/AppFooter.vue'
import AppFrame from '@/components/AppFrame.vue'
import AppHeader from '@/components/AppHeader.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { webManifestHref } from '@/webManifest'

const { locale, t } = useI18n()
const preferences = usePreferencesStore()
const route = useRoute()

/**
 * Running as an installed Web App. Its manifest link is left alone there: a browser that sees
 * another manifest may rename the installed app, and its name never changes (decision 8, batch
 * 13). index.html's pre-paint script checks the same.
 */
function isInstalledWebApp() {
  return typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches
}

// The Preferences drive the interface language and the theme on <html>.
watch(
  () => preferences.locale,
  (value) => {
    locale.value = value
    document.documentElement.lang = value
    document.title = t('app.name')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('app.description'))
    // Installing takes the Game Name in this language (src/webManifest.ts). The Android App has
    // no manifest link.
    const manifest = document.querySelector('link[rel="manifest"]')
    if (manifest && !isInstalledWebApp()) {
      manifest.setAttribute('href', webManifestHref(import.meta.env.BASE_URL, value))
    }
  },
  { immediate: true },
)
watch(
  () => preferences.theme,
  (value) => {
    const root = document.documentElement
    root.dataset.theme = value
    // The browser bar takes the theme's background.
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
  },
  { immediate: true },
)
</script>

<template>
  <AppFrame>
    <template #header><AppHeader /></template>
    <RouterView />
    <!-- Welcome and Settings only. -->
    <template v-if="route.meta.footer" #footer><AppFooter /></template>
  </AppFrame>
</template>
