<script setup lang="ts">
/**
 * The static privacy/index.html for Google Play's listing, rendered at build time
 * (src/privacyStatic.ts): the app's frame and header (brand only: the switches need JavaScript),
 * links to each language, then the Privacy Page in every language on the list. Its way back is a link
 * to the web game, one folder up.
 */
import AppFrame from '@/components/AppFrame.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import PrivacyContent from '@/components/PrivacyContent.vue'
import { LANGUAGES } from '@/i18n/locales'
</script>

<template>
  <AppFrame>
    <template #header><HeaderBar /></template>
    <nav class="languages" aria-label="Language / Мова">
      <a
        v-for="language in LANGUAGES"
        :key="language.code"
        :href="`#${language.code}`"
        :hreflang="language.code"
        >{{ language.name }}</a
      >
    </nav>
    <PrivacyContent
      v-for="({ code }, i) in LANGUAGES"
      :id="code"
      :key="code"
      :locale="code"
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
