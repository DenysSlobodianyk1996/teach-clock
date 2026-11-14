<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES, usePreferencesStore } from '@/stores/preferences'

const { t } = useI18n()
const preferences = usePreferencesStore()
const dark = computed(() => preferences.theme === 'dark')
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

  <!-- Sun and moon on a track; the knob sits under the chosen one. The same on every screen. -->
  <button
    class="theme-toggle"
    :class="{ dark }"
    type="button"
    role="switch"
    :aria-checked="dark"
    :aria-label="t('header.darkTheme')"
    @click="preferences.toggleTheme()"
  >
    <span class="knob" aria-hidden="true" />
    <svg class="icon sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path
        d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"
      />
    </svg>
    <svg class="icon moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 3.6a8.6 8.6 0 1 0 4.9 13.6A7 7 0 0 1 15.5 3.6Z" />
    </svg>
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

.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 88px;
  height: 48px;
  padding: 4px;
  border: 0;
  border-radius: 999px;
  background: var(--bg-deep);
  cursor: pointer;
}
.knob {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
  transition:
    transform 0.25s ease,
    background-color 0.25s ease;
}
.dark .knob {
  transform: translateX(40px);
  background: var(--surface-2);
}
.icon {
  position: relative;
  width: 40px;
  height: 22px;
  color: var(--muted);
  transition: color 0.25s ease;
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
.theme-toggle:not(.dark) .sun {
  color: var(--accent-ink);
}
.dark .moon {
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .knob,
  .icon {
    transition: none;
  }
}
</style>
