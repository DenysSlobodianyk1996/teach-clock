<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * The ⓘ after a heading that opens its Info Popup. Shown on the phone layout only: on desktop the
 * text it stands for is on the screen. The parent handles the click.
 */
const { t } = useI18n()
</script>

<template>
  <button class="icon-btn info-btn" type="button" :aria-label="t('info.more')">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.4" r="0.6" fill="currentColor" stroke-width="1.6" />
    </svg>
  </button>
</template>

<style scoped>
.info-btn {
  display: none;
  flex: none;
  width: 44px;
  min-width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  color: var(--muted);
  vertical-align: middle;
}
.info-btn svg {
  width: 26px;
  height: 26px;
}
@media (--phone) {
  .info-btn {
    display: inline-flex;
  }
}
</style>
