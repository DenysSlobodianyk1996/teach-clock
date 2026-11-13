<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { usePreferencesStore } from '@/stores/preferences'

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
  <div class="app">
    <AppHeader />
    <div class="stage-wrap">
      <div class="stage">
        <main class="screen">
          <RouterView />
        </main>
        <!-- Welcome and Settings only. Outside <main>, so it is the page's contentinfo landmark. -->
        <AppFooter v-if="route.meta.footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.stage-wrap {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* The play area keeps 4:3, fits the screen under the header and stops at ~1024 px. */
.stage {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  width: min(100%, var(--stage-max), calc((100dvh - var(--header-height)) * 4 / 3));
  aspect-ratio: 4 / 3;
  background: var(--bg);
}

/* The screen fills the stage above the Footer; each view grows inside it. */
.screen {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Desktop: the stage sits as a card on a deeper background. Not when taller than wide: that is the
   phone layout (see src/styles/media.ts). */
@media (min-width: 1100px) and (min-height: 860px) and (orientation: landscape) {
  .app {
    background: var(--bg-deep);
  }
  .stage-wrap {
    padding-top: 20px;
  }
  .stage {
    width: min(100%, var(--stage-max), calc((100dvh - var(--header-height) - 40px) * 4 / 3));
    border-radius: 32px;
    box-shadow: var(--shadow);
  }
}

/* Phones (upright or sideways): no 4:3, the screen stacks and scrolls. */
@media (--phone) {
  .stage {
    width: 100%;
    aspect-ratio: auto;
    min-height: calc(100dvh - var(--header-height));
  }
}
</style>
