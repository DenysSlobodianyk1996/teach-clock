<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/components/AppFooter.vue'
import AppFrame from '@/components/AppFrame.vue'
import AppHeader from '@/components/AppHeader.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { webManifestFile } from '@/webManifest'

const { locale, t } = useI18n()
const preferences = usePreferencesStore()
const route = useRoute()

// The Preferences drive the interface language and the theme on <html>.
watch(
  () => preferences.locale,
  (value) => {
    locale.value = value
    document.documentElement.lang = value
    document.title = t('app.name')
    // Installing takes the Game Name in this language (src/webManifest.ts). The Android App has
    // no manifest link.
    const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
    if (manifest) manifest.href = `${import.meta.env.BASE_URL}${webManifestFile(value)}`
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
