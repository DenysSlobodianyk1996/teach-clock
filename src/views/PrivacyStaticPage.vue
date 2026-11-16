<script setup lang="ts">
/**
 * The static privacy.html for Google Play's listing, rendered at build time (src/privacyStatic.ts):
 * the app's frame and header (brand only: the switches need JavaScript), then the Privacy Page in
 * Ukrainian and in English. Its way back is a link to the web game.
 */
import AppFrame from '@/components/AppFrame.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import PrivacyContent from '@/components/PrivacyContent.vue'
</script>

<template>
  <AppFrame>
    <template #header><HeaderBar /></template>
    <PrivacyContent
      v-for="(locale, i) in ['uk', 'en'] as const"
      :id="locale"
      :key="locale"
      :locale="locale"
      :heading-level="i === 0 ? 1 : 2"
    >
      <template #back="{ label }">
        <a class="btn" href="./">{{ label }}</a>
      </template>
    </PrivacyContent>
  </AppFrame>
</template>
