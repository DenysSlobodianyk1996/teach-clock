<script setup lang="ts">
/**
 * The language and the theme in the header (batch 25): two round buttons like Home. Each shows what
 * is in use now, the language's code or the theme's sun or moon; a tap switches to the other.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderButton from './HeaderButton.vue'
import { LOCALES, usePreferencesStore } from '@/stores/preferences'

const { t } = useI18n()
const preferences = usePreferencesStore()

const otherLocale = computed(() => LOCALES.find((l) => l !== preferences.locale) ?? LOCALES[0])
</script>

<template>
  <HeaderButton
    circle
    class="language"
    :label="t('header.languageNow', { language: t(`languages.${preferences.locale}`) })"
    @click="preferences.locale = otherLocale"
  >
    {{ t(`languageCodes.${preferences.locale}`) }}
  </HeaderButton>

  <HeaderButton
    circle
    class="theme"
    :label="t('header.themeNow', { theme: t(`themes.${preferences.theme}`) })"
    @click="preferences.toggleTheme()"
  >
    <svg v-if="preferences.theme === 'dark'" class="moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 3.6a8.6 8.6 0 1 0 4.9 13.6A7 7 0 0 1 15.5 3.6Z" />
    </svg>
    <svg v-else class="sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path
        d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"
      />
    </svg>
  </HeaderButton>
</template>

<style scoped>
.language {
  font-size: 15px;
}
.sun {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
.sun circle {
  fill: currentColor;
}
.moon {
  fill: currentColor;
}
</style>
