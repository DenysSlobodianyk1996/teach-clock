<script setup lang="ts">
/**
 * The Privacy Page inside the app, in the interface language, with a Back button. The build renders
 * the same content into the static `privacy.html` for Google Play's listing (src/privacyPage.ts).
 */
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PrivacyContent from '@/components/PrivacyContent.vue'
import { goBack } from '@/router'

const { locale } = useI18n()
const router = useRouter()
</script>

<template>
  <PrivacyContent :locale="locale === 'en' ? 'en' : 'uk'">
    <template #back="{ label }">
      <button class="btn" type="button" @click="goBack(router)">{{ label }}</button>
    </template>
  </PrivacyContent>
</template>
