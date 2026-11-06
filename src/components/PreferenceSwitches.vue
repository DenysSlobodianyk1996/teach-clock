<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LOCALES, THEMES, usePreferencesStore } from '@/stores/preferences'

const { t } = useI18n()
const preferences = usePreferencesStore()
</script>

<template>
  <div class="seg" role="group" :aria-label="t('header.language')">
    <button
      v-for="locale in LOCALES"
      :key="locale"
      type="button"
      :lang="locale"
      :aria-label="t(`languages.${locale}`)"
      :aria-pressed="preferences.locale === locale"
      @click="preferences.locale = locale"
    >
      {{ t(`languageCodes.${locale}`) }}
    </button>
  </div>

  <!-- Tablet and desktop: all three themes. -->
  <div class="seg themes-all" role="group" :aria-label="t('header.theme')">
    <button
      v-for="theme in THEMES"
      :key="theme"
      type="button"
      :aria-label="t(`themes.${theme}`)"
      :aria-pressed="preferences.theme === theme"
      @click="preferences.theme = theme"
    >
      <span class="swatch" :class="`sw-${theme}`" />
    </button>
  </div>

  <!-- Phone: one button that cycles middle → dark → light. -->
  <button
    class="icon-btn theme-cycle"
    type="button"
    :aria-label="t(`header.nextTheme.${preferences.theme}`)"
    @click="preferences.cycleTheme()"
  >
    <span class="swatch" :class="`sw-${preferences.theme}`" />
  </button>
</template>

<style scoped>
.seg {
  display: flex;
  padding: 4px;
  gap: 2px;
  border-radius: 999px;
  background: var(--bg-deep);
}
.seg button {
  min-width: 48px;
  height: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font:
    800 15px 'Nunito',
    sans-serif;
  cursor: pointer;
}
.seg button[aria-pressed='true'] {
  background: var(--surface-2);
  color: var(--text);
}

.swatch {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--line);
  vertical-align: middle;
}
.sw-middle {
  background: var(--swatch-middle);
}
.sw-dark {
  background: var(--swatch-dark);
}
.sw-light {
  background: var(--swatch-light);
}

.theme-cycle {
  display: none;
  width: 48px;
  padding: 0;
}
.theme-cycle .swatch {
  width: 26px;
  height: 26px;
}

@media (max-width: 600px), (max-height: 500px) {
  .themes-all {
    display: none;
  }
  .theme-cycle {
    display: inline-flex;
  }
}
</style>
