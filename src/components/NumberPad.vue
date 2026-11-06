<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/** On-screen digits 0–9 and a clear key. Only forwards presses. */
defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ digit: [digit: number]; clear: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="pad">
    <button
      v-for="d in 9"
      :key="d"
      class="key"
      type="button"
      :disabled="disabled"
      @click="emit('digit', d)"
    >
      {{ d }}
    </button>
    <button class="key zero" type="button" :disabled="disabled" @click="emit('digit', 0)">0</button>
    <button
      class="key"
      type="button"
      :disabled="disabled"
      :aria-label="t('round.clear')"
      @click="emit('clear')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M8 5h12v14H8l-6-7z" />
        <path d="M12 9l5 6M17 9l-5 6" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.pad {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.key {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  border: 0;
  border-radius: 20px;
  background: var(--surface-2);
  color: var(--text);
  font:
    900 30px 'Nunito',
    sans-serif;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
}
.key:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.16);
}
.key svg {
  width: 30px;
  height: 30px;
}
.zero {
  grid-column: span 2;
}
@media (max-width: 600px), (max-height: 500px) {
  .pad {
    gap: 6px;
  }
  /* The smallest touch target allowed, so the whole answer fits a small phone. */
  .key {
    height: 48px;
  }
}
</style>
