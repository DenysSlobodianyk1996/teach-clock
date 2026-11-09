<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatClockTime, type ClockTime } from '@/game/clockTime'

/** Teach, after a wrong try: "Set correct answer" with the Hint under it. */
defineProps<{ hint: ClockTime }>()
const emit = defineEmits<{ help: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="hint-panel">
    <button class="btn btn-help" type="button" @click="emit('help')">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" />
      </svg>
      {{ t('teach.setCorrect') }}
    </button>
    <p class="hint">
      {{ t('teach.hint') }} <b>{{ formatClockTime(hint) }}</b>
    </p>
  </div>
</template>

<style scoped>
.hint-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.btn-help {
  padding: 0 26px;
  font-size: 20px;
  white-space: nowrap;
  background: var(--pop);
  color: var(--pop-ink);
  border: 3px dashed var(--accent);
  box-shadow: none;
}
.hint {
  margin: 0;
  font-size: 18px;
  color: var(--muted);
}
.hint b {
  color: var(--text);
  font-weight: 900;
}
@media (--phone) {
  .hint-panel {
    gap: 2px;
  }
  .btn-help {
    min-height: 48px;
    padding: 0 18px;
    font-size: 17px;
  }
  .hint {
    font-size: 16px;
  }
}
</style>
