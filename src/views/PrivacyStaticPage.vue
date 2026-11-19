<script setup lang="ts">
/**
 * The static privacy/index.html for Google Play's listing, rendered at build time
 * (src/privacyStatic.ts): the app's frame and header (brand only: the switches need JavaScript),
 * links to each language, then the Privacy Page in English and in Ukrainian. Its way back is a link
 * to the web game, one folder up.
 */
import AppFrame from '@/components/AppFrame.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import PrivacyContent from '@/components/PrivacyContent.vue'

const LOCALES = ['en', 'uk'] as const
</script>

<template>
  <AppFrame>
    <template #header><HeaderBar /></template>
    <nav class="languages" aria-label="Language / Мова">
      <a href="#en" hreflang="en">English</a>
      <a href="#uk" hreflang="uk">Українська</a>
    </nav>
    <PrivacyContent
      v-for="(locale, i) in LOCALES"
      :id="locale"
      :key="locale"
      :locale="locale"
      :heading-level="i === 0 ? 1 : 2"
    >
      <template #back="{ label }">
        <a class="btn" href="../">{{ label }}</a>
      </template>
    </PrivacyContent>
  </AppFrame>
</template>

<style scoped>
.languages {
  display: flex;
  gap: 20px;
  width: min(100%, 720px);
  margin: 0 auto;
  padding: 16px clamp(20px, 6vw, 64px) 0;
}
.languages a {
  color: inherit;
  font-weight: 700;
  text-underline-offset: 3px;
}
</style>
