<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PopupDialog from './PopupDialog.vue'

/** "Leave this Round?" Keep playing is the safe, focused choice; Escape and the scrim also keep playing. */
const emit = defineEmits<{ stay: []; leave: [] }>()

const { t } = useI18n()
</script>

<template>
  <PopupDialog labelledby="leave-title" describedby="leave-body" @dismiss="emit('stay')">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4h5v16h-5" />
      <path d="M9 8l-4 4 4 4" />
      <path d="M5 12h11" />
    </svg>
    <h2 id="leave-title">{{ t('leave.title') }}</h2>
    <p id="leave-body">{{ t('leave.body') }}</p>
    <div class="actions">
      <button class="btn" type="button" @click="emit('stay')">
        {{ t('leave.stay') }}
      </button>
      <button class="btn leave" type="button" @click="emit('leave')">
        {{ t('leave.leave') }}
      </button>
    </div>
  </PopupDialog>
</template>

<style scoped>
svg {
  width: 48px;
  height: 48px;
  color: var(--hour);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}
.leave {
  background: var(--bg-deep);
  color: var(--text);
}
</style>
