<script setup lang="ts">
/**
 * The Privacy Page inside the app, in the interface language, with a Back button. The build renders
 * the same content into the static `privacy/index.html` for Google Play's listing (src/privacyStatic.ts).
 */
import { useRouter } from 'vue-router'
import PrivacyContent from '@/components/PrivacyContent.vue'
import { goBack } from '@/router'
import { usePreferencesStore } from '@/stores/preferences'

const preferences = usePreferencesStore()
const router = useRouter()
</script>

<template>
  <PrivacyContent :locale="preferences.locale">
    <template #back="{ label }">
      <button class="btn" type="button" @click="goBack(router)">{{ label }}</button>
    </template>
  </PrivacyContent>
</template>
